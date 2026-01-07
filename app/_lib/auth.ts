import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import { db } from "./prisma"
import { Adapter } from "next-auth/adapters"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [],
  callbacks: {
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
}
