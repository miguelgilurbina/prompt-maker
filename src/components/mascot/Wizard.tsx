'use client'

/**
 * Wizard — Level 2 mascot
 * 128×128 viewBox · strict pixel art (crispEdges) · blue alchemist
 * Letter flames cycle prompt-syntax characters via React state
 */

import React, { useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type WizardVariant =
  | 'default'
  | 'casting'
  | 'thinking'
  | 'celebrating'
  | 'waving'
  | 'sleeping'

interface WizardProps {
  variant?: WizardVariant
  size?: number
  className?: string
  style?: React.CSSProperties
  scrollReveal?: boolean
}

// ─── Letter flame system ──────────────────────────────────────────────────────

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
  // Blues — hat, robe, arms
  n0: '#0F2357',  // darkest shadow
  n1: '#1E3A8A',  // main deep navy
  n2: '#2952B3',  // medium navy
  n3: '#3B6FD4',  // blue highlight
  n4: '#5B8FE0',  // light blue accent
  // Skin
  sk:  '#F5CBA7',
  skM: '#E8A882',
  skD: '#D4956A',
  // Beard
  br:  '#F0F0F0',
  brM: '#C8C8C8',
  brD: '#999999',
  brow:'#555566',
  // Eyes
  eye: '#1A1A2E',
  shn: '#FFFFFF',
  // Staff wood
  wd:  '#7B4F1A',
  wdL: '#A0681F',
  wdD: '#4A300A',
  // Gold details
  gd:  '#C89010',
  gdL: '#F0C040',
  // Letter flames
  f1:  '#FF8C00',  // amber (base)
  f2:  '#FFD000',  // yellow (mid)
  f3:  '#FFF8B0',  // pale yellow (tip)
  wht: '#FFFFFF',
} as const

// ─── Letter Flame ─────────────────────────────────────────────────────────────

interface FlameLetters { l1: string; l2: string; l3: string; l4: string }

function LetterFlame({ fl, x = 10 }: { fl: FlameLetters; x?: number }) {
  return (
    <>
      {/* Warm halo (stacked rects = soft glow illusion) */}
      <rect x={x - 6} y="10" width="28" height="22" fill={C.f1} opacity="0.06" />
      <rect x={x - 3} y="4"  width="22" height="18" fill={C.f2} opacity="0.07" />
      <rect x={x - 1} y="0"  width="16" height="12" fill={C.f3} opacity="0.05" />
      {/* Letters: bottom = largest/hottest, top = faintest */}
      <text x={x}     y="28" fontSize="14" fill={C.f1} opacity="0.95" fontFamily="monospace" fontWeight="bold">{fl.l1}</text>
      <text x={x + 2} y="18" fontSize="11" fill={C.f2} opacity="0.70" fontFamily="monospace" fontWeight="bold">{fl.l2}</text>
      <text x={x + 1} y="10" fontSize="9"  fill={C.f3} opacity="0.44" fontFamily="monospace" fontWeight="bold">{fl.l3}</text>
      <text x={x + 2} y="4"  fontSize="7"  fill={C.wht} opacity="0.18" fontFamily="monospace" fontWeight="bold">{fl.l4}</text>
    </>
  )
}

// ─── Hat ─────────────────────────────────────────────────────────────────────

function Hat({ tilted = false }: { tilted?: boolean }) {
  return (
    <g transform={tilted ? 'rotate(18, 64, 62)' : undefined}>
      {/* Hat cone — stepped rects give the pixel-art silhouette */}
      <rect x="60" y="2"  width="8"  height="8"  fill={C.n1} />
      <rect x="54" y="10" width="20" height="10" fill={C.n1} />
      <rect x="46" y="20" width="36" height="12" fill={C.n1} />
      <rect x="38" y="32" width="52" height="12" fill={C.n1} />
      <rect x="30" y="44" width="68" height="8"  fill={C.n1} />
      {/* Band just above brim */}
      <rect x="30" y="44" width="68" height="5"  fill={C.n3} opacity="0.35" />
      {/* Brim */}
      <rect x="22" y="52" width="84" height="8"  fill={C.n2} />
      <rect x="22" y="58" width="84" height="4"  fill={C.n0} opacity="0.40" />

      {/* Crescent moon (left of hat, made of rects) */}
      <rect x="46" y="22" width="4"  height="16" fill={C.gdL} />
      <rect x="48" y="20" width="6"  height="4"  fill={C.gdL} />
      <rect x="48" y="36" width="6"  height="4"  fill={C.gdL} />
      {/* Inner cutout = crescent illusion */}
      <rect x="50" y="22" width="6"  height="16" fill={C.n1} />

      {/* Diamond accent right side */}
      <rect x="74" y="26" width="4"  height="10" fill={C.gdL} opacity="0.80" />
      <rect x="72" y="30" width="8"  height="4"  fill={C.gdL} opacity="0.80" />
    </g>
  )
}

