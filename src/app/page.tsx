// src/app/page.tsx
import Link from "next/link";
import {
  Target,
  Code2,
  Globe,
  MessageSquare,
  Palette,
  Wand2,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectsSection } from "@/components/home/ProjectsSection";

// ── Services data ─────────────────────────────────────────────
const SERVICES = [
  {
    icon: Target,
    title: "Estrategia de producto",
    description:
      "De la idea al roadmap. Definimos el producto, el mercado y el plan de ejecución.",
    tag: "Consultoría",
    highlight: false,
  },
  {
    icon: Code2,
    title: "Desarrollo a medida",
    description:
      "Apps, APIs y sistemas construidos con las tecnologías correctas para tu problema.",
    tag: "Software",
    highlight: false,
  },
  {
    icon: Globe,
    title: "Presencia digital con IA",
    description:
      "Tu web o tienda, construida y desplegada con orquestación de agentes de IA.",
    tag: "Web Agency",
    highlight: true,
  },
  {
    icon: MessageSquare,
    title: "Prompt Engineering",
    description:
      "Cursos, consultoría y sistemas para sacarle el máximo provecho a los modelos de IA.",
    tag: "Cursos",
    highlight: false,
  },
  {
    icon: Palette,
    title: "Identidad visual con IA",
    description:
      "Marca, ilustración y assets visuales generados y refinados con herramientas de IA.",
    tag: "Diseño",
    highlight: false,
  },
];

// ── Hero visual (server-safe, CSS-only animations) ─────────────
function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center w-full h-80 lg:h-full min-h-72">
      <div className="absolute w-72 h-72 rounded-full border border-[hsl(263_93%_76%/0.12)] animate-[spin_24s_linear_infinite]" />
      <div className="absolute w-52 h-52 rounded-full border border-[hsl(263_93%_76%/0.20)] animate-[spin_14s_linear_infinite_reverse]" />
      <div className="absolute w-36 h-36 rounded-full bg-[hsl(263_93%_76%/0.08)] blur-2xl" />
      <div className="relative z-10 w-28 h-28 rounded-full bg-[hsl(263_93%_76%/0.06)] border border-[hsl(263_93%_76%/0.25)] flex items-center justify-center">
        <Wand2 className="w-10 h-10 text-[hsl(263_93%_76%)] opacity-70" />
      </div>
      <div className="absolute top-10 right-14 w-2 h-2 rounded-full bg-[hsl(25_97%_60%)] animate-pulse" />
      <div className="absolute bottom-14 left-12 w-1.5 h-1.5 rounded-full bg-[hsl(199_89%_60%)] animate-pulse [animation-delay:1s]" />
      <div className="absolute top-1/2 right-8 w-1 h-1 rounded-full bg-[hsl(263_93%_76%)] animate-pulse [animation-delay:0.5s]" />
      <span className="absolute bottom-0 text-[10px] text-muted-foreground/30 font-mono tracking-widest">
        mascota · próximamente
      </span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(263 93% 76% / 0.1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(263_93%_76%/0.05)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[hsl(25_97%_60%/0.04)] rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(263_93%_76%/0.3)] bg-[hsl(263_93%_76%/0.06)] px-3.5 py-1.5 text-xs font-medium text-[hsl(263_93%_76%)] tracking-wider uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(263_93%_76%)] animate-pulse" />
              Consultora de software & IA
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-4">
              De la idea<br />al producto.
            </h1>
            <p className="text-2xl lg:text-3xl font-semibold text-[hsl(263_93%_76%)] mb-6">
              Automatizado con IA.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
              Consultoría de software y producto para negocios que quieren escalar.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild className="gap-2 font-semibold">
                <Link href="/servicios">
                  Ver servicios
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-border/60 hover:border-primary/50"
              >
                <Link href="/contacto">Hablemos</Link>
              </Button>
            </div>
          </div>

          <HeroVisual />
        </div>

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── Services ──────────────────────────────────────────── */}
      <section id="servicios" className="py-28">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[hsl(263_93%_76%)] mb-3">
              Qué hacemos
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Servicios
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className={`group relative rounded-xl border p-6 transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 ${
                    service.highlight
                      ? "border-[hsl(263_93%_76%/0.35)] bg-[hsl(263_93%_76%/0.04)]"
                      : "border-border/60 bg-card/50"
                  }`}
                >
                  {service.highlight && (
                    <div className="absolute top-4 right-4 rounded-full bg-[hsl(263_93%_76%/0.12)] px-2 py-0.5 text-[10px] font-semibold text-[hsl(263_93%_76%)] tracking-wider uppercase">
                      Destacado
                    </div>
                  )}
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mb-1 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                    {service.tag}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              variant="ghost"
              asChild
              className="text-muted-foreground hover:text-foreground gap-1.5"
            >
              <Link href="/servicios">
                Ver detalle de servicios
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="container mx-auto px-6">
        <div className="h-px bg-border/40" />
      </div>

      {/* ── Projects (client component) ───────────────────────── */}
      <ProjectsSection />

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <div className="relative rounded-2xl border border-[hsl(263_93%_76%/0.22)] bg-[hsl(263_93%_76%/0.03)] overflow-hidden p-12 lg:p-16 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[hsl(263_93%_76%/0.10)] blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                ¿Listo para escalar?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Cuéntame tu proyecto. Definimos el plan y empezamos.
              </p>
              <Button size="lg" asChild className="gap-2 font-semibold px-8">
                <Link href="/contacto">
                  Trabajemos juntos
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
