export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        // The Vercel Environment Variable containing your Google Apps Script Webhook
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        
        if (!webhookUrl) {
            return res.status(500).json({ error: 'Google Sheets Webhook URL is missing in Vercel env' });
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Forwarding the email and a timestamp to your Google Sheet
            body: JSON.stringify({ 
                email: email, 
                timestamp: new Date().toISOString() 
            }),
        });

        if (!response.ok) {
            throw new Error('Google Webhook rejected the request');
        }

        return res.status(200).json({ success: true, message: 'Added to Google Sheet' });
    } catch (error) {
        console.error('Google Sheets Error:', error);
        return res.status(500).json({ error: 'Failed to save to Google Sheets.' });
    }
}
