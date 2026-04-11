import { VerificationCodePurpose } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';

import { getAppBaseUrl } from '@/lib/app-url';
import { isSmtpConfigured, sendEmail } from '@/lib/email';
import { prisma } from '@/prisma/prisma-client';

const TOKEN_TTL_MS: Record<VerificationCodePurpose, number> = {
  EMAIL_VERIFICATION: 1000 * 60 * 60 * 24,
  PASSWORD_RESET: 1000 * 60 * 30,
};

const REQUEST_COOLDOWN_MS = 1000 * 60;

type AuthUserPayload = {
  email: string;
  id: number;
  name: string;
  phone: string;
  role: 'USER' | 'EMPLOYEE' | 'ADMIN';
  surname: string;
};

type ValidCredentialsResult =
  | { status: 'invalid' }
  | { email: string; status: 'unverified' }
  | { status: 'ok'; user: AuthUserPayload };

type TokenState = 'invalid' | 'expired' | 'valid';
type EmailVerificationResult = 'already-verified' | 'expired' | 'invalid' | 'success';
type PasswordResetResult = 'expired' | 'invalid' | 'success';
type TokenIssueResult =
  | {
      delivery: 'preview' | 'smtp';
      previewUrl: string | null;
      retryAfterSeconds: null;
      status: 'sent';
    }
  | {
      retryAfterSeconds: number;
      status: 'rate_limited';
    };

function isEmailVerificationRequired() {
  return process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === 'true';
}

function createTokenValue() {
  return randomBytes(32).toString('hex');
}

function getAppUrl() {
  return getAppBaseUrl();
}

function getPreviewUrl(pathname: string, token: string) {
  const url = new URL(pathname, getAppUrl());

  url.searchParams.set('token', token);

  return url.toString();
}

function getExpirationDate(purpose: VerificationCodePurpose) {
  return new Date(Date.now() + TOKEN_TTL_MS[purpose]);
}

function getRetryAfterSeconds(createdAt: Date) {
  const retryAfterMs = REQUEST_COOLDOWN_MS - (Date.now() - createdAt.getTime());

  return Math.max(1, Math.ceil(retryAfterMs / 1000));
}

function getEmailTemplate(purpose: VerificationCodePurpose, actionUrl: string, userEmail: string) {
  if (purpose === VerificationCodePurpose.EMAIL_VERIFICATION) {
    return {
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
          <h2 style="margin-bottom:16px">Підтвердіть email для Cat Hotel</h2>
          <p>Ми отримали запит на створення акаунта для <strong>${userEmail}</strong>.</p>
          <p>
            <a href="${actionUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#f97316;color:#ffffff;text-decoration:none;font-weight:600">
              Підтвердити email
            </a>
          </p>
          <p>Посилання дійсне 24 години.</p>
        </div>
      `,
      subject: 'Підтвердження email для Cat Hotel',
      text: `Підтвердіть email для Cat Hotel: ${actionUrl}. Посилання дійсне 24 години.`,
    };
  }

  return {
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
        <h2 style="margin-bottom:16px">Відновлення пароля Cat Hotel</h2>
        <p>Ми отримали запит на зміну пароля для <strong>${userEmail}</strong>.</p>
        <p>
          <a href="${actionUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#f97316;color:#ffffff;text-decoration:none;font-weight:600">
            Задати новий пароль
          </a>
        </p>
        <p>Посилання дійсне 30 хвилин.</p>
      </div>
    `,
    subject: 'Відновлення пароля для Cat Hotel',
    text: `Щоб змінити пароль у Cat Hotel, відкрийте посилання: ${actionUrl}. Посилання дійсне 30 хвилин.`,
  };
}

async function issueVerificationCode(
  userId: number,
  email: string,
  purpose: VerificationCodePurpose,
  pathname: string,
): Promise<TokenIssueResult> {
  const latestToken = await prisma.verificationCode.findFirst({
    where: {
      purpose,
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      createdAt: true,
    },
  });

  if (latestToken && Date.now() - latestToken.createdAt.getTime() < REQUEST_COOLDOWN_MS) {
    return {
      retryAfterSeconds: getRetryAfterSeconds(latestToken.createdAt),
      status: 'rate_limited',
    };
  }

  const token = await replaceVerificationCode(userId, purpose);
  const previewUrl = getPreviewUrl(pathname, token.code);
  const emailTemplate = getEmailTemplate(purpose, previewUrl, email);
  const sentViaSmtp = await sendEmail({
    html: emailTemplate.html,
    subject: emailTemplate.subject,
    text: emailTemplate.text,
    to: email,
  });

  if (!sentViaSmtp) {
    logEmail(purpose, email, previewUrl);
  }

  return {
    delivery: sentViaSmtp && isSmtpConfigured() ? 'smtp' : 'preview',
    previewUrl: sentViaSmtp ? null : previewUrl,
    retryAfterSeconds: null,
    status: 'sent',
  };
}

async function replaceVerificationCode(userId: number, purpose: VerificationCodePurpose) {
  await prisma.verificationCode.deleteMany({
    where: {
      purpose,
      userId,
    },
  });

  return prisma.verificationCode.create({
    data: {
      code: createTokenValue(),
      expiresAt: getExpirationDate(purpose),
      purpose,
      userId,
    },
  });
}

function logEmail(kind: VerificationCodePurpose, email: string, url: string) {
  console.info(`[auth-email:${kind}] ${email} -> ${url}`);
}

export async function validateUserCredentials(
  email: string,
  password: string,
): Promise<ValidCredentialsResult> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { status: 'invalid' };
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return { status: 'invalid' };
  }

  if (!user.verified && isEmailVerificationRequired()) {
    return {
      email: user.email,
      status: 'unverified',
    };
  }

  return {
    status: 'ok',
    user: {
      email: user.email,
      id: user.id,
      name: user.name,
      phone: user.phone ?? '',
      role: user.role,
      surname: user.surname,
    },
  };
}

