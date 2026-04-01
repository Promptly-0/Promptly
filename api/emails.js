const { getPrismaClient } = require('./_lib/prisma');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Basic password protection via Authorization header
    const authHeader = req.headers.authorization;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'promptly123'; // Fallback if no env var set

    if (!authHeader || authHeader.trim() !== `Bearer ${expectedPassword}`) {
        return res.status(401).json({ error: 'Unauthorized. Incorrect password.' });
    }

    try {
        const prisma = getPrismaClient();

        const emails = await prisma.waitlist.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.status(200).json({ emails });
    } catch (error) {
        console.error('Fetch Emails Error:', error.message);
        return res.status(500).json({ error: 'Failed to fetch waitlist emails.' });
    }
};
