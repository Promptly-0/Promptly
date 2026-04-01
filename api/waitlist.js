import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        await prisma.waitlist.create({
            data: { email }
        });

        return res.status(200).json({ success: true, message: 'Added to Waitlist' });
    } catch (error) {
        console.error('Waitlist Error:', error.message);
        
        // Handle unique constraint violation (duplicate email)
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email is already on the waitlist.' });
        }
        
        return res.status(500).json({ error: 'Failed to save waitlist.' });
    }
}
