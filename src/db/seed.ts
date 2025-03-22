import { db } from "@/db"; // Sesuaikan dengan path `db.ts` di proyekmu
import { users } from "@/db/schema"; // Sesuaikan dengan schema user-mu
import { eq } from "drizzle-orm"; // Import eq dari drizzle-orm
import bcrypt from "bcrypt";

async function seed() {
  const hashedPassword = await bcrypt.hash("12345678", 10); // Hash password

  // Cek apakah user dengan username "admin" sudah ada
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, "admin"));

  if (existingUser.length === 0) {
    // Tambahkan user jika belum ada
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
  console.error("❌ Error saat seeding:", err);
  process.exit(1);
});
