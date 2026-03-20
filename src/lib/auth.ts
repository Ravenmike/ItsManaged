import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const agent = await db.agent.findUnique({
          where: { email: credentials.email as string },
        });

        if (!agent) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          agent.passwordHash,
        );

        if (!valid) return null;

        return {
          id: agent.id,
          email: agent.email,
          name: agent.name,
          role: agent.role,
          workspaceId: agent.workspaceId,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.workspaceId = user.workspaceId;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.role = token.role;
      session.user.workspaceId = token.workspaceId;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
