import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminPhone = '+911111111111';
  await prisma.user.upsert({
    where: { phone: adminPhone },
    update: { role: UserRole.ADMIN, verified: true, name: 'EcoFarm Admin', language: 'en' },
    create: { phone: adminPhone, role: UserRole.ADMIN, verified: true, name: 'EcoFarm Admin', language: 'en' },
  });

  const farmerPhone = '+912222222222';
  const farmer = await prisma.user.upsert({
    where: { phone: farmerPhone },
    update: { role: UserRole.FARMER, verified: true, name: 'Demo Farmer', language: 'en' },
    create: { phone: farmerPhone, role: UserRole.FARMER, verified: true, name: 'Demo Farmer', language: 'en' },
  });

  await prisma.farm.createMany({
    data: [
      { userId: farmer.id, name: 'Demo Farm', areaAcres: 2.5, soilType: 'loamy', address: 'Demo Village' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