// ─── Face ─────────────────────────────────────────────────────────────────────

type Expression = 'default' | 'sleeping' | 'celebrating'

function Face({ expr = 'default' }: { expr?: Expression }) {
  const isSleep = expr === 'sleeping'
  const isHappy = expr === 'celebrating'
  return (
    <>
      {/* Head shape */}
      <rect x="40" y="60" width="48" height="32" fill={C.sk} />
      {/* Subtle cheek blush */}
      <rect x="42" y="78" width="10" height="6"  fill={C.skM} opacity="0.20" />
      <rect x="76" y="78" width="10" height="6"  fill={C.skM} opacity="0.20" />

      {/* Eyebrows */}
      <rect x="44" y="66" width="14" height="4"  fill={C.brow} />
      <rect x="70" y="66" width="14" height="4"  fill={C.brow} />

      {/* Eyes */}
      {isSleep ? (
        <>
          <rect x="44" y="72" width="10" height="3" fill={C.eye} />
          <rect x="70" y="72" width="10" height="3" fill={C.eye} />
        </>
      ) : isHappy ? (
        <>
          {/* Squinting happy eyes */}
          <rect x="44" y="72" width="10" height="6" fill={C.eye} />
          <rect x="70" y="72" width="10" height="6" fill={C.eye} />
          <rect x="46" y="73" width="4"  height="3" fill={C.shn} />
          <rect x="72" y="73" width="4"  height="3" fill={C.shn} />
        </>
      ) : (
        <>
          {/* Normal eyes — larger, with prominent shine */}
          <rect x="44" y="70" width="10" height="10" fill={C.eye} />
          <rect x="70" y="70" width="10" height="10" fill={C.eye} />
          <rect x="46" y="72" width="5"  height="5"  fill={C.shn} />
          <rect x="72" y="72" width="5"  height="5"  fill={C.shn} />
          {/* Small secondary shine (depth) */}
          <rect x="50" y="76" width="2"  height="2"  fill={C.shn} opacity="0.60" />
          <rect x="76" y="76" width="2"  height="2"  fill={C.shn} opacity="0.60" />
        </>
      )}

      {/* Nose */}
      <rect x="60" y="76" width="8"  height="6"  fill={C.skD} opacity="0.60" />

      {/* Bushy mustache — two layers */}
      <rect x="50" y="80" width="28" height="4"  fill={C.brM} />
      <rect x="48" y="82" width="32" height="4"  fill={C.br} />

      {/* Beard — three layers for depth */}
      <rect x="44" y="86" width="40" height="6"  fill={C.br} />
      <rect x="40" y="90" width="48" height="4"  fill={C.br} />
      <rect x="44" y="90" width="40" height="4"  fill={C.brM} opacity="0.50" />
    </>
  )
}

// ─── Body / Robe ──────────────────────────────────────────────────────────────

function Body() {
  return (
    <>
      {/* Collar peeking above robe */}
      <rect x="52" y="90" width="24" height="10" fill={C.n1} />
      <rect x="56" y="90" width="16" height="8"  fill={C.n3} opacity="0.20" />

      {/* Robe main body */}
      <rect x="34" y="98" width="60" height="22" fill={C.n1} />
      {/* Side depth shading */}
      <rect x="34" y="98" width="12" height="22" fill={C.n0} opacity="0.25" />
      <rect x="82" y="98" width="12" height="22" fill={C.n0} opacity="0.25" />
      {/* Center placket stripe */}
      <rect x="58" y="98" width="12" height="24" fill={C.n3} opacity="0.18" />

      {/* Robe widens downward */}
      <rect x="28" y="118" width="72" height="6"  fill={C.n1} />
      <rect x="22" y="122" width="84" height="4"  fill={C.n2} />
      <rect x="18" y="124" width="92" height="4"  fill={C.n3} opacity="0.30" />

      {/* Rune cross symbols on chest (alchemist detail) */}
      <rect x="44" y="102" width="4"  height="12" fill={C.n4} opacity="0.28" />
      <rect x="40" y="108" width="12" height="4"  fill={C.n4} opacity="0.28" />
      <rect x="80" y="102" width="4"  height="12" fill={C.n4} opacity="0.28" />
      <rect x="76" y="108" width="12" height="4"  fill={C.n4} opacity="0.28" />
    </>
  )
}

// ─── Staff ────────────────────────────────────────────────────────────────────

