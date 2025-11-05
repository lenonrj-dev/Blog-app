import { useSearchParams } from "react-router-dom";
import Search from "./Search";
import { motion, useReducedMotion } from "framer-motion";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReduced = useReducedMotion();

  const currentSort = (searchParams.get("sort") || "").toLowerCase();
  const currentCat = (searchParams.get("cat") || "").toLowerCase();

  const updateParams = (patch) => {
    const base = Object.fromEntries(searchParams.entries());
    const next = { ...base, ...patch };
    // remove chaves vazias para evitar URL suja
    Object.keys(next).forEach((k) => {
      if (next[k] === "" || next[k] == null) delete next[k];
    });
    setSearchParams(next, { replace: true });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (currentSort !== value) updateParams({ sort: value });
  };

  const handleCategoryChange = (category) => {
    if (currentCat !== category) updateParams({ cat: category });
  };

  const fadeBlock = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.32, ease: "easeOut" } };

  return (
    <aside
      role="complementary"
      aria-label="Barra lateral de filtros e busca"
      // ✅ Corrigido: não sobrepor conteúdo
      // - mobile: posição estática e z-0 (nunca fica por cima)
      // - desktop: sticky dentro da coluna, com rolagem própria
      className="relative z-0 w-full md:w-[280px] lg:w-[320px] xl:w-[340px] overflow-hidden md:overflow-visible md:sticky md:top-8 h-max md:max-h-[calc(100vh-6rem)]"
    >
      <div className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
        {/* BUSCA */}
        <motion.div {...fadeBlock}>
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-slate-900">Buscar</h2>
          <Search />
        </motion.div>

        <hr className="my-5 border-slate-200" aria-hidden="true" />

        {/* ORDENAR */}
        <motion.fieldset {...fadeBlock} className="flex flex-col gap-2 text-sm" role="radiogroup" aria-label="Ordenar resultados">
          <legend className="mb-2 text-sm font-semibold tracking-tight text-slate-900">Ordenar</legend>

          {[
            { value: "newest", label: "Mais recentes" },
            { value: "popular", label: "Mais populares" },
            { value: "trending", label: "Em alta" },
            { value: "oldest", label: "Mais antigas" },
          ].map(({ value, label }) => (
            <label key={value} htmlFor={`sort-${value}`} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id={`sort-${value}`}
                type="radio"
                name="sort"
                value={value}
                onChange={handleSortChange}
                checked={currentSort === value}
                className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus-visible:ring-blue-600/40"
              />
              <span className="text-slate-700">{label}</span>
            </label>
          ))}
        </motion.fieldset>

        <hr className="my-5 border-slate-200" aria-hidden="true" />

        {/* CATEGORIAS */}
        <motion.nav {...fadeBlock} aria-label="Categorias" className="text-sm">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-slate-900">Categorias</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "ciencia", label: "Ciência" },
              { key: "politica", label: "Política" },
              { key: "negocios", label: "Negócios" },
              { key: "tecnologia", label: "Tecnologia" },
              { key: "marketing", label: "Marketing" },
            ].map(({ key, label }) => {
              const selected = currentCat === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange(key)}
                  aria-current={selected ? "true" : undefined}
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 ${
                    selected
                      ? "text-white shadow-sm"
                      : "text-slate-700 ring-1 ring-slate-200 hover:ring-blue-300"
                  }`}
                  style={selected ? { background: "linear-gradient(90deg,#0ea5e9 0%,#06b6d4 100%)" } : {}}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </motion.nav>

        {/* AÇÕES SECUNDÁRIAS */}
        <motion.div {...fadeBlock} className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateParams({ sort: "newest" })}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 no-underline shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-3 py-2 text-xs font-medium"
          >
            Redefinir ordenação
          </button>
          <button
            type="button"
            onClick={() => updateParams({ cat: "" })}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 no-underline shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-3 py-2 text-xs font-medium"
          >
            Limpar categoria
          </button>
        </motion.div>
      </div>
    </aside>
  );
};

export default SideMenu;
