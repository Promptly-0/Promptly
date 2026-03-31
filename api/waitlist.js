/**
 * Serverless function for handling waitlist submissions via Resend API.
 * This file is structured for an Edge/Serverless deployment (like Vercel).
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set in environment variables.');
    // In local dev without key, simulate success
    return res.status(200).json({ 
      success: true, 
      simulated: true, 
      message: 'Email bypassed for local dev.'
    });
  }

  try {
    // Calling Resend API using standard fetch to avoid heavy node dependencies
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        // Note: For custom domains, verify your domain in Resend and replace 'onboarding@resend.dev'
        from: 'Promptly <onboarding@resend.dev>',
        to: email, // Sending confirmation to the user who signed up!
        subject: 'You are on the Promptly Waitlist!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #3a3335;">
            <h1>Welcome to Promptly!</h1>
            <p style="font-size: 16px;">
              Thank you for joining the waitlist for the Financial Operating System for AI. 
              We're thrilled to have you on board.
            </p>
            <p style="font-size: 16px;">
              We'll be in touch soon with early access updates!
            </p>
            <p style="font-size: 16px; margin-top: 30px;">
              - The Promptly Team
            </p>
          </div>
        `
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(400).json({ error: data.message || 'Error from Resend API' });
    }
  } catch (err) {
    console.error('Waitlist API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
