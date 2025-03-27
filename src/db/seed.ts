import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seed() {
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD as string,
    10
  );

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, "admin"));

  if (existingUser.length === 0) {
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
    });

    console.log("✅ User 'admin' berhasil ditambahkan!");
  } else {
    console.log("⚠️ User 'admin' sudah ada di database.");
  }

  process.exit();
}

seed().catch((err) => {
  console.error("❌ Error seeding:", err);
  process.exit(1);
});
