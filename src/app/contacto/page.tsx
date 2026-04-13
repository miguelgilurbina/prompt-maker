"use client";

// src/app/contacto/page.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, MessageSquare, ArrowUpRight } from "lucide-react";

const SERVICES_OPTIONS = [
  "Estrategia de producto",
  "Desarrollo a medida",
  "Web Agency con IA",
  "Prompt Engineering / Cursos",
  "Identidad visual con IA",
  "Otro",
];

export default function ContactoPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: conectar a endpoint real (email transaccional - Fase 0 pendiente)
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

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
            Trabajemos juntos
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-xl leading-tight">
            Hablemos de tu proyecto
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Cuéntame qué estás construyendo. Te respondo en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-28">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="rounded-2xl border border-[hsl(var(--brand-success)/0.3)] bg-[hsl(var(--brand-success)/0.05)] p-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-[hsl(var(--brand-success))] mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Mensaje recibido
                </h2>
                <p className="text-muted-foreground">
                  Te respondo a <strong>{formState.email}</strong> en menos de 24 horas.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-border/60 bg-card/30 p-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, name: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border/60 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, email: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border/60 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Servicio de interés
                  </label>
                  <select
                    value={formState.service}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, service: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border/60 bg-background/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                  >
                    <option value="" disabled>Selecciona un servicio</option>
                    {SERVICES_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Cuéntame tu proyecto
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="¿Qué quieres construir? ¿Dónde estás ahora? ¿Cuál es el objetivo?"
                    value={formState.message}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, message: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border/60 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full gap-2 font-semibold"
                >
                  {loading ? "Enviando..." : "Enviar mensaje"}
                  {!loading && <ArrowUpRight className="h-4 w-4" />}
                </Button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border/60 bg-card/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex rounded-lg bg-primary/10 p-2">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">Email directo</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Prefiero el formulario, pero si quieres también puedes escribirme directo.
              </p>
              <a
                href="mailto:hola@prompt-maker.com"
                className="text-sm text-primary hover:underline"
              >
                hola@prompt-maker.com
              </a>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex rounded-lg bg-[hsl(var(--brand-orange)/0.1)] p-2">
                  <MessageSquare className="h-4 w-4 text-[hsl(var(--brand-orange))]" />
                </div>
                <span className="text-sm font-semibold text-foreground">Tiempo de respuesta</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Respondo todos los mensajes en{" "}
                <span className="text-foreground font-medium">menos de 24 horas</span>{" "}
                hábiles.
              </p>
            </div>

            <div className="rounded-xl border border-[hsl(var(--brand-violet)/0.25)] bg-[hsl(var(--brand-violet)/0.04)] p-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-[hsl(var(--brand-violet))] mb-2">
                Primera consulta
              </p>
              <p className="text-sm text-muted-foreground">
                La primera llamada de diagnóstico es{" "}
                <span className="text-foreground font-medium">sin costo</span>.
                Vemos si hay fit antes de cualquier compromiso.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