function Staff({ raised = false, fl }: { raised?: boolean; fl: FlameLetters }) {
  const capY  = raised ? 22 : 30
  const shY   = capY + 8
  const shH   = 88   // shaft height (ends near hand ~y=120)

  return (
    <>
      <LetterFlame fl={fl} x={10} />

      {/* Top cap */}
      <rect x="10" y={capY}     width="16" height="6"  fill={C.wdD} />
      <rect x="11" y={capY + 1} width="14" height="4"  fill={C.gd} />

      {/* Shaft with left-edge highlight */}
      <rect x="14" y={shY} width="8"  height={shH} fill={C.wd} />
      <rect x="14" y={shY} width="3"  height={shH} fill={C.wdL} opacity="0.40" />

      {/* Two gold bands along shaft */}
      <rect x="11" y={shY + 12} width="14" height="5" fill={C.gd} />
      <rect x="11" y={shY + 40} width="14" height="5" fill={C.gd} />

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
      {/* Left arm raised (holding staff up) */}
      <rect x="14" y="92" width="22" height="24" fill={C.n1} />
      <rect x="10" y="108" width="20" height="8"  fill={C.sk} />
      {/* Right arm extended — conjuring posture */}
      <rect x="92" y="98" width="28" height="16" fill={C.n1} />
      <rect x="108" y="94" width="18" height="12" fill={C.sk} />
    </>
  )

  if (variant === 'celebrating') return (
    <>
      {/* Both arms raised */}
      <rect x="14" y="78" width="22" height="26" fill={C.n1} />
      <rect x="10" y="74" width="18" height="8"  fill={C.sk} />
      <rect x="92" y="78" width="22" height="26" fill={C.n1} />
      <rect x="100" y="74" width="18" height="8"  fill={C.sk} />
    </>
  )

  if (variant === 'thinking') return (
    <>
      {/* Left arm — holding staff, relaxed */}
      <rect x="14" y="100" width="22" height="18" fill={C.n1} />
      <rect x="10" y="114" width="20" height="8"  fill={C.sk} />
      {/* Right arm — raised to chin, pondering */}
      <rect x="92" y="88" width="22" height="20"  fill={C.n1} />
      <rect x="100" y="84" width="18" height="8"   fill={C.sk} />
    </>
  )

  if (variant === 'waving') return (
    <>
      {/* Left arm — staff hold */}
      <rect x="14" y="100" width="22" height="18" fill={C.n1} />
      <rect x="10" y="114" width="20" height="8"  fill={C.sk} />
      {/* Right arm raised in wave */}
      <rect x="92" y="82" width="22" height="26"  fill={C.n1} className="wiz-wave-arm" />
      <rect x="100" y="78" width="18" height="8"   fill={C.sk} className="wiz-wave-hand" />
    </>
  )

  // default / sleeping
  return (
    <>
      <rect x="14" y="100" width="22" height="18" fill={C.n1} />
      <rect x="10" y="114" width="20" height="8"  fill={C.sk} />
      <rect x="92" y="100" width="22" height="18" fill={C.n1} />
      <rect x="98" y="114" width="20" height="8"  fill={C.sk} />
    </>
  )
}

// ─── Floating letter effects ──────────────────────────────────────────────────

function ThinkingLetters({ chars }: { chars: [string, string, string] }) {
  return (
    <>
      <text x="112" y="72" fontSize="12" fill={C.n3} opacity="0.85" fontFamily="monospace" fontWeight="bold" className="wiz-think-1">{chars[0]}</text>
      <text x="118" y="58" fontSize="10" fill={C.n4} opacity="0.65" fontFamily="monospace" fontWeight="bold" className="wiz-think-2">{chars[1]}</text>
      <text x="122" y="46" fontSize="8"  fill={C.n4} opacity="0.40" fontFamily="monospace" fontWeight="bold" className="wiz-think-3">{chars[2]}</text>
    </>
  )
}

function CastingLetters({ chars }: { chars: [string, string, string] }) {
  return (
    <>
      <text x="118" y="94" fontSize="14" fill={C.f1} opacity="0.90" fontFamily="monospace" fontWeight="bold" className="wiz-cast-1">{chars[0]}</text>
      <text x="122" y="80" fontSize="11" fill={C.f2} opacity="0.68" fontFamily="monospace" fontWeight="bold" className="wiz-cast-2">{chars[1]}</text>
      <text x="124" y="68" fontSize="9"  fill={C.f3} opacity="0.42" fontFamily="monospace" fontWeight="bold" className="wiz-cast-3">{chars[2]}</text>
    </>
  )
}

