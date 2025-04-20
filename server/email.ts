import nodemailer from 'nodemailer';

// Configure mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'noreply@grailcapitals.com',
    pass: process.env.EMAIL_PASSWORD || 'placeholder_password'
  }
});

/**
 * Send a verification email to a new user
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationLink - Verification link
 * @returns {Promise<any>} - Nodemailer response
 */
export async function sendVerificationEmail(to: string, name: string, verificationLink: string) {
  const mailOptions = {
    from: `"Grail Capitals" <${process.env.EMAIL_USER || 'noreply@grailcapitals.com'}>`,
    to,
    subject: 'Verify Your Grail Capitals Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #F7D060; margin: 0;">Grail Capitals</h1>
          <p style="color: #888888; font-size: 16px;">Crypto Investment Platform</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for signing up with Grail Capitals. To activate your account and start investing, please click the verification button below:</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${verificationLink}" style="background-color: #F7D060; color: #000000; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Your Account</a>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>If the button doesn't work, copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #0066cc;">${verificationLink}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888888; font-size: 12px;">
          <p>If you did not sign up for an account, please ignore this email or contact our support team.</p>
          <p>&copy; ${new Date().getFullYear()} Grail Capitals. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    // In a real implementation, send the email
    // For demo purposes, log it instead
    console.log(`[EMAIL] Verification email would be sent to ${to}`);
    console.log(`[EMAIL] Verification link: ${verificationLink}`);
    
    // Uncomment to actually send the email if credentials are set
    // return await transporter.sendMail(mailOptions);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Send a deposit confirmation email to a user
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {number} amount - Deposit amount
 * @param {string} planName - Investment plan name
 * @returns {Promise<any>} - Nodemailer response
 */
export async function sendDepositConfirmationEmail(to: string, name: string, amount: number, planName: string) {
  const mailOptions = {
    from: `"Grail Capitals" <${process.env.EMAIL_USER || 'noreply@grailcapitals.com'}>`,
    to,
    subject: 'Deposit Confirmation - Grail Capitals',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #F7D060; margin: 0;">Grail Capitals</h1>
          <p style="color: #888888; font-size: 16px;">Crypto Investment Platform</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2>Deposit Confirmed</h2>
          <p>Hello ${name},</p>
          <p>Your deposit has been successfully confirmed and your investment has been activated.</p>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
          <h3 style="margin-top: 0;">Transaction Details:</h3>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Investment Plan:</strong> ${planName}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>You can log in to your dashboard to track your investment's performance and ROI.</p>
          <p>Thank you for choosing Grail Capitals for your investment needs.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Grail Capitals. All rights reserved.</p>
          <p>Risk Disclaimer: Cryptocurrency investments are volatile. Only invest what you can afford to lose.</p>
        </div>
      </div>
    `
  };

  try {
    console.log(`[EMAIL] Deposit confirmation email would be sent to ${to}`);
    // return await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending deposit confirmation email:', error);
    throw new Error('Failed to send deposit confirmation email');
  }
}

/**
 * Send a withdrawal confirmation email to a user
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {number} amount - Withdrawal amount
 * @param {string} crypto - Cryptocurrency
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<any>} - Nodemailer response
 */
export async function sendWithdrawalConfirmationEmail(
  to: string,
  name: string,
  amount: number,
  crypto: string,
  walletAddress: string
) {
  const mailOptions = {
    from: `"Grail Capitals" <${process.env.EMAIL_USER || 'noreply@grailcapitals.com'}>`,
    to,
    subject: 'Withdrawal Confirmation - Grail Capitals',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #F7D060; margin: 0;">Grail Capitals</h1>
          <p style="color: #888888; font-size: 16px;">Crypto Investment Platform</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2>Withdrawal Confirmed</h2>
          <p>Hello ${name},</p>
          <p>Your withdrawal request has been processed and the funds have been sent to your wallet.</p>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
          <h3 style="margin-top: 0;">Transaction Details:</h3>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Cryptocurrency:</strong> ${crypto.toUpperCase()}</p>
          <p><strong>Wallet Address:</strong> ${walletAddress}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p>If you did not request this withdrawal or notice any suspicious activity, please contact our support team immediately.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Grail Capitals. All rights reserved.</p>
          <p>Risk Disclaimer: Cryptocurrency investments are volatile. Only invest what you can afford to lose.</p>
        </div>
      </div>
    `
  };

  try {
    console.log(`[EMAIL] Withdrawal confirmation email would be sent to ${to}`);
    // return await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending withdrawal confirmation email:', error);
    throw new Error('Failed to send withdrawal confirmation email');
  }
}
