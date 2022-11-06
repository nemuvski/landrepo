import { PrismaClient } from '../client'

const prisma = new PrismaClient()

async function main() {
  console.info('- 処理なし -')
  prisma.user
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
