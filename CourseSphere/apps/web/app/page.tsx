import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Home",
  description: "CourseSphere - Plataforma de gerenciamento de cursos",
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
              CourseSphere
            </h1>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl text-primary-foreground/80">
              Plataforma de gerenciamento de cursos: organize, crie e gerencie seus cursos com facilidade.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/sign-in" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">Entrar</Button>
              </Link>
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cadastre-se
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Gestão de Cursos</CardTitle>
                </CardHeader>
                <CardContent>
                  Crie e organize módulos, aulas e conteúdos de forma intuitiva.
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Matrículas e Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  Gerencie inscrições, perfis de alunos e instrutores em um só lugar.
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Análises Avançadas</CardTitle>
                </CardHeader>
                <CardContent>
                  Monitore progresso, relatórios e métricas para melhorar resultados.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Pronto para impulsionar seus cursos?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Experimente o CourseSphere hoje mesmo e veja a diferença.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="mt-6">
                Iniciar Agora
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
