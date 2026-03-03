"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleCheckout() {
    if (!session) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Planos simples, sem surpresas
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Comece grátis e faça upgrade quando precisar.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
          {/* FREE Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-xl">Gratuito</CardTitle>
              <CardDescription>Para começar sem compromisso</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-gray-500">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Feature text="Até 3 listas de tarefas" />
              <Feature text="Tarefas ilimitadas por lista" />
              <Feature text="Marcar como concluída" />
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push("/login")}
              >
                Começar grátis
              </Button>
            </CardContent>
          </Card>

          {/* PRO Plan */}
          <Card className="relative border-blue-600 border-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                Mais popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription>Para produtividade máxima</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 19,90</span>
                <span className="text-gray-500">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Feature text="Listas ilimitadas" highlight />
              <Feature text="Tarefas ilimitadas" highlight />
              <Feature text="14 dias grátis para testar" highlight />
              <Feature text="Suporte prioritário" highlight />
              <Button
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={handleCheckout}
              >
                Começar trial gratuito
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Check className={`h-4 w-4 ${highlight ? "text-blue-600" : "text-gray-400"}`} />
      <span className={`text-sm ${highlight ? "text-gray-900" : "text-gray-600"}`}>
        {text}
      </span>
    </div>
  );
}
