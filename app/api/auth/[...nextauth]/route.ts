// app/api/auth/[...nextauth]/route.ts
import NextAuth, { DefaultSession, DefaultUser, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
  }
}

const authOptions = { // Keep authOptions as a const
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) { // Corrected types
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, account, user }: { token: JWT; account: any; user?: User }) { // Corrected types
      if (account && user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions); // Pass authOptions to NextAuth

export { handler as GET, handler as POST }; // Correct exports