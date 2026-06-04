import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ include: { role: true }});
  console.log(users.map(u => ({ name: u.firstName + " " + u.lastName, email: u.email, role: u.role.name })));
}
main().finally(() => prisma.$disconnect());
