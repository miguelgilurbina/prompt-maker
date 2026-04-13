"use client";

import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  icon: LucideIcon;
  tag: string;
  title: string;
  description: string;
  href: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  available: boolean;
}

export function ProjectCard({
  icon: Icon,
  tag,
  title,
  description,
  href,
  accentColor,
  borderColor,
  glowColor,
  available,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className={`group relative flex flex-col rounded-2xl border ${borderColor} bg-card/40 p-7 transition-all duration-300 hover:-translate-y-1`}
      style={{
        boxShadow: hovered ? `0 8px 40px 0 ${glowColor}` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className="inline-flex rounded-xl p-3"
          style={{ backgroundColor: `${accentColor}18` }}
        >
          <Icon className="h-6 w-6" style={{ color: accentColor }} />
        </div>
        <span
          className={`text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${borderColor}`}
          style={{ color: accentColor, backgroundColor: `${accentColor}10` }}
        >
          {tag}
        </span>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {description}
      </p>

      <div
        className="mt-6 flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all"
        style={{ color: accentColor }}
      >
        {available ? "Explorar" : "Ver más"}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
