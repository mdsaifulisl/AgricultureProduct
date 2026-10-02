import { EventEmitter } from 'events';
import { sendEmail } from '../utils/sendEmail.js'; 

export const userEvents = new EventEmitter();

userEvents.on('userCreated', async ({ email, name, rawPassword }) => {
  // .env থেকে ফ্রন্টএন্ড বেস URL নিন, না থাকলে ফলব্যাক হিসেবে লোকালহোস্ট ব্যবহার হবে
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const loginUrl = `${clientUrl}/login`;

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>স্বাগতম, ${name}!</h2>
      <p>আপনার অ্যাডমিন পোর্টাল অ্যাকাউন্ট তৈরি করা হয়েছে। লগইন করার জন্য নিচের তথ্য ব্যবহার করুন:</p>
      
      <ul style="background: #f4f4f4; padding: 15px 25px; border-radius: 5px; list-style: none;">
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> <code>${rawPassword}</code></li>
      </ul>

      <p style="margin-top: 20px;">
        <a href="${loginUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          লগইন পোর্টালে যান
        </a>
      </p>

      <p style="font-size: 13px; color: #777;">
        বা নিচের লিঙ্কে ক্লিক করুন:<br>
        <a href="${loginUrl}">${loginUrl}</a>
      </p>

      <p style="color: #d9534f; font-size: 13px;">নিরাপত্তার স্বার্থে প্রথমবার লগইন করেই পাসওয়ার্ড পরিবর্তন করে নিন।</p>
    </div>
  `;

  try {
    await sendEmail(email, 'আপনার অ্যাকাউন্টের এক্সেস ক্রেডেনশিয়াল', emailTemplate);
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
});



// নতুন: OTP পাঠানোর ইভেন্ট লিসেনার
userEvents.on('otpRequested', async ({ email, otp }) => {
  const emailTemplate = `
    <h3>পাসওয়ার্ড রিসেট OTP</h3>
    <p>আপনার পাসওয়ার্ড রিসেট করার জন্য OTP কোড হলো: <strong>${otp}</strong></p>
    <p>কোডটি আগামী ১০ মিনিটের জন্য কার্যকর থাকবে।</p>
  `;

  try {
    await sendEmail(email, 'পাসওয়ার্ড রিসেট OTP Verification', emailTemplate);
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error);
  }
});