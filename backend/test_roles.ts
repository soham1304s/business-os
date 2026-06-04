import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.findMany();
  console.log("Roles:", roles.map(r => r.name));
  
  const users = await prisma.user.findMany({ include: { role: true }});
  console.log("Users:", users.map(u => ({ email: u.email, role: u.role.name })));
}
main().finally(() => prisma.$disconnect());
