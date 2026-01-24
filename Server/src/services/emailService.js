import nodemailer from 'nodemailer';

/**
 * Email Service for sending OTPs
 * Supports Gmail, Outlook, and other SMTP providers
 */

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  /**
   * Initialize email transporter with credentials from environment variables
   */
  async initialize() {
    try {
      // Check if email credentials are configured
      if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn('⚠️  Email service not configured. Set EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASSWORD in .env');
        this.initialized = false;
        return false;
      }

      // Create transporter based on service
      if (process.env.EMAIL_SERVICE === 'gmail') {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
          }
        });
      } else if (process.env.EMAIL_SERVICE === 'smtp') {
        // Custom SMTP configuration
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
      } else {
        // Default to the specified service (outlook, yahoo, etc.)
        this.transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
      }

      // Verify connection
      await this.transporter.verify();
      this.initialized = true;
      console.log('✅ Email service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error.message);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Send OTP via email
   * @param {string} email - Recipient email address
   * @param {string} otp - One-time password
   * @param {string} name - Recipient name (optional)
   */
  async sendOTP(email, otp, name = 'User') {
    try {
      // Initialize if not already done
      if (!this.initialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          console.log(`📧 [DEV MODE] Email to ${email}: Your OTP is ${otp}`);
          return { success: true, mode: 'development' };
        }
      }

      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Grocery Management',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Your Login OTP - Grocery Management',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #f9f9f9;
                border-radius: 10px;
                padding: 30px;
                border: 1px solid #e0e0e0;
              }
              .header {
                text-align: center;
                color: #4CAF50;
                margin-bottom: 20px;
              }
              .otp-box {
                background-color: #4CAF50;
                color: white;
                font-size: 32px;
                font-weight: bold;
                text-align: center;
                padding: 20px;
                border-radius: 8px;
                letter-spacing: 8px;
                margin: 30px 0;
              }
              .message {
                text-align: center;
                color: #666;
                margin: 20px 0;
              }
              .warning {
                background-color: #fff3cd;
                border: 1px solid #ffc107;
                border-radius: 5px;
                padding: 15px;
                margin-top: 20px;
                font-size: 14px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #999;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="header">🛒 Grocery Management</h1>
              <p>Hello ${name},</p>
              <p>Your One-Time Password (OTP) for login is:</p>
              
              <div class="otp-box">${otp}</div>
              
              <p class="message">This OTP is valid for <strong>10 minutes</strong>.</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                • Do not share this OTP with anyone<br>
                • Our team will never ask for your OTP<br>
                • If you didn't request this, please ignore this email
              </div>
              
              <div class="footer">
                <p>This is an automated message, please do not reply.</p>
                <p>&copy; ${new Date().getFullYear()} Grocery Management System</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send OTP email:', error.message);
      
      // Fallback to console logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 [DEV MODE] Email to ${email}: Your OTP is ${otp}`);
        return { success: true, mode: 'development' };
      }
      
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  /**
   * Send welcome email
   * @param {string} email - Recipient email address
   * @param {string} name - Recipient name
   */
  async sendWelcomeEmail(email, name) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Grocery Management',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Welcome to Grocery Management!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; color: #4CAF50; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="header">🛒 Welcome to Grocery Management!</h1>
              <p>Hello ${name},</p>
              <p>Thank you for joining us! Your account has been created successfully.</p>
              <p>You can now enjoy our services and manage your groceries efficiently.</p>
              <p>Happy shopping!</p>
            </div>
          </body>
          </html>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send welcome email:', error.message);
    }
  }
}

// Export singleton instance
const emailService = new EmailService();
export default emailService;
