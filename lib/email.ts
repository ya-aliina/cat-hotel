import nodemailer from 'nodemailer';

type SendEmailParams = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

function getSmtpConfig() {
  const smtpUrl = process.env.SMTP_URL;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!from) {
    return null;
  }

  if (smtpUrl) {
    return {
      from,
      transport: smtpUrl,
    };
  }

  if (!host || !port || !user || !pass) {
    return null;
  }

  return {
    from,
    transport: {
      auth: {
        pass,
        user,
      },
      host,
      port: Number(port),
      secure: process.env.SMTP_SECURE === 'true',
    },
  };
}

export function isSmtpConfigured() {
  return getSmtpConfig() !== null;
}

export async function sendEmail({ html, subject, text, to }: SendEmailParams) {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    return false;
  }

  try {
    const transporter = nodemailer.createTransport(smtpConfig.transport);

    await transporter.sendMail({
      from: smtpConfig.from,
      html,
      subject,
      text,
      to,
    });

    return true;
  } catch (error) {
    console.error('SMTP delivery failed, falling back to preview link.', error);

    return false;
  }
}
