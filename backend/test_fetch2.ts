import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { email: 'adminportal@gmail.com' } });
  if (!admin) return console.log("No admin found");
  const actualToken = jwt.sign({ id: admin.id, companyId: admin.companyId }, 'your_jwt_access_secret_here');
  
  const res = await fetch('http://localhost:5000/api/admin/activity/all', {
    headers: { Authorization: `Bearer ${actualToken}` }
  });
  const data = await res.json();
  console.log(JSON.stringify(data[0], null, 2));
}

main().finally(() => prisma.$disconnect());
