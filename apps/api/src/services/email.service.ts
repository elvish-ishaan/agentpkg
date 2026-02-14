import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

interface SendInvitationEmailInput {
  to: string;
  orgName: string;
  inviterName: string;
  acceptUrl: string;
}

interface SendInvitationAcceptedEmailInput {
  to: string;
  orgName: string;
  memberName: string;
  memberEmail: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
    } = process.env;

    // Check if SMTP is configured
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      logger.warn('SMTP not configured. Email functionality will be disabled.');
      this.isConfigured = false;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587'),
        secure: SMTP_SECURE === 'true',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      this.isConfigured = true;
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize email service');
      this.isConfigured = false;
    }
  }

  /**
   * Send invitation email to a user
   */
  async sendInvitationEmail(input: SendInvitationEmailInput): Promise<void> {
    const { to, orgName, inviterName, acceptUrl } = input;

    if (!this.isConfigured || !this.transporter) {
      logger.warn(
        { to, orgName },
        'SMTP not configured. Invitation email not sent. In development, use the accept URL directly.'
      );
      logger.info({ acceptUrl }, 'Invitation accept URL');
      return;
    }

    const html = this.getInvitationEmailTemplate(orgName, inviterName, acceptUrl);

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || `AgentPkg <noreply@agentpkg.com>`,
        to,
        subject: `You've been invited to join ${orgName} on AgentPkg`,
        html,
      });

      logger.info({ to, orgName }, 'Invitation email sent successfully');
    } catch (error) {
      logger.error({ error, to, orgName }, 'Failed to send invitation email');
      throw error;
    }
  }

  /**
   * Send notification email when invitation is accepted
   */
  async sendInvitationAcceptedEmail(
    input: SendInvitationAcceptedEmailInput
  ): Promise<void> {
    const { to, orgName, memberName, memberEmail } = input;

    if (!this.isConfigured || !this.transporter) {
      logger.warn(
        { to, orgName },
        'SMTP not configured. Invitation accepted notification not sent.'
      );
      return;
    }

    const html = this.getInvitationAcceptedEmailTemplate(
      orgName,
      memberName,
      memberEmail
    );

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || `AgentPkg <noreply@agentpkg.com>`,
        to,
        subject: `${memberName} has joined ${orgName}`,
        html,
      });

      logger.info({ to, orgName }, 'Invitation accepted email sent successfully');
    } catch (error) {
      logger.error(
        { error, to, orgName },
        'Failed to send invitation accepted email'
      );
      // Don't throw - this is a non-critical notification
    }
  }

  /**
   * HTML template for invitation email
   */
  private getInvitationEmailTemplate(
    orgName: string,
    inviterName: string,
    acceptUrl: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation to ${orgName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">
                AgentPkg
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1a1a1a;">
                You've been invited to join ${orgName}
              </h2>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #4a4a4a;">
                <strong>${inviterName}</strong> has invited you to join their organization on AgentPkg.
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #4a4a4a;">
                As a member, you'll be able to publish and access private agents and skills within the organization.
              </p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${acceptUrl}" style="display: inline-block; padding: 12px 32px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.5; color: #6a6a6a;">
                Or copy and paste this URL into your browser:<br>
                <a href="${acceptUrl}" style="color: #0066cc; word-break: break-all;">${acceptUrl}</a>
              </p>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.5; color: #6a6a6a;">
                This invitation will expire in 7 days.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8a8a8a;">
                This invitation was sent by ${inviterName} via AgentPkg
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * HTML template for invitation accepted notification
   */
  private getInvitationAcceptedEmailTemplate(
    orgName: string,
    memberName: string,
    memberEmail: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Member Joined</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a;">
                AgentPkg
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1a1a1a;">
                ${memberName} has joined ${orgName}
              </h2>

              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #4a4a4a;">
                <strong>${memberName}</strong> (${memberEmail}) has accepted your invitation and is now a member of your organization.
              </p>

              <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #4a4a4a;">
                They can now publish and access private agents and skills within the organization.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8a8a8a;">
                AgentPkg - Package Manager for AI Agents
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}

export const emailService = new EmailService();
