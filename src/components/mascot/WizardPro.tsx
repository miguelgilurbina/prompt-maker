'use client'

/**
 * WizardPro — Level 3 mascot
 * 128×128 viewBox · smooth rendering · polygons + SVG filter glow
 * Same letter-flame concept as Wizard but with glow effect, triangular hat,
 * flowing robe hem, belt, sleeve cuffs, and gradient-layered beard.
 */

import React, { useEffect, useRef, useState } from 'react'

export type WizardVariant =
  | 'default'
  | 'casting'
  | 'thinking'
  | 'celebrating'
  | 'waving'
  | 'sleeping'

interface WizardProProps {
  variant?: WizardVariant
  size?: number
  className?: string
  style?: React.CSSProperties
  scrollReveal?: boolean
}

// ─── Letter flame system (same as Wizard) ────────────────────────────────────

const CHARS = ['{', '}', '"', "'", '[', ']', '<', '>', '/', '*', '#', '@', '!', '?', '&', ';', '_', '|', '`', '~']

function useChar(ms: number, offset = 0): string {
  const [i, setI] = useState(offset % CHARS.length)
  useEffect(() => {
    const id = setInterval(() => setI(n => (n + 1) % CHARS.length), ms)
    return () => clearInterval(id)
  }, [ms])
  return CHARS[i]
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  n0: '#0F2357', n1: '#1E3A8A', n2: '#2952B3', n3: '#3B6FD4', n4: '#5B8FE0', n5: '#88AAFF',
  sk: '#F5CBA7', skM: '#E8A882', skD: '#D4956A',
  br: '#F4F4F4', brM: '#D0D0D0', brD: '#A8A8A8', brX: '#808080',
  brow: '#4A4A5A',
  eye: '#1A1A2E', shn: '#FFFFFF',
  wd: '#7B4F1A', wdL: '#A8721F', wdD: '#4A300A',
  gd: '#C89010', gdL: '#F0C040', gdX: '#FFF0A0',
  f1: '#FF8C00', f2: '#FFD000', f3: '#FFF8B0',
  wht: '#FFFFFF',
} as const

// ─── SVG Defs (filter for glow + gradients) ───────────────────────────────────

