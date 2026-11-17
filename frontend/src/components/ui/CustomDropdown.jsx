
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = "Sélectionner",
  label,
  icon: TriggerIcon,
  disabled = false,
  searchable = false,
  className = "",
  menuClassName = "",
  size = "md",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open && searchable) {
      searchRef.current?.focus();
    }
  }, [open, searchable]);

  const selectOption = (option) => {
    if (option.disabled) return;

    onChange?.(option.value);
    setOpen(false);
    setSearch("");
  };

  const sizeClasses = {
    sm: "h-9 text-[11px] px-3",
    md: "h-11 text-[12px] px-3.5",
    lg: "h-12 text-[13px] px-4",
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      {label && (
        <label className="mb-2 block text-[11px] font-semibold text-[#405348]">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`
          group flex w-full items-center justify-between gap-3
          rounded-xl border bg-white text-left
          transition-all duration-200
          ${sizeClasses[size] || sizeClasses.md}
          ${
            open
              ? "border-[#829775] ring-4 ring-[#829775]/10"
              : "border-[#e7e7df] hover:border-[#c6d2bf]"
          }
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {TriggerIcon && (
            <TriggerIcon
              size={16}
              strokeWidth={1.7}
              className="shrink-0 text-[#84957b]"
            />
          )}

          <span
            className={`truncate ${
              selectedOption
                ? "font-medium text-[#34483d]"
                : "text-[#9a9d94]"
            }`}
          >
            {selectedOption?.label || placeholder}
          </span>
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-[#829084] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      <div
        className={`
          absolute left-0 top-full z-50 mt-2 w-full
          origin-top overflow-hidden rounded-xl border
          border-[#e9e8df] bg-white
          shadow-[0_12px_35px_rgba(39,57,44,0.12)]
          transition-all duration-200
          ${
            open
              ? "visible translate-y-0 scale-100 opacity-100"
              : "invisible -translate-y-2 scale-[0.98] opacity-0"
          }
          ${menuClassName}
        `}
      >
        {searchable && (
          <div className="border-b border-[#efeee8] p-2.5">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une option..."
              className="h-9 w-full rounded-lg bg-[#f7f8f4] px-3 text-[11px] text-[#34483d] outline-none placeholder:text-[#9a9d94] focus:ring-2 focus:ring-[#829775]/20"
            />
          </div>
        )}

        <div
          role="listbox"
          className="max-h-60 overflow-y-auto p-1.5 -mb-1.5"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const selected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <button
                  key={String(option.value)}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={option.disabled}
                  onClick={() => selectOption(option)}
                  className={`
                    flex w-full items-center justify-between gap-3
                    rounded-lg px-3 py-2.5 mb-1.5 text-left
                    transition-colors duration-150
                    ${
                      selected
                        ? "bg-[#edf2e9] text-[#315b49]"
                        : "text-[#667469] hover:bg-[#f7f8f4] hover:text-[#315b49]"
                    }
                    ${option.disabled ? "cursor-not-allowed opacity-40" : ""}
                  `}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {OptionIcon && (
                      <OptionIcon
                        size={15}
                        className="shrink-0 text-[#84957b]"
                      />
                    )}

                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-medium">
                        {option.label}
                      </span>

                      {option.description && (
                        <span className="mt-0.5 block text-[9px] text-[#9a9d94]">
                          {option.description}
                        </span>
                      )}
                    </span>
                  </span>

                  {selected && (
                    <Check
                      size={15}
                      strokeWidth={2}
                      className="shrink-0 text-[#315b49]"
                    />
                  )}
                </button>
              );
            })
          ) : (
            <p className="px-3 py-5 text-center text-[11px] text-[#9a9d94]">
              Aucune option trouvée.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
