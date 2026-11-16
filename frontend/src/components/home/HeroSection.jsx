
import { Check, House } from "lucide-react";

function HouseIllustration() {
  return (
    <div className="relative w-full overflow-hidden rounded-[30px] rounded-tl-[85px] bg-[#eee5d6]">
      <svg
        viewBox="0 0 600 420"
        className="block w-full"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Illustration d'une maison moderne"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#eee5d6" />
            <stop offset="1" stopColor="#faf4e9" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#77928b" />
            <stop offset="1" stopColor="#496d66" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity=".12" />
          </filter>
        </defs>

        <rect width="600" height="420" fill="url(#sky)" />
        <circle cx="475" cy="75" r="40" fill="#fff8dc" />

        <path
          d="M0 330 Q100 285 205 340 T420 330 T600 300 V420 H0Z"
          fill="#d7d4c1"
        />

        <path
          d="M0 200 C35 180 58 230 48 285 C15 280 -10 245 0 200Z"
          fill="#66836e"
        />
        <path
          d="M25 275 C50 205 100 175 125 215 C145 250 90 300 25 310Z"
          fill="#66836e"
        />

        <g filter="url(#shadow)">
          <path
            d="M130 155 L365 125 L510 170 L510 335 L130 335Z"
            fill="#e8d6bd"
          />
          <path d="M130 155 L365 125 L510 170 L510 192 L130 177Z" fill="#faf2e4" />
          <path d="M130 177 L230 197 L230 320 L130 295Z" fill="url(#glass)" />
          <path d="M230 197 L510 170 L510 300 L230 320Z" fill="#f2e7d6" />

          <path d="M275 210 L340 203 L340 313 L275 319Z" fill="url(#glass)" />
          <path d="M350 203 L415 197 L415 306 L350 313Z" fill="url(#glass)" />
          <path d="M425 196 L480 190 L480 300 L425 306Z" fill="url(#glass)" />

          <path d="M268 205 L268 320 M344 203 L344 314 M419 197 L419 308" stroke="#faf3e6" strokeWidth="6" />
          <path d="M125 155 L365 125 L515 168 L515 181 L365 142 L125 168Z" fill="#66746b" />
          <path d="M130 335 L510 300 L510 320 L130 355Z" fill="#d2b99d" />
          <path d="M365 125 L365 90 L414 84 L414 128Z" fill="#e1c7a9" />
        </g>

        <path
          d="M475 345 C490 305 530 295 555 325 C575 355 540 390 490 385 C460 380 450 360 475 345Z"
          fill="#66836e"
        />
        <path
          d="M500 350 C530 300 565 300 580 330 C595 360 560 390 520 380Z"
          fill="#66836e"
        />

        <path d="M0 390 L600 390" stroke="#e0d4c2" strokeWidth="2" />
        <text x="385" y="408" fontSize="9" fill="#687b6b" letterSpacing="2">
          MADAGASCAR, TOUT SIMPLEMENT.
        </text>
      </svg>

      {/* Floating message */}
      <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf1e6] text-[#315a46]">
          <Check size={18} />
        </span>
        <div>
          <p className="text-[10px] text-[#8b9188]">
            Votre futur chez-vous
          </p>
          <p className="text-[12px] font-semibold text-[#263d33]">
            Il est peut-être juste ici.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-[1080px] grid-cols-1 items-center gap-12 px-5 pb-12 pt-12 md:grid-cols-2 md:gap-14 md:pb-14 md:pt-14 lg:px-0">

      {/* Text */}
      <div className="order-2 md:order-1">
        <div className="mb-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8ba078]" />
          <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#61775d]">
            Votre prochain chapitre commence ici
          </span>
        </div>

        <h1 className="font-serif text-[42px] leading-[1.12] tracking-[-2px] text-[#263d33] sm:text-[50px] lg:text-[54px]">
          Un lieu à vous.
          <span className="mt-1 block font-serif italic text-[#748960]">
            Une vie à imaginer.
          </span>
        </h1>

        <p className="mt-6 max-w-[390px] text-[13px] leading-[1.9] text-[#788078]">
          Des logements à Madagascar, des rencontres de confiance.
          Trouvez l'endroit où vous vous sentirez chez vous.
        </p>

        <div className="mt-7 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dce2d2] bg-[#edf0e6] text-[#708765]">
            <House size={15} strokeWidth={1.5} />
          </span>
          <p className="text-[11px] text-[#778075]">
            Des propriétaires locaux. Des possibilités nouvelles.
          </p>
        </div>
      </div>

      {/* Illustration */}
      <div className="order-1 md:order-2">
        <HouseIllustration />
      </div>
    </section>
  );
}
