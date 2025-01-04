import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

dotenv.config({ path: path.join(rootDir, '.env') });


class EmailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendEmail(receiver, subject, html) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: receiver,
                subject: subject,
                html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            
            if (process.env.NODE_ENV !== 'production') {
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }

            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create a singleton instance
const emailSender = new EmailSender();
export default emailSender;

// Usage example:
// import emailSender from './utils/sendEmail.js';
// 
// try {
//     const result = await emailSender.sendEmail(
//         'recipient@example.com',
//         'Thank you for your donation',
//         'We appreciate your generous contribution!'
//     );
//     if (result.success) {
//         console.log('Email sent successfully');
//     } else {
//         console.error('Failed to send email:', result.error);
//     }
// } catch (error) {
//     console.error('Error:', error);
// }
