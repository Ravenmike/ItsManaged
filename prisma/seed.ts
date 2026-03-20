import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "earnyourears" },
    update: {},
    create: {
      name: "EarnYourEars Support",
      slug: "earnyourears",
      brandColor: "#2563eb",
      supportEmail: "support@earnyourears.app",
    },
  });

  console.log(`Created workspace: ${workspace.name} (${workspace.id})`);

  // Create admin agent
  const passwordHash = await bcrypt.hash("changeme123", 12);

  const admin = await prisma.agent.upsert({
    where: { email: "admin@itsmanaged.app" },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: "Michael",
      email: "admin@itsmanaged.app",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Created admin agent: ${admin.name} (${admin.email})`);
  console.log("\nSeed complete. Login with:");
  console.log("  Email: admin@itsmanaged.app");
  console.log("  Password: changeme123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
