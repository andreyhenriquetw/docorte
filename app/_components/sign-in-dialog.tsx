"use client"

import { signIn, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const SignInDialog = () => {
  const { data: session } = useSession()

  const router = useRouter()

  const handleLoginWithGoogleClick = async () => {
    await signIn("google", {
      callbackUrl: window.location.href,
    })
  }

  useEffect(() => {
    if (session?.user) {
      router.refresh()
    }
  }, [session, router])

  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça login na plataforma</DialogTitle>

        <DialogDescription>
          Conecte-se usando sua conta do Google.
        </DialogDescription>
      </DialogHeader>

      <Button
        variant="outline"
        className="gap-1 font-bold"
        onClick={handleLoginWithGoogleClick}
      >
        <Image
          alt="Fazer login com o Google"
          src="/google.svg"
          width={18}
          height={18}
        />
        Google
      </Button>
    </>
  )
}

export default SignInDialog
