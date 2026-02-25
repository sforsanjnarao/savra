import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
console.log('connectionString', connectionString)

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })
export default prisma