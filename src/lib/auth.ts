import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "your_username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.username, credentials.username))
          .then((res) => res[0]); // Ambil user pertama

        if (!user) {
          throw new Error("User not found");
        }

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!validPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: String(user.id), // Pastikan `id` ada
          name: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        (session.user as any).id = token.id; // Tambahkan ID ke session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
