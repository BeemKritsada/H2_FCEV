import { useId } from 'react'

function ElectrolyzerDrawing({ metal }: { metal: string }) {
  return <g>
    <path d="m5 225 72-30 245 15-55 35Z" fill="#d9e7f0" /><path d="M20 212h270v16H20Z" fill="#174975" />
    <path d="M62 170v46M236 170v46" stroke="#0753c8" strokeWidth="13" />
    <rect x="70" y="77" width="161" height="115" fill={metal} />
    {Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx={78 + i * 8.4} cy="134" rx="17" ry="56" fill={metal} stroke="#94afc2" strokeWidth="1.5" />)}
    <ellipse cx="68" cy="134" rx="19" ry="62" fill="#0753c8" /><ellipse cx="232" cy="134" rx="19" ry="62" fill="#176fb7" />
    <path d="M67 95h169M66 174h170" stroke="#c8d5df" strokeWidth="5" />
    <path d="m258 82 35-12 27 11v127l-36 12-26-13Z" fill="#dce8f0" stroke="#a3bacd" />
    <path d="M266 98h18v30h-18Z" fill="#174975" /><circle cx="275" cy="140" r="4" fill="#16a56a" />
  </g>
}

function TankDrawing({ metal }: { metal: string }) {
  return <g>
    <ellipse cx="167" cy="225" rx="155" ry="20" fill="#eff4f8" />
    <path d="M37 207h263v16H37Z" fill="#174975" /><path d="M83 160v52M249 160v52" stroke="#6e91ad" strokeWidth="14" />
    <rect x="67" y="83" width="200" height="102" fill={metal} />
    <ellipse cx="69" cy="134" rx="40" ry="51" fill={metal} /><ellipse cx="264" cy="134" rx="38" ry="51" fill={metal} />
    <path d="M88 86v96M248 85v98" stroke="#6e8ba2" strokeWidth="5" />
    <path d="M298 125h20v18h-20Z" fill="#90a9bc" /><path d="M316 118h11v25h-11Z" fill="#0753c8" />
  </g>
}

function StackDrawing({ metal }: { metal: string }) {
  return <g>
    <path d="m10 216 74-25 228 14-48 29Z" fill="#dce7f0" /><path d="M30 204h245v15H30Z" fill="#174975" />
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`m${63 + i * 8} 96 30-22 0 122-30 12Z`} fill={i % 2 ? '#829cad' : '#4f697e'} stroke="#c5d4de" />)}
    <path d="m53 95 33-23v124l-33 15Z" fill="#0753c8" /><path d="m236 91 34-20v125l-34 16Z" fill="#237abd" />
    <path d="M62 109h195M63 190h195" stroke="#dce7ee" strokeWidth="5" />
    <path d="M269 108h26v16h-26ZM269 165h24v16h-24Z" fill={metal} />
  </g>
}

function TurbineDrawing({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="m-4 0-5 173h18L4 0Z" fill="#dce9f1" stroke="#9ab5c9" />
    <g className="batch-turbine-rotor">{[0, 120, 240].map((angle) => <path key={angle} transform={`rotate(${angle})`} d="M-5 0-8-18 0-87 6-90 10-23 5 0Z" fill="#e9f3f9" stroke="#83a9c4" />)}</g>
    <circle r="10" fill="#0753c8" /><circle r="3" fill="white" />
  </g>
}

/** Explicit conceptual fallback: no photographic or manufacturer-specific asset. */
export function ConceptFallback({ kind }: { kind: 'facility' | 'equipment' }) {
  const id = useId().replaceAll(':', '')
  const metal = `url(#${id}-metal)`
  return <svg aria-hidden="true" className={`batch-concept-svg batch-concept-svg--${kind}`} viewBox={kind === 'facility' ? '0 0 1000 560' : '0 0 1200 290'}>
    <defs><linearGradient id={`${id}-metal`} x2="0" y2="1"><stop stopColor="#d1e1ec" /><stop offset=".42" stopColor="#fbfdff" /><stop offset="1" stopColor="#b4cbdc" /></linearGradient></defs>
    {kind === 'equipment' ? <>
      <g transform="translate(25 0)"><ElectrolyzerDrawing metal={metal} /><path className="batch-svg-scan" d="M35 100h270" stroke="#00a8e8" opacity=".4" /></g>
      <g transform="translate(425 0)"><TankDrawing metal={metal} /><path className="batch-svg-scan" d="M35 120h270" stroke="#00a8e8" opacity=".4" /></g>
      <g transform="translate(835 0)"><StackDrawing metal={metal} /><path className="batch-svg-scan" d="M35 110h270" stroke="#00a8e8" opacity=".4" /></g>
    </> : <>
      <path d="M40 394 433 256 964 389 574 548Z" fill="#f1f6f9" stroke="#dbe7ef" strokeWidth="2" />
      <TurbineDrawing x={214} y={146} /><TurbineDrawing x={361} y={178} scale={0.7} />
      <g transform="translate(204 345) skewY(-15)">{[0, 1, 2].flatMap((row) => [0, 1, 2, 3].map((column) => <g key={`${row}-${column}`} transform={`translate(${column * 49} ${row * 35})`}>
        <path d="M3 5h43v28H3Z" fill="#155489" stroke="#9cbbd0" />
        <path d="M17 5v28M31 5v28M3 19h43" stroke="#6f9bbc" strokeWidth=".6" />
      </g>))}</g>
      <path d="M226 320 318 335 442 359 508 379M386 437 453 410 508 379" fill="none" stroke="#a8d6be" strokeWidth="5" />
      <path className="batch-svg-flow" d="M226 320 318 335 442 359 508 379M386 437 453 410 508 379" fill="none" stroke="#16a56a" strokeWidth="4" strokeDasharray="14 32" />
      <g transform="translate(462 259) scale(.65)"><ElectrolyzerDrawing metal={metal} /></g>
      <path d="M661 382 699 379 758 368" fill="none" stroke="#b1cde5" strokeWidth="5" />
      <path className="batch-svg-flow" d="M661 382 699 379 758 368" fill="none" stroke="#0753c8" strokeWidth="4" strokeDasharray="14 24" />
      <g transform="translate(718 254) scale(.57)"><TankDrawing metal={metal} /></g>
      <g transform="translate(690 322) scale(.57)"><TankDrawing metal={metal} /></g>
    </>}
  </svg>
}
