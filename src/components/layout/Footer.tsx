import Link from "next/link";

const NAV_GROUPS = [
  {
    label: "Servicios",
    links: [
      { href: "/servicios#estrategia", label: "Estrategia de producto" },
      { href: "/servicios#desarrollo", label: "Desarrollo a medida" },
      { href: "/servicios#web-agency", label: "Web Agency con IA" },
      { href: "/servicios#prompts", label: "Prompt Engineering" },
      { href: "/servicios#visual", label: "Identidad visual" },
    ],
  },
  {
    label: "Proyectos",
    links: [
      { href: "/portafolio", label: "Portafolio" },
      { href: "/bias", label: "Bias Encyclopedia" },
      { href: "/lab", label: "Prompt Library" },
    ],
  },
  {
    label: "Contacto",
    links: [
      { href: "/contacto", label: "Trabajemos juntos" },
      { href: "https://www.instagram.com/promptmaker22/", label: "Instagram", external: true },
      { href: "https://github.com/miguelgilurbina/prompt-maker", label: "GitHub", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                Prompt Maker
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Consultoría de software, producto e IA para negocios que quieren escalar.
            </p>
          </div>

          {/* Nav groups */}
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                {group.label}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Prompt Maker. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground/60 font-mono">
            Construido con IA — desplegado con propósito.
          </p>
        </div>
      </div>
    </footer>
  );
}
