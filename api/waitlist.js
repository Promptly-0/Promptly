export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        
        if (!webhookUrl) {
            return res.status(500).json({ error: 'Google Sheets Webhook URL is missing in Vercel env' });
        }

        // We explicitly omit "Content-Type: application/json" because Google's macro servers 
        // aggressively block JSON headers to avoid preflight issues. We also add "redirect: 'follow'"
        // because Google Apps Script always responds to an initial POST with a 302 Redirect.
        const response = await fetch(webhookUrl, {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify({ 
                email: email, 
                timestamp: new Date().toISOString() 
            }),
        });

        // Detailed error logging to figure out exactly what Google is complaining about
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status ${response.status} - ${errorText.substring(0, 100)}`);
        }

        return res.status(200).json({ success: true, message: 'Added to Google Sheet' });
    } catch (error) {
        console.error('Google Sheets Error:', error.message);
        // Returning a generic 500 so the frontend doesn't crash on long texts
        return res.status(500).json({ error: `Webhook Failed: Details in Vercel Logs.` });
    }
}
