// // app/api/auth/[...nextauth]/route.ts
// import NextAuth from "next-auth/next";
// import GithubProvider from "next-auth/providers/github";
// import { NextAuthOptions } from "next-auth"; // Import NextAuthOptions
// import { JWT } from "next-auth/jwt";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       role?: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
//   interface User {
//     id: string;
//     role?: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role?: string;
//   }
// }

// export const authOptions: NextAuthOptions = { // Correct type annotation
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID || "",
//       clientSecret: process.env.GITHUB_SECRET || "",
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async session({ session, token }: { session: any; token: JWT }) {
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as string | undefined;
//       }
//       return session;
//     },
//     async jwt({ token, account, user }: { token: JWT; account: any; user?: any }) {
//       if (account && user) {
//         token.id = user.id;
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };