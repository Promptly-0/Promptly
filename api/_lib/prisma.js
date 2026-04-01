const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

function createPrismaClient() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('Missing DATABASE_URL environment variable.');
    }

    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({ adapter });
}

function getPrismaClient() {
    if (!global.__promptlyPrismaClient) {
        global.__promptlyPrismaClient = createPrismaClient();
    }

    return global.__promptlyPrismaClient;
}

module.exports = { getPrismaClient };