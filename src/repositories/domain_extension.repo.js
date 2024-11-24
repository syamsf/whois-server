const { PrismaClient, Prisma } = require('@prisma/client')
const prismaClient = new PrismaClient({
    errorFormat: 'pretty'
})

exports.fetchByExtension = async (extension) => {
    try {
        return await prismaClient.domain_extensions.findFirst({
            where: {extension: extension}
        })
    } catch (error) {
        await prismaClient.$disconnect()
        throw error
    } finally {
        await prismaClient.$disconnect()
    }
}
