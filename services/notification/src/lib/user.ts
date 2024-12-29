import { UnverifiedUser } from '../types/user'
import { transporter } from './nodemailer'

export async function sendUserVerifyEmail(user: UnverifiedUser) {
  console.log(`Sending verification email to ${user.email}`)

  const html = `
    <h1>Welcome to Sumzy!</h1>
    <p>Hi ${user.name},</p>
    <p>Thank you for signing up to Sumzy. Please click the link below to verify your email address:</p>
    <a href="${user.emailVerifyLink}">Verify Email</a>`

  const info = await transporter.sendMail({
    from: 'Sumzy <noreply@jacksonlewis.co.uk>',
    to: `${user.name} <${user.email}>`,
    subject: 'Verify Your Email Address',
    html
  })
  
  console.log('Email sent:', info.messageId)
}
