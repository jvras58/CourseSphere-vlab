import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SignInForm } from "@/modules/auth/components/sign-in-form"
import { LogoComponent } from "@/components/logo-component"

export const metadata: Metadata = {
  title: "Logar na sua conta",
}

export default function AuthenticationPage() {
  return (
    <div className="container h-screen grid relative flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background text-foreground">
      <Link
        href="/sign-up"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8 border-2 border-primary text-primary hover:text-primary-foreground hover:bg-primary",
        )}
      >
        Crie sua conta
      </Link>

      <div className="relative hidden h-full flex-col p-10 text-foreground lg:flex overflow-hidden">
        <div className="absolute inset-0 bg-primary/80" />

        <div className="relative z-20">
          <LogoComponent />
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-3 bg-foreground/40 p-6 backdrop-blur-sm rounded-lg border border-primary/20">
            <p className="text-3xl font-bold bg-gradient-to-r from-background to-background/80 bg-clip-text text-transparent">
              BASE
            </p>
            <p className="text-sm text-background/90">
             Sistema de Autenticação de usuários.
            </p>
            <footer className="text-lg text-background/90">By jvras58</footer>
          </blockquote>
        </div>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex items-center justify-center gap-2 lg:hidden mb-4">
            <LogoComponent />
          </div>

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Logar na sua conta</h1>
            <p className="text-sm text-muted-foreground">Insira seus dados abaixo para entrar na sua conta.</p>
          </div>

          <SignInForm />

          <Link href="#" className="text-sm text-center font-bold text-primary hover:underline underline-offset-4">
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </div>
  )
}