function CelebrationLetters({ chars }: { chars: [string, string, string, string] }) {
  return (
    <>
      <text x="2"   y="68" fontSize="14" fill={C.gdL} opacity="0.90" fontFamily="monospace" fontWeight="bold" className="wiz-cel-1">{chars[0]}</text>
      <text x="110" y="62" fontSize="12" fill={C.f2}  opacity="0.80" fontFamily="monospace" fontWeight="bold" className="wiz-cel-2">{chars[1]}</text>
      <text x="4"   y="46" fontSize="10" fill={C.f2}  opacity="0.65" fontFamily="monospace" fontWeight="bold" className="wiz-cel-3">{chars[2]}</text>
      <text x="114" y="40" fontSize="10" fill={C.gdL} opacity="0.55" fontFamily="monospace" fontWeight="bold" className="wiz-cel-4">{chars[3]}</text>
    </>
  )
}

function ZzzLetters() {
  return (
    <>
      <text x="108" y="60" fontSize="10" fontWeight="bold" fill={C.n4} opacity="0.80" fontFamily="monospace" className="wiz-zzz-1">z</text>
      <text x="114" y="48" fontSize="13" fontWeight="bold" fill={C.n4} opacity="0.55" fontFamily="monospace" className="wiz-zzz-2">z</text>
      <text x="120" y="37" fontSize="10" fontWeight="bold" fill={C.n4} opacity="0.30" fontFamily="monospace" className="wiz-zzz-3">z</text>
    </>
  )
}

// ─── Variant assemblers ───────────────────────────────────────────────────────

interface VariantProps {
  fl: FlameLetters
  tl: [string, string, string]
  cl: [string, string, string]
  cel: [string, string, string, string]
}

function VariantDefault({ fl }: Pick<VariantProps, 'fl'>) {
  return (<><Staff fl={fl} /><Hat /><Face /><Body /><Arms /></>)
}
function VariantCasting({ fl, cl }: Pick<VariantProps, 'fl' | 'cl'>) {
  return (<><Staff fl={fl} raised /><Hat /><Face /><Body /><Arms variant="casting" /><CastingLetters chars={cl} /></>)
}
function VariantThinking({ fl, tl }: Pick<VariantProps, 'fl' | 'tl'>) {
  return (<><Staff fl={fl} /><Hat /><Face /><Body /><Arms variant="thinking" /><ThinkingLetters chars={tl} /></>)
}
function VariantCelebrating({ cel }: Pick<VariantProps, 'cel'>) {
  return (<><Hat /><Face expr="celebrating" /><Body /><Arms variant="celebrating" /><CelebrationLetters chars={cel} /></>)
}
function VariantWaving({ fl }: Pick<VariantProps, 'fl'>) {
  return (<><Staff fl={fl} /><Hat /><Face /><Body /><Arms variant="waving" /></>)
}
function VariantSleeping({ fl }: Pick<VariantProps, 'fl'>) {
  return (<><Staff fl={fl} /><Hat tilted /><Face expr="sleeping" /><Body /><Arms /><ZzzLetters /></>)
}

// ─── Animation class map ──────────────────────────────────────────────────────

const ANIM: Record<WizardVariant, string> = {
  default:     'wiz-float',
  casting:     'wiz-cast-anim',
  thinking:    'wiz-think-sway',
  celebrating: 'wiz-celebrate',
  waving:      'wiz-float',
  sleeping:    'wiz-sleep',
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Wizard({
  variant = 'default',
  size = 96,
  className = '',
  style,
  scrollReveal = false,
}: WizardProps) {
  // ALL hooks called unconditionally — safe regardless of variant
  const fl: FlameLetters = {
    l1: useChar(280),
    l2: useChar(430, 4),
    l3: useChar(580, 8),
    l4: useChar(720, 12),
  }
  const tl: [string, string, string] = [useChar(400, 2), useChar(400, 7), useChar(400, 13)]
  const cl: [string, string, string] = [useChar(200, 1), useChar(310, 6), useChar(420, 11)]
  const cel: [string, string, string, string] = [useChar(260, 0), useChar(370, 5), useChar(480, 10), useChar(330, 15)]

  const [visible, setVisible] = useState(!scrollReveal)
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (!scrollReveal) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [scrollReveal])

  const vp: VariantProps = { fl, tl, cl, cel }

  return (
    <svg
      ref={ref}
      viewBox="0 0 128 128"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={[
        ANIM[variant],
        scrollReveal ? (visible ? 'wiz-reveal-in' : 'wiz-reveal-out') : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ imageRendering: 'pixelated', ...style }}
      aria-hidden="true"
    >
      {variant === 'default'     && <VariantDefault     fl={vp.fl} />}
      {variant === 'casting'     && <VariantCasting     fl={vp.fl} cl={vp.cl} />}
      {variant === 'thinking'    && <VariantThinking    fl={vp.fl} tl={vp.tl} />}
      {variant === 'celebrating' && <VariantCelebrating cel={vp.cel} />}
      {variant === 'waving'      && <VariantWaving      fl={vp.fl} />}
      {variant === 'sleeping'    && <VariantSleeping    fl={vp.fl} />}
    </svg>
  )
}
