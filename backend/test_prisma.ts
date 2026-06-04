import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const activities = await prisma.activityLog.findMany({
      where: {},
      include: {
        user: { select: { firstName: true, lastName: true, email: true, company: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log("Length:", activities.length);
  } catch (e) {
    console.error("ERROR", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