export async function createEmailVerification(userId: number, email: string) {
  return issueVerificationCode(
    userId,
    email,
    VerificationCodePurpose.EMAIL_VERIFICATION,
    '/verify-email',
  );
}

export async function createPasswordReset(userId: number, email: string) {
  return issueVerificationCode(
    userId,
    email,
    VerificationCodePurpose.PASSWORD_RESET,
    '/reset-password',
  );
}

export async function getPasswordResetTokenState(token: string): Promise<TokenState> {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      code: token,
      purpose: VerificationCodePurpose.PASSWORD_RESET,
    },
    select: {
      consumedAt: true,
      expiresAt: true,
    },
  });

  if (!verificationCode || verificationCode.consumedAt) {
    return 'invalid';
  }

  if (verificationCode.expiresAt <= new Date()) {
    return 'expired';
  }

  return 'valid';
}

export async function consumeEmailVerificationToken(
  token: string,
): Promise<EmailVerificationResult> {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      code: token,
      purpose: VerificationCodePurpose.EMAIL_VERIFICATION,
    },
    include: {
      user: true,
    },
  });

  if (!verificationCode) {
    return 'invalid';
  }

  if (verificationCode.user.verified) {
    return 'already-verified';
  }

  if (verificationCode.consumedAt || verificationCode.expiresAt <= new Date()) {
    return verificationCode.expiresAt <= new Date() ? 'expired' : 'invalid';
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verificationCode.userId },
      data: {
        verified: new Date(),
      },
    }),
    prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: {
        consumedAt: new Date(),
      },
    }),
    prisma.verificationCode.deleteMany({
      where: {
        id: {
          not: verificationCode.id,
        },
        purpose: VerificationCodePurpose.EMAIL_VERIFICATION,
        userId: verificationCode.userId,
      },
    }),
  ]);

  return 'success';
}

export async function consumePasswordResetToken(
  token: string,
  nextPassword: string,
): Promise<PasswordResetResult> {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      code: token,
      purpose: VerificationCodePurpose.PASSWORD_RESET,
    },
    select: {
      consumedAt: true,
      expiresAt: true,
      id: true,
      userId: true,
    },
  });

  if (!verificationCode || verificationCode.consumedAt) {
    return 'invalid';
  }

  if (verificationCode.expiresAt <= new Date()) {
    return 'expired';
  }

  const passwordHash = await hash(nextPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verificationCode.userId },
      data: {
        password: passwordHash,
      },
    }),
    prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: {
        consumedAt: new Date(),
      },
    }),
    prisma.verificationCode.deleteMany({
      where: {
        id: {
          not: verificationCode.id,
        },
        purpose: VerificationCodePurpose.PASSWORD_RESET,
        userId: verificationCode.userId,
      },
    }),
  ]);

  return 'success';
}
