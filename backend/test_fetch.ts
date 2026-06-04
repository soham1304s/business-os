import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({ where: { email: 'adminportal@gmail.com' } });
  if (!admin) return console.log("No admin found");
  
  const actualToken = jwt.sign({ id: admin.id, companyId: admin.companyId }, 'your_jwt_access_secret_here');
  
  console.log("Fetching /api/admin/activity/all...");
  const res = await fetch('http://localhost:5000/api/admin/activity/all', {
    headers: { Authorization: `Bearer ${actualToken}` }
  });
  
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Data length:", data.length);
  if (data.length === 0) console.log("Data:", data);
}

main().finally(() => prisma.$disconnect());
