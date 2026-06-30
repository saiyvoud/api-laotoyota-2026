// prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

console.log('Prisma models available:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')))

export default prisma
