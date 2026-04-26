import nodemailer from 'nodemailer';

type SendEmailParams = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

type SmtpConfig = {
  from: string;
  provider: 'smtp';
  transport: string | Record<string, unknown>;
};

function getEnvValue(keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();

    if (value) {
      return value;
    }
  }

  return null;
}

function isEmailDebugEnabled() {
  return process.env.EMAIL_DEBUG === 'true';
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function getSmtpConfig(): SmtpConfig | null {
  const gmailUser = getEnvValue(['EMAIL_USER']);
  const gmailPass = getEnvValue(['EMAIL_PASS']);
  const smtpUrl = getEnvValue(['SMTP_URL', 'EMAIL_SERVER', 'MAIL_URL']);
  const host = getEnvValue(['SMTP_HOST', 'EMAIL_SERVER_HOST', 'MAIL_HOST']);
  const port = getEnvValue(['SMTP_PORT', 'EMAIL_SERVER_PORT', 'MAIL_PORT']);
  const user = getEnvValue(['SMTP_USER', 'EMAIL_SERVER_USER', 'MAIL_USER', 'EMAIL_USER']);
  const pass = getEnvValue(['SMTP_PASS', 'EMAIL_SERVER_PASSWORD', 'MAIL_PASSWORD', 'EMAIL_PASS']);
  const secureRaw = getEnvValue(['SMTP_SECURE', 'EMAIL_SERVER_SECURE', 'MAIL_SECURE']);
  const from = getEnvValue(['SMTP_FROM', 'EMAIL_FROM', 'MAIL_FROM']) ?? gmailUser;

  if (!from) {
    return null;
  }

  if (smtpUrl) {
    return {
      from,
      provider: 'smtp',
      transport: smtpUrl,
    };
  }

  if (!host || !port || !user || !pass) {
    if (!gmailUser || !gmailPass) {
      return null;
    }

    return {
      from,
      provider: 'smtp',
      transport: {
        auth: {
          pass: gmailPass,
          user: gmailUser,
        },
        service: 'gmail',
      },
    };
  }

  const portNumber = Number(port);

  if (!Number.isFinite(portNumber) || portNumber <= 0) {
    return null;
  }

  return {
    from,
    provider: 'smtp',
    transport: {
      auth: {
        pass,
        user,
      },
      host,
      port: portNumber,
      secure: secureRaw ? secureRaw === 'true' : portNumber === 465,
    },
  };
}

export function isSmtpConfigured() {
  return getSmtpConfig() !== null;
}

export async function sendEmail({ html, subject, text, to }: SendEmailParams) {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    if (isEmailDebugEnabled()) {
      console.warn('[email] delivery skipped: no SMTP configuration found');
    }

    return false;
  }

  try {
    const transporter = nodemailer.createTransport(
      smtpConfig.transport as nodemailer.TransportOptions,
    );

    const result = await transporter.sendMail({
      from: smtpConfig.from,
      html,
      subject,
      text,
      to,
    });

    if (isEmailDebugEnabled()) {
      console.info('[email] delivery accepted', {
        accepted: result.accepted,
        messageId: result.messageId,
        provider: smtpConfig.provider,
        rejected: result.rejected,
        response: result.response,
        to,
      });
    }

    return true;
  } catch (error) {
    console.error('SMTP delivery failed, falling back to preview link.', error);

    if (isEmailDebugEnabled()) {
      console.error('[email] delivery failed', {
        error: getErrorMessage(error),
        from: smtpConfig.from,
        provider: smtpConfig.provider,
        to,
      });
    }

    return false;
  }
}
