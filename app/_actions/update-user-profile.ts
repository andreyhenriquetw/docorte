"use server"

import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"

interface UpdateUserProfileParams {
  name: string
  phone: string
}

export const updateUserProfile = async ({
  name,
  phone,
}: UpdateUserProfileParams) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  await db.user.update({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (session.user as any).id,
    },
    data: {
      name,
      phone,
    },
  })

  return true
}
