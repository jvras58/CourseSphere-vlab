import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SignUpForm } from "@/modules/auth/components/sign-up-form"
import type { Metadata } from "next"
import Link from "next/link"
import { Home } from "lucide-react"
import { LogoComponent } from "@/components/logo-component"

export const metadata: Metadata = {
  title: "Crie sua conta",
}

export default function AuthenticationPage() {
  return (
    <>
      <div className="container h-screen relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8 border-2 border-primary text-primary hover:text-primary-foreground hover:bg-primary",
          )}
        >
          Logar
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-foreground lg:flex">
          <div className="absolute inset-0 bg-primary/80" />

          <div className="relative z-20 flex items-center gap-2">
            <LogoComponent />
          </div>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-3 bg-foreground/40 p-6 backdrop-blur-sm rounded-lg border border-primary/20">
              <p className="text-3xl font-bold bg-gradient-to-r from-background to-background/80 bg-clip-text text-transparent">
                BASE
              </p>
              <p className="text-sm text-background/90">
                Sistema de Criação de Usuários.
              </p>
              <footer className="text-lg text-background/90">By jvras58</footer>
            </blockquote>
          </div>
        </div>

        <div className="mx-auto flex flex-col justify-center space-y-6 w-[350px]">
          <div className="flex items-center justify-center gap-2 lg:hidden mb-4">
            <div className="bg-primary text-primary-foreground p-1 rounded">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold tracking-tight">
              <span className="text-primary">BASE</span>
              <span className="text-foreground">jvras58</span>
            </span>
          </div>

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Crie sua conta</h1>
            <p className="text-sm text-muted-foreground">Insira seus dados abaixo para criar uma conta.</p>
          </div>
          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao clicar em criar, você concorda com nossos{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Termos de serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Política de privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  )
}
