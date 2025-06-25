import type { Metadata } from "next"
import Footer from "@/components/Footer"
import TabsSection from "@/components/TabsSection"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Home",
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1 p-4 md:p-6 bg-muted/30">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <section className="w-full py-6 md:py-12 flex items-center justify-center min-h-[60vh]">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                      Bem-vindo a Landing Page do Base monorepo
                    </h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      by Jvras58
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link href="/sign-in" className="w-full min-[400px]:w-auto">
                      <Button className="bg-primary hover:bg-primary/90" asChild>
                        <span>Login</span>
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="w-full min-[400px]:w-auto">
                      <Button variant="outline" className="border-primary text-primary" asChild>
                        <span>Cadastre-se</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
