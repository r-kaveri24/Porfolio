require('dotenv').config()
let PrismaClient
let PrismaPg
const { randomBytes, scryptSync } = require('crypto')

let prisma

function hashPassword(password) {
  const salt = randomBytes(16)
  const derived = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${derived.toString('hex')}`
}

async function main() {
  const clientMod = await import('../src/generated/prisma/client/index.js')
  const adapterMod = await import('@prisma/adapter-pg')
  PrismaClient = clientMod.PrismaClient
  PrismaPg = adapterMod.PrismaPg
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL || '' })
  prisma = new PrismaClient({ adapter })
  // Admin defaults
  const adminEmail = process.env.ADMIN_EMAIL || 'rautkaveri88@gmail.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Bhimrao@13'

  // Author defaults
  const authorEmail = process.env.AUTHOR_EMAIL || 'author@gmail.com'
  const authorPassword = process.env.AUTHOR_PASSWORD || 'password1234'

  // Ensure admin
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashPassword(adminPassword),
        role: 'ADMIN'
      }
    })
    console.log('Seeded ADMIN user:', adminEmail)
  } else {
    console.log('Admin user already exists:', adminEmail)
  }

  // Ensure author
  const existingAuthor = await prisma.user.findUnique({ where: { email: authorEmail } })
  if (!existingAuthor) {
    await prisma.user.create({
      data: {
        email: authorEmail,
        passwordHash: hashPassword(authorPassword),
        role: 'AUTHOR'
      }
    })
    console.log('Seeded AUTHOR user:', authorEmail)
  } else {
    console.log('Author user already exists:', authorEmail)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
