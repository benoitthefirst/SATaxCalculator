import { PrismaClient, UserRole } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { hash } from 'bcryptjs'
import { config } from 'dotenv'

// Load env vars from .env.local (Next.js convention)
config({ path: '.env.local' })

const prisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_DATABASE_URL,
}).$extends(withAccelerate())

// Type for user with role (Prisma Accelerate extension strips some fields from type inference)
type UserWithRole = {
  id: string
  email: string
  role: UserRole
}

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@processx.co.za'
  const password = process.env.ADMIN_PASSWORD || 'Admin123!'
  const firstName = process.env.ADMIN_FIRST_NAME || 'Admin'
  const lastName = process.env.ADMIN_LAST_NAME || 'User'

  // Check if admin already exists
  const existingAdminResult = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true },
  })

  const existingAdmin = existingAdminResult as UserWithRole | null

  if (existingAdmin) {
    // Update to SUPER_ADMIN if not already
    if (existingAdmin.role !== 'SUPER_ADMIN') {
      await prisma.user.update({
        where: { email },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { role: 'SUPER_ADMIN' } as any, // Type assertion needed due to Prisma Accelerate extension
      })
      console.log(`✅ Updated ${email} to SUPER_ADMIN role`)
    } else {
      console.log(`ℹ️  Admin user ${email} already exists with SUPER_ADMIN role`)
    }
    return
  }

  // Create new admin user
  const hashedPassword = await hash(password, 12)

  const admin = await prisma.user.create({
    data: {
      email,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: 'SUPER_ADMIN',
      is_active: true,
      email_verified: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any, // Type assertion needed due to Prisma Accelerate extension
  })

  console.log(`✅ Created SUPER_ADMIN user:`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   Password: ${password}`)
  console.log(``)
  console.log(`⚠️  Please change this password after first login!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
