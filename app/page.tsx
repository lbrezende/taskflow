import Link from "next/link";
import {
  CheckCircle2,
  ListTodo,
  Shield,
  Zap,
  CreditCard,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <CheckCircle2 className="h-7 w-7 text-blue-600" />
          <span className="text-xl font-bold">TaskFlow</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Recursos
          </a>
          <a
            href="#pricing"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Preços
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">
              Começar grátis
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.08),transparent)]" />
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm">
          <Zap className="h-4 w-4 text-blue-600" />
          14 dias grátis — sem cartão de crédito
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Organize suas tarefas{" "}
          <span className="text-blue-600">sem complicação</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Crie listas, adicione tarefas, e mantenha o foco no que importa.
          Simples assim. Sem distrações, sem curva de aprendizado.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <Button size="lg" className="px-8 text-base">
              Começar grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <a href="#pricing">
            <Button variant="outline" size="lg" className="px-8 text-base">
              Ver preços
            </Button>
          </a>
        </div>

        {/* App Preview */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="rounded-xl border bg-white p-2 shadow-2xl shadow-blue-600/10">
            <div className="rounded-lg border bg-gray-50 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">
                  taskflow.app/dashboard
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-white p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Projeto Alpha
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-gray-500 line-through">
                        Criar wireframes
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-gray-500 line-through">
                        Definir paleta de cores
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      <span className="text-gray-700">Revisar com o time</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Tarefas Pessoais
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      <span className="text-gray-700">Agendar dentista</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      <span className="text-gray-700">Comprar presente</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-gray-500 line-through">
                        Pagar contas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: ListTodo,
      title: "Listas inteligentes",
      description:
        "Organize suas tarefas em listas separadas. Trabalho, pessoal, projetos — tudo no seu lugar.",
    },
    {
      icon: Zap,
      title: "Rápido e simples",
      description:
        "Interface limpa e intuitiva. Adicione, complete e organize tarefas em segundos.",
    },
    {
      icon: Shield,
      title: "Seguro e privado",
      description:
        "Login com Google ou link mágico. Seus dados são protegidos e criptografados.",
    },
    {
      icon: CreditCard,
      title: "Plano flexível",
      description:
        "Comece grátis com até 3 listas. Faça upgrade quando precisar de mais.",
    },
  ];

  return (
    <section id="features" className="border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tudo que você precisa para se organizar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Sem complicação. Sem funcionalidades que você nunca vai usar.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t bg-gray-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Preços simples e transparentes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            Comece grátis. Faça upgrade quando precisar.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-3xl gap-8 sm:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-2xl border bg-white p-8">
            <h3 className="text-lg font-semibold text-gray-900">Grátis</h3>
            <p className="mt-1 text-sm text-gray-500">Para começar</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">R$ 0</span>
              <span className="text-sm text-gray-500">/mês</span>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "Até 3 listas de tarefas",
                "Itens ilimitados por lista",
                "Login com Google ou e-mail",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-8 block">
              <Button variant="outline" className="w-full">
                Começar grátis
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-medium text-white">
              Popular
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
            <p className="mt-1 text-sm text-gray-500">
              Para quem quer mais
            </p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">R$ 19,90</span>
              <span className="text-sm text-gray-500">/mês</span>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "Listas ilimitadas",
                "Itens ilimitados por lista",
                "Login com Google ou e-mail",
                "14 dias grátis para testar",
                "Suporte prioritário",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/login" className="mt-8 block">
              <Button className="w-full">
                Testar 14 dias grátis
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">TaskFlow</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TaskFlow. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
