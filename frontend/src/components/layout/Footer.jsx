
import { Link } from "react-router-dom";
import {
  Home,
  ArrowUpRight,
  MapPin,
  Heart,
} from "lucide-react";

const footerSections = [
  {
    title: "Explorer",
    links: [
      { label: "Accueil", to: "/" },
      { label: "Tous les logements", to: "/properties" },
      { label: "Publier une annonce", to: "/publish" },
    ],
  },
  {
    title: "Mon espace",
    links: [
      { label: "Se connecter", to: "/login" },
      { label: "Créer un compte", to: "/register" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e8e5dc] bg-[#f5f3ec]">

      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#244d40] text-white transition-transform duration-300 group-hover:scale-105">
                <Home size={23} strokeWidth={1.7} />
              </span>

              <span className="text-[27px] font-extrabold tracking-[-1.5px] text-[#203c33]">
                trano<span className="text-[#879b70]">.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-[260px] text-[13px] leading-7 text-[#777f76]">
              Trouvez votre prochain chez-vous.
              Des logements à Madagascar, des rencontres de confiance.
            </p>

            <div className="mt-5 flex items-center gap-2 text-[11px] font-medium text-[#71836c]">
              <MapPin size={14} />
              Madagascar
            </div>
          </div>

          {/* Dynamic sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[1.8px] text-[#294b3e]">
                {section.title}
              </h3>

              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1 text-[13px] text-[#727a72] transition-colors duration-200 hover:text-[#244d40]"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* About */}
          <div>
            <h3 className="mb-6 text-[11px] font-bold uppercase tracking-[1.8px] text-[#294b3e]">
              Notre philosophie
            </h3>

            <p className="text-[13px] leading-7 text-[#727a72]">
              Plus qu'un logement, un endroit où construire votre histoire.
              Trano rapproche les propriétaires et les futurs locataires.
            </p>

            <p className="mt-5 flex items-center gap-1.5 text-[12px] font-medium text-[#71836c]">
              Fait avec <Heart size={13} className="fill-[#879b70] text-[#879b70]" /> à Madagascar
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#e2dfd5] py-6 sm:flex-row">

          <p className="text-[11px] text-[#898e85]">
            © {new Date().getFullYear()} Trano. Tous droits réservés.
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#71836c]">
            Madagascar, tout simplement.
          </p>

        </div>
      </div>
    </footer>
  );
}
