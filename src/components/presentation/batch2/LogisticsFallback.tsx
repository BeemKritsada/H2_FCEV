/** Layered vector concept while WebGL loads, or on unavailable/lost GPU contexts. */
export function LogisticsFallback() {
  return <svg className="logistics-fallback" viewBox="0 0 1040 290" aria-hidden="true">
    <path d="M20 206 L145 121 L1020 149 L904 260 Z" fill="#f0f5f9" />
    <g stroke="#8dacc4" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M55 132 L90 111 L221 122 L187 144 Z" fill="#a8c3d9" /><path d="M55 132 L187 144 V204 L55 192 Z" fill="#e2edf4" /><path d="M187 144 L221 122 V179 L187 204 Z" fill="#b6d2e5" />
      <path d="M60 190 L196 201 L225 181 V195 L193 219 L60 207 Z" fill="#0753c8" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${72 + i * 9} 140 v46`} stroke="#607f98" strokeWidth="4" />)}
      <rect x="211" y="142" width="24" height="49" rx="3" fill="#f4f8fc" /><rect x="215" y="150" width="16" height="11" fill="#0753c8" />
      {[0, 1].map((i) => <g key={i} transform={`translate(0 ${i * 37})`}><path d="M295 136 L420 144 L450 128 L325 120 Z" fill="#c2d9e7" /><rect x="295" y="106" width="140" height="35" rx="17" fill="#dceaf3" /><ellipse cx="429" cy="123" rx="13" ry="18" fill="#b4d2e5" /><path d="M321 107 V138 M404 107 V140" fill="none" stroke="#6e92ad" strokeWidth="3" /></g>)}
      <path d="M305 188 V202 M425 187 V202" stroke="#0753c8" strokeWidth="7" />
      <circle cx="380" cy="91" r="14" fill="white" /><path className="infra-pressure" d="M380 91 L386 82" stroke="#0753c8" strokeWidth="2" />
      <g className="infra-trailer">
        <path d="M536 186 L701 198 L723 181 L558 169 Z" fill="#0753c8" />
        {[0, 1, 2].map((i) => <rect key={i} x="545" y={119 + i * 19} width="130" height="16" rx="8" fill="#dceaf3" />)}
        <path d="M674 129 L728 133 L744 158 V195 L690 199 L674 182 Z" fill="#0753c8" /><path d="M696 140 L725 143 L736 160 L695 158 Z" fill="#a9d9ed" />
        {[555, 590, 720].map((x) => <g key={x}><circle cx={x} cy="199" r="13" fill="#31485c" /><circle cx={x} cy="199" r="5" fill="#b4cbdc" /></g>)}
      </g>
      <path d="M810 98 L850 73 L1007 81 L970 110 Z" fill="#0753c8" /><path d="M810 98 V111 L970 123 V110 Z" fill="#07398f" />
      <path d="M835 114 V214 M962 122 V221" stroke="#89aac1" strokeWidth="7" />
      <path d="M880 146 L919 149 V216 L880 212 Z" fill="#f4f8fc" /><path d="M887 157 L911 159 V179 L887 177 Z" fill="#0753c8" /><path d="M919 169 C949 154 947 217 924 201" fill="none" stroke="#234b6d" strokeWidth="4" />
    </g>
    <path d="M99 225 H376 V205" fill="none" stroke="#16a56a" strokeWidth="6" />
    <path className="infra-signal" d="M190 237 L394 240 L658 247 L904 249" fill="none" stroke="#00a8e8" strokeWidth="4" pathLength="100" strokeDasharray="2 23" />
  </svg>
}