function Defs() {
  return (
    <defs>
      {/* Flame glow — Gaussian blur composite */}
      <filter id="wpro-glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.0" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Subtle inner glow for orb/highlights */}
      <filter id="wpro-softglow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}

// ─── Letter Flame (with glow filter) ─────────────────────────────────────────

interface FL { l1: string; l2: string; l3: string; l4: string }

function LetterFlame({ fl, x = 8 }: { fl: FL; x?: number }) {
  return (
    <g filter="url(#wpro-glow)">
      {/* Ambient background warmth */}
      <rect x={x - 8} y="6"  width="32" height="26" fill={C.f1} opacity="0.05" />
      <rect x={x - 4} y="2"  width="24" height="18" fill={C.f2} opacity="0.06" />
      {/* Letters */}
      <text x={x}     y="28" fontSize="14" fill={C.f1} opacity="0.96" fontFamily="monospace" fontWeight="bold">{fl.l1}</text>
      <text x={x + 2} y="18" fontSize="11" fill={C.f2} opacity="0.72" fontFamily="monospace" fontWeight="bold">{fl.l2}</text>
      <text x={x + 1} y="10" fontSize="9"  fill={C.f3} opacity="0.46" fontFamily="monospace" fontWeight="bold">{fl.l3}</text>
      <text x={x + 2} y="4"  fontSize="7"  fill={C.wht} opacity="0.20" fontFamily="monospace" fontWeight="bold">{fl.l4}</text>
    </g>
  )
}

// ─── Hat (polygon = true triangle, no steps) ──────────────────────────────────

function Hat({ tilted = false }: { tilted?: boolean }) {
  return (
    <g transform={tilted ? 'rotate(18, 64, 62)' : undefined}>
      {/* Triangle body — smooth diagonal edges */}
      <polygon points="64,2 36,54 92,54" fill={C.n1} />
      {/* Shading on right face of hat */}
      <polygon points="64,2 64,54 92,54" fill={C.n0} opacity="0.28" />
      {/* Highlight on left face */}
      <polygon points="64,2 36,54 64,54" fill={C.n2} opacity="0.15" />

      {/* Brim — kept as rect for contrast with smooth hat */}
      <rect x="20" y="52" width="88" height="9"  fill={C.n2} />
      <rect x="20" y="59" width="88" height="4"  fill={C.n0} opacity="0.45" />
      {/* Band */}
      <rect x="36" y="46" width="56" height="8"  fill={C.n3} opacity="0.30" />

      {/* Crescent moon — refined polygon arcs */}
      <ellipse cx="52" cy="30" rx="7" ry="10" fill={C.gdL} opacity="0.90" filter="url(#wpro-softglow)" />
      <ellipse cx="56" cy="30" rx="5" ry="8"  fill={C.n1} />

      {/* Diamond accent */}
      <polygon points="76,24 80,30 76,36 72,30" fill={C.gdL} opacity="0.85" />
    </g>
  )
}

// ─── Face (same structure as Wizard but with gradient beard) ──────────────────

type Expr = 'default' | 'sleeping' | 'celebrating'

function Face({ expr = 'default' }: { expr?: Expr }) {
  const isSleep = expr === 'sleeping'
  const isHappy = expr === 'celebrating'
  return (
    <>
      {/* Head */}
      <rect x="40" y="60" width="48" height="32" fill={C.sk} rx="2" />
      {/* Cheek warmth */}
      <rect x="41" y="77" width="12" height="8"  fill={C.skM} opacity="0.22" rx="2" />
      <rect x="75" y="77" width="12" height="8"  fill={C.skM} opacity="0.22" rx="2" />

      {/* Eyebrows — arched via two rects */}
      <rect x="44" y="66" width="8"  height="4"  fill={C.brow} />
      <rect x="50" y="64" width="8"  height="4"  fill={C.brow} />
      <rect x="70" y="64" width="8"  height="4"  fill={C.brow} />
      <rect x="76" y="66" width="8"  height="4"  fill={C.brow} />

      {/* Eyes */}
      {isSleep ? (
        <>
          <rect x="44" y="72" width="10" height="3" fill={C.eye} />
          <rect x="70" y="72" width="10" height="3" fill={C.eye} />
        </>
      ) : isHappy ? (
        <>
          <rect x="44" y="72" width="10" height="6" fill={C.eye} />
          <rect x="70" y="72" width="10" height="6" fill={C.eye} />
          <rect x="46" y="73" width="4"  height="3" fill={C.shn} />
          <rect x="72" y="73" width="4"  height="3" fill={C.shn} />
        </>
      ) : (
        <>
          <rect x="44" y="70" width="10" height="10" fill={C.eye} />
          <rect x="70" y="70" width="10" height="10" fill={C.eye} />
          <rect x="46" y="72" width="5"  height="5"  fill={C.shn} />
          <rect x="72" y="72" width="5"  height="5"  fill={C.shn} />
          <rect x="50" y="76" width="2"  height="2"  fill={C.shn} opacity="0.55" />
          <rect x="76" y="76" width="2"  height="2"  fill={C.shn} opacity="0.55" />
        </>
      )}

      {/* Nose */}
      <rect x="60" y="76" width="8" height="5" fill={C.skD} opacity="0.55" rx="1" />

      {/* Mustache */}
      <rect x="50" y="80" width="28" height="4"  fill={C.brM} />
      <rect x="48" y="83" width="32" height="4"  fill={C.br} />

      {/* Gradient beard — 5 tonal layers for depth */}
      <rect x="44" y="87" width="40" height="4"  fill={C.br} />
      <rect x="42" y="91" width="44" height="3"  fill={C.brM} opacity="0.70" />
      <rect x="44" y="91" width="40" height="3"  fill={C.br} opacity="0.90" />
      <rect x="40" y="92" width="48" height="2"  fill={C.brD} opacity="0.40" />
    </>
  )
}

// ─── Body / Robe (polygon hem) ────────────────────────────────────────────────

function Body() {
  return (
    <>
      {/* Collar */}
      <rect x="52" y="90" width="24" height="10" fill={C.n1} />
      <rect x="56" y="90" width="16" height="8"  fill={C.n3} opacity="0.22" />

      {/* Robe body */}
      <rect x="34" y="98" width="60" height="22" fill={C.n1} />
      {/* Side depth */}
      <rect x="34" y="98" width="12" height="22" fill={C.n0} opacity="0.30" />
      <rect x="82" y="98" width="12" height="22" fill={C.n0} opacity="0.30" />
      {/* Center placket */}
      <rect x="58" y="98" width="12" height="24" fill={C.n3} opacity="0.18" />

      {/* Belt strap */}
      <rect x="32" y="116" width="64" height="8"  fill={C.wdD} />
      <rect x="32" y="117" width="64" height="3"  fill={C.wdL} opacity="0.25" />
      {/* Belt buckle — gold square */}
      <rect x="56" y="114" width="16" height="12" fill={C.gd} filter="url(#wpro-softglow)" />
      <rect x="58" y="116" width="12" height="8"  fill={C.gdL} />
      <rect x="60" y="118" width="8"  height="4"  fill={C.gdX} opacity="0.80" />

      {/* Sleeve cuffs */}
      <rect x="10" y="110" width="22" height="8"  fill={C.gd} opacity="0.35" />
      <rect x="96" y="110" width="22" height="8"  fill={C.gd} opacity="0.35" />

      {/* Alchemical cross symbols on chest */}
      <rect x="44" y="102" width="4"  height="12" fill={C.n4} opacity="0.30" />
      <rect x="40" y="108" width="12" height="4"  fill={C.n4} opacity="0.30" />
      <rect x="80" y="102" width="4"  height="12" fill={C.n4} opacity="0.30" />
      <rect x="76" y="108" width="12" height="4"  fill={C.n4} opacity="0.30" />

      {/* Flowing robe hem — polygon gives natural tapered shape */}
      <polygon
        points="28,120 34,118 58,116 70,116 94,118 100,120 110,128 18,128"
        fill={C.n2}
      />
      <polygon
        points="22,126 28,122 58,119 70,119 100,122 106,126 112,128 16,128"
        fill={C.n1}
        opacity="0.60"
      />
    </>
  )
}

// ─── Staff ────────────────────────────────────────────────────────────────────

function Staff({ raised = false, fl }: { raised?: boolean; fl: FL }) {
  const capY = raised ? 22 : 30
  const shY  = capY + 8
  const shH  = 86

  return (
    <>
      <LetterFlame fl={fl} x={10} />

      {/* Staff body — faceted look with polygon highlight strip */}
      <rect x="10" y={capY}     width="16" height="6"  fill={C.wdD} />
      <rect x="11" y={capY + 1} width="14" height="4"  fill={C.gd} />

      {/* Shaft */}
      <rect x="14" y={shY} width="8" height={shH} fill={C.wd} />
      {/* Highlight strip — polygon for slight taper */}
      <polygon
        points={`14,${shY} 17,${shY} 16,${shY + shH} 14,${shY + shH}`}
        fill={C.wdL}
        opacity="0.50"
      />

      {/* Gold bands */}
      <rect x="11" y={shY + 12} width="14" height="5" fill={C.gd} filter="url(#wpro-softglow)" />
      <rect x="11" y={shY + 40} width="14" height="5" fill={C.gd} filter="url(#wpro-softglow)" />

      {/* Base ferrule */}
      <rect x="10" y={shY + shH}     width="16" height="6"  fill={C.wdD} />
      <rect x="12" y={shY + shH + 1} width="12" height="4"  fill={C.gdL} opacity="0.65" />
    </>
  )
}

// ─── Arms ─────────────────────────────────────────────────────────────────────

function Arms({ variant = 'default' }: { variant?: WizardVariant }) {
  if (variant === 'casting') return (
    <>
      <rect x="14" y="92"  width="22" height="24" fill={C.n1} />
      <rect x="10" y="108" width="20" height="8"  fill={C.sk} />
      <rect x="92" y="98"  width="28" height="16" fill={C.n1} />
      <rect x="108" y="94" width="18" height="12" fill={C.sk} />
    </>
  )
  if (variant === 'celebrating') return (
    <>
      <rect x="14" y="78" width="22" height="26" fill={C.n1} />
      <rect x="10" y="74" width="18" height="8"  fill={C.sk} />
      <rect x="92" y="78" width="22" height="26" fill={C.n1} />
      <rect x="100" y="74" width="18" height="8"  fill={C.sk} />
    </>
  )
  if (variant === 'thinking') return (
    <>
      <rect x="14" y="100" width="22" height="18" fill={C.n1} />
      <rect x="10" y="114" width="20" height="8"  fill={C.sk} />
      <rect x="92" y="88"  width="22" height="20" fill={C.n1} />
      <rect x="100" y="84" width="18" height="8"  fill={C.sk} />
    </>
  )
  if (variant === 'waving') return (
    <>
      <rect x="14" y="100" width="22" height="18" fill={C.n1} />
      <rect x="10" y="114" width="20" height="8"  fill={C.sk} />
      <rect x="92" y="82"  width="22" height="26" fill={C.n1} className="wiz-wave-arm" />
      <rect x="100" y="78" width="18" height="8"  fill={C.sk} className="wiz-wave-hand" />
    </>
  )
  return (
    <>
      <rect x="14" y="100" width="22" height="18" fill={C.n1} />
      <rect x="10" y="114" width="20" height="8"  fill={C.sk} />
      <rect x="92" y="100" width="22" height="18" fill={C.n1} />
      <rect x="98" y="114" width="20" height="8"  fill={C.sk} />
    </>
  )
}

// ─── Letter effects ───────────────────────────────────────────────────────────

function ThinkingLetters({ chars }: { chars: [string, string, string] }) {
  return (
    <g filter="url(#wpro-glow)">
      <text x="112" y="72" fontSize="12" fill={C.n4} opacity="0.88" fontFamily="monospace" fontWeight="bold" className="wiz-think-1">{chars[0]}</text>
      <text x="118" y="58" fontSize="10" fill={C.n5} opacity="0.66" fontFamily="monospace" fontWeight="bold" className="wiz-think-2">{chars[1]}</text>
      <text x="122" y="46" fontSize="8"  fill={C.n5} opacity="0.40" fontFamily="monospace" fontWeight="bold" className="wiz-think-3">{chars[2]}</text>
    </g>
  )
}

function CastingLetters({ chars }: { chars: [string, string, string] }) {
  return (
    <g filter="url(#wpro-glow)">
      <text x="118" y="94" fontSize="14" fill={C.f1} opacity="0.92" fontFamily="monospace" fontWeight="bold" className="wiz-cast-1">{chars[0]}</text>
      <text x="122" y="80" fontSize="11" fill={C.f2} opacity="0.70" fontFamily="monospace" fontWeight="bold" className="wiz-cast-2">{chars[1]}</text>
      <text x="124" y="68" fontSize="9"  fill={C.f3} opacity="0.44" fontFamily="monospace" fontWeight="bold" className="wiz-cast-3">{chars[2]}</text>
    </g>
  )
}

function CelebrationLetters({ chars }: { chars: [string, string, string, string] }) {
  return (
    <g filter="url(#wpro-glow)">
      <text x="2"   y="68" fontSize="14" fill={C.gdL} opacity="0.92" fontFamily="monospace" fontWeight="bold" className="wiz-cel-1">{chars[0]}</text>
      <text x="110" y="62" fontSize="12" fill={C.f2}  opacity="0.80" fontFamily="monospace" fontWeight="bold" className="wiz-cel-2">{chars[1]}</text>
      <text x="4"   y="46" fontSize="10" fill={C.f2}  opacity="0.65" fontFamily="monospace" fontWeight="bold" className="wiz-cel-3">{chars[2]}</text>
      <text x="114" y="40" fontSize="10" fill={C.gdL} opacity="0.55" fontFamily="monospace" fontWeight="bold" className="wiz-cel-4">{chars[3]}</text>
    </g>
  )
}

function ZzzLetters() {
  return (
    <g filter="url(#wpro-softglow)">
      <text x="108" y="60" fontSize="10" fontWeight="bold" fill={C.n5} opacity="0.82" fontFamily="monospace" className="wiz-zzz-1">z</text>
      <text x="114" y="48" fontSize="13" fontWeight="bold" fill={C.n5} opacity="0.56" fontFamily="monospace" className="wiz-zzz-2">z</text>
      <text x="120" y="37" fontSize="10" fontWeight="bold" fill={C.n5} opacity="0.30" fontFamily="monospace" className="wiz-zzz-3">z</text>
    </g>
  )
}

// ─── Variant assemblers ───────────────────────────────────────────────────────

interface VP { fl: FL; tl: [string,string,string]; cl: [string,string,string]; cel: [string,string,string,string] }

const ANIM: Record<WizardVariant, string> = {
  default:     'wiz-float',
  casting:     'wiz-cast-anim',
  thinking:    'wiz-think-sway',
  celebrating: 'wiz-celebrate',
  waving:      'wiz-float',
  sleeping:    'wiz-sleep',
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function WizardPro({
  variant = 'default',
  size = 96,
  className = '',
  style,
  scrollReveal = false,
}: WizardProProps) {
  const fl: FL = {
    l1: useChar(280),
    l2: useChar(430, 4),
    l3: useChar(580, 8),
    l4: useChar(720, 12),
  }
  const tl: [string,string,string] = [useChar(400, 2), useChar(400, 7), useChar(400, 13)]
  const cl: [string,string,string] = [useChar(200, 1), useChar(310, 6), useChar(420, 11)]
  const cel: [string,string,string,string] = [useChar(260, 0), useChar(370, 5), useChar(480, 10), useChar(330, 15)]

  const [visible, setVisible] = useState(!scrollReveal)
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (!scrollReveal) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [scrollReveal])

  const vp: VP = { fl, tl, cl, cel }

  return (
    <svg
      ref={ref}
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={[
        ANIM[variant],
        scrollReveal ? (visible ? 'wiz-reveal-in' : 'wiz-reveal-out') : '',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    >
      <Defs />
      {variant === 'default'     && <><Staff fl={vp.fl} /><Hat /><Face /><Body /><Arms /></>}
      {variant === 'casting'     && <><Staff fl={vp.fl} raised /><Hat /><Face /><Body /><Arms variant="casting" /><CastingLetters chars={vp.cl} /></>}
      {variant === 'thinking'    && <><Staff fl={vp.fl} /><Hat /><Face /><Body /><Arms variant="thinking" /><ThinkingLetters chars={vp.tl} /></>}
      {variant === 'celebrating' && <><Hat /><Face expr="celebrating" /><Body /><Arms variant="celebrating" /><CelebrationLetters chars={vp.cel} /></>}
      {variant === 'waving'      && <><Staff fl={vp.fl} /><Hat /><Face /><Body /><Arms variant="waving" /></>}
      {variant === 'sleeping'    && <><Staff fl={vp.fl} /><Hat tilted /><Face expr="sleeping" /><Body /><Arms /><ZzzLetters /></>}
    </svg>
  )
}
