// src/app/servicios/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Code2,
  Globe,
  MessageSquare,
  Palette,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Consultoría de producto, desarrollo de software, web agency automatizada, prompt engineering e identidad visual con IA.",
};

const SERVICES = [
  {
    id: "estrategia",
    icon: Target,
    tag: "Consultoría",
    title: "Estrategia de producto",
    description:
      "Transformamos una idea en un plan ejecutable. Definimos el producto, el mercado objetivo, la propuesta de valor y el roadmap de desarrollo.",
    deliverables: [
      "Análisis de mercado y competencia",
      "Definición de producto (MVP y versiones)",
      "Roadmap priorizado",
      "KPIs y métricas de éxito",
      "Propuesta de arquitectura técnica",
    ],
    accentColor: "hsl(var(--brand-violet))",
  },
  {
    id: "desarrollo",
    icon: Code2,
    tag: "Software",
    title: "Desarrollo a medida",
    description:
      "Construimos aplicaciones web, APIs y sistemas con las tecnologías adecuadas para cada problema. Sin over-engineering, sin shortcuts.",
    deliverables: [
      "Aplicaciones web full-stack",
      "APIs REST y GraphQL",
      "Integraciones con servicios de terceros",
      "Dashboards y backoffice",
      "Testing y documentación incluidos",
    ],
    accentColor: "hsl(var(--brand-sky))",
  },
  {
    id: "web-agency",
    icon: Globe,
    tag: "Web Agency · IA",
    title: "Presencia digital automatizada",
    description:
      "Un sistema de agentes de IA entrevista al cliente, organiza los requisitos y despliega el sitio. Mínima fricción, máxima velocidad.",
    deliverables: [
      "Sitio web completo en días, no semanas",
      "Landing pages, tiendas y apps de backoffice",
      "Agente puppet master de onboarding",
      "Diseño y desarrollo generado por IA",
      "Deploy automatizado incluido",
    ],
    accentColor: "hsl(var(--brand-orange))",
    highlight: true,
  },
  {
    id: "prompts",
    icon: MessageSquare,
    tag: "Cursos",
    title: "Prompt Engineering",
    description:
      "Cursos, talleres y consultoría para dominar la interacción con modelos de lenguaje. Desde básico hasta sistemas de agentes avanzados.",
    deliverables: [
      "Cursos en video (asíncronos)",
      "Talleres en vivo para equipos",
      "Consultoría de integración de IA",
      "Revisión y optimización de prompts existentes",
      "Documentación y playbooks",
    ],
    accentColor: "hsl(var(--brand-violet))",
  },
  {
    id: "visual",
    icon: Palette,
    tag: "Diseño",
    title: "Identidad visual con IA",
    description:
      "Marca, ilustración y assets visuales generados y refinados con las mejores herramientas de IA del mercado.",
    deliverables: [
      "Identidad de marca completa",
      "Ilustraciones y assets UI",
      "Mascota y personajes de marca",
      "Social media kit",
      "Guía de estilo visual",
    ],
    accentColor: "hsl(var(--brand-sky))",
  },
];

export default function ServiciosPage() {
  return (
    <div className="min-h-screen">

      {/* Header */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(263 93% 76% / 0.1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[hsl(var(--brand-violet))] mb-4">
            Lo que ofrecemos
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-xl leading-tight">
            Servicios
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Desde la estrategia hasta el deploy. Trabajamos con IA en cada etapa
            para entregarte más rápido y con mejor calidad.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="pb-28">
        <div className="container mx-auto px-6 space-y-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                id={service.id}
                className={`group rounded-2xl border p-8 lg:p-10 transition-all duration-300 ${
                  service.highlight
                    ? "border-[hsl(var(--brand-orange)/0.35)] bg-[hsl(var(--brand-orange)/0.04)]"
                    : "border-border/60 bg-card/30 hover:border-border"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  {/* Left */}
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="inline-flex rounded-xl p-3"
                        style={{ backgroundColor: `${service.accentColor}18` }}
                      >
                        <Icon
                          className="h-6 w-6"
                          style={{ color: service.accentColor }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border"
                        style={{
                          color: service.accentColor,
                          borderColor: `${service.accentColor}40`,
                          backgroundColor: `${service.accentColor}10`,
                        }}
                      >
                        {service.tag}
                      </span>
                      {service.highlight && (
                        <span className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[hsl(var(--brand-orange)/0.15)] text-[hsl(var(--brand-orange))]">
                          Destacado
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Right — deliverables */}
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                      Incluye
                    </p>
                    <ul className="space-y-3">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2
                            className="h-4 w-4 mt-0.5 shrink-0"
                            style={{ color: service.accentColor }}
                          />
                          <span className="text-sm text-foreground/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="container mx-auto px-6">
          <div className="rounded-2xl border border-[hsl(var(--brand-violet)/0.25)] bg-[hsl(var(--brand-violet)/0.04)] p-10 lg:p-14 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-muted-foreground mb-8">
              Cuéntame tu proyecto y vemos cómo podemos ayudarte.
            </p>
            <Button size="lg" asChild className="gap-2 font-semibold">
              <Link href="/contacto">
                Hablemos
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
