
import { Link, NavLink } from "react-router-dom";
import { Home, Plus, ArrowUpRight } from "lucide-react";


export default function Header({ onLoginClick }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e7df]/80 bg-[#fffefa]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5 lg:px-8">

        {/* Logo : conservé */}
        <div className="flex h-full items-center gap-10">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#244d40] text-white transition-transform duration-300 group-hover:scale-105">
              <Home size={23} strokeWidth={1.7} />
            </span>

            <span className="text-[27px] font-extrabold tracking-[-1.5px] text-[#203c33]">
              trano<span className="text-[#879b70]">.</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden h-full items-center gap-8 sm:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative flex h-full items-center text-[13px] font-medium transition-colors duration-200
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#244d40]
                after:transition-all after:duration-300
                ${isActive
                  ? "text-[#244d40] after:w-full"
                  : "text-[#737c74] after:w-0 hover:text-[#244d40] hover:after:w-full"
                }`
              }
            >
              Trouver un logement
            </NavLink>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={onLoginClick}
            className="hidden text-[13px] font-medium text-[#40564b] transition-colors hover:text-[#879b70] sm:block"
          >
            Se connecter
          </button>

          <Link
            to="/publish"
            className="group inline-flex h-[43px] items-center justify-center gap-2 rounded-xl bg-[#244d40] px-4 text-[12px] font-semibold text-white shadow-[0_3px_10px_rgba(36,77,64,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#193d32] hover:shadow-[0_7px_18px_rgba(36,77,64,0.18)] active:translate-y-0 sm:px-5"
          >
            <Plus size={18} strokeWidth={1.8} />
            <span>Publier une annonce</span>
            <ArrowUpRight
              size={14}
              className="opacity-60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
