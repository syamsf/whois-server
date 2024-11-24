const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient({
  errorFormat: 'pretty'
})

async function upsertWhoisRecords() {
    const filePath = path.join(__dirname, 'dist.whois.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    let counter = 1;

    for (const record of data) {
        const extensions = record.extensions.split(",");

        for (const extension of extensions) {
            await prismaClient.domain_extensions.upsert({
                where: { id: counter },
                update: {
                    extension,
                    whois_uri: record.uri,
                    available: record.available
                },
                create: {
                    id: counter,
                    extension,
                    whois_uri: record.uri,
                    available: record.available,
                }
            });

            counter += 1;
        }
    }
}

upsertWhoisRecords().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prismaClient.$disconnect();
});
