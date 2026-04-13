// src/components/home/ProjectsSection.tsx
// Server component — CSS-only hover, no client state needed

import Link from "next/link";
import { Wand2, Scale, Library, ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    icon: Wand2,
    tag: "Próximamente",
    title: "Web Agency automatizada",
    description:
      "Un agente puppet master entrevista a tu cliente, organiza los requisitos y despliega un sitio funcional — sin intervención manual.",
    href: "/portafolio",
    // Tailwind arbitrary hover shadow — hardcoded per card (only 3 cards)
    cardClass:
      "border-[hsl(263_93%_76%/0.2)] hover:shadow-[0_8px_40px_0_hsl(263_93%_76%/0.18)]",
    iconBg: "bg-[hsl(263_93%_76%/0.1)]",
    iconColor: "text-[hsl(263_93%_76%)]",
    tagClass:
      "border-[hsl(263_93%_76%/0.3)] text-[hsl(263_93%_76%)] bg-[hsl(263_93%_76%/0.08)]",
    ctaColor: "text-[hsl(263_93%_76%)]",
  },
  {
    icon: Scale,
    tag: "En desarrollo",
    title: "Bias Encyclopedia",
    description:
      "Benchmark vivo de modelos de IA. Preguntas desde básicas hasta complejas, respuestas archivadas y comparación histórica de bias por categoría.",
    href: "/bias",
    cardClass:
      "border-[hsl(25_97%_60%/0.2)] hover:shadow-[0_8px_40px_0_hsl(25_97%_60%/0.18)]",
    iconBg: "bg-[hsl(25_97%_60%/0.1)]",
    iconColor: "text-[hsl(25_97%_60%)]",
    tagClass:
      "border-[hsl(25_97%_60%/0.3)] text-[hsl(25_97%_60%)] bg-[hsl(25_97%_60%/0.08)]",
    ctaColor: "text-[hsl(25_97%_60%)]",
  },
  {
    icon: Library,
    tag: "Live",
    title: "Prompt Library",
    description:
      "Biblioteca curada de prompts de ingeniería. Crea, organiza y comparte prompts de alta calidad para cualquier modelo.",
    href: "/lab",
    cardClass:
      "border-[hsl(199_89%_60%/0.2)] hover:shadow-[0_8px_40px_0_hsl(199_89%_60%/0.18)]",
    iconBg: "bg-[hsl(199_89%_60%/0.1)]",
    iconColor: "text-[hsl(199_89%_60%)]",
    tagClass:
      "border-[hsl(199_89%_60%/0.3)] text-[hsl(199_89%_60%)] bg-[hsl(199_89%_60%/0.08)]",
    ctaColor: "text-[hsl(199_89%_60%)]",
  },
] as const;

export function ProjectsSection() {
  return (
    <section id="proyectos" className="py-28">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[hsl(25_97%_60%)] mb-3">
            Proyectos
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Lo que estamos construyendo
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => {
            const Icon = project.icon;
            return (
              <Link
                key={project.title}
                href={project.href}
                className={`group relative flex flex-col rounded-2xl border bg-card/40 p-7 transition-all duration-300 hover:-translate-y-1 ${project.cardClass}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`inline-flex rounded-xl p-3 ${project.iconBg}`}>
                    <Icon className={`h-6 w-6 ${project.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${project.tagClass}`}>
                    {project.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className={`mt-6 flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all ${project.ctaColor}`}>
                  Ver más
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
