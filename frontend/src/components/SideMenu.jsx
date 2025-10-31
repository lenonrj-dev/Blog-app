import { useSearchParams } from "react-router-dom";
import Search from "./Search";
import { motion, useReducedMotion } from "framer-motion";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReduced = useReducedMotion();

  const currentSort = searchParams.get("sort") || "";
  const currentCat = searchParams.get("cat") || "";

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };

  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat: category,
      });
    }
  };

  return (
    <aside
      className="px-4 pb-4 h-max sticky top-8 rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md"
      aria-label="Barra lateral"
    >
      <motion.h2
        initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="mb-4 text-sm font-medium tracking-tight text-slate-900/95"
      >
        Buscar
      </motion.h2>

      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <Search />
      </motion.div>

      <motion.h2
        initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.32, ease: "easeOut", delay: 0.04 }}
        className="mt-8 mb-4 text-sm font-medium tracking-tight text-slate-900/95"
      >
        Ordenar
      </motion.h2>

      <fieldset
        role="radiogroup"
        aria-label="Ordenar resultados"
        aria-describedby="ordenar-dica"
        className="flex flex-col gap-2 text-sm"
      >
        <span id="ordenar-dica" className="sr-only">
          Selecione uma opção de ordenação para reordenar os resultados
        </span>

        <label htmlFor="sort-newest" className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="sort-newest"
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            defaultChecked={currentSort === "newest"}
            className="appearance-none w-4 h-4 rounded-[6px] ring-1 ring-slate-300 checked:ring-2 checked:ring-blue-600/40 bg-white checked:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
          />
          <span className="text-slate-700">Mais recentes</span>
        </label>

        <label htmlFor="sort-popular" className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="sort-popular"
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            defaultChecked={currentSort === "popular"}
            className="appearance-none w-4 h-4 rounded-[6px] ring-1 ring-slate-300 checked:ring-2 checked:ring-blue-600/40 bg-white checked:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
          />
          <span className="text-slate-700">Mais populares</span>
        </label>

        <label htmlFor="sort-trending" className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="sort-trending"
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            defaultChecked={currentSort === "trending"}
            className="appearance-none w-4 h-4 rounded-[6px] ring-1 ring-slate-300 checked:ring-2 checked:ring-blue-600/40 bg-white checked:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
          />
          <span className="text-slate-700">Em alta</span>
        </label>

        <label htmlFor="sort-oldest" className="flex items-center gap-2 cursor-pointer select-none">
          <input
            id="sort-oldest"
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            defaultChecked={currentSort === "oldest"}
            className="appearance-none w-4 h-4 rounded-[6px] ring-1 ring-slate-300 checked:ring-2 checked:ring-blue-600/40 bg-white checked:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
          />
          <span className="text-slate-700">Mais antigas</span>
        </label>
      </fieldset>

      <motion.h2
        initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.32, ease: "easeOut", delay: 0.04 }}
        className="mt-8 mb-4 text-sm font-medium tracking-tight text-slate-900/95"
      >
        Categorias
      </motion.h2>

      <div className="flex flex-col gap-2 text-sm" role="navigation" aria-label="Categorias">
        {[
          { key: "ciencia", label: "Ciência" },
          { key: "politica", label: "Política" },
          { key: "negocios", label: "Negócios" },
          { key: "tecnologia", label: "Tecnologia" },
          { key: "marketing", label: "Marketing" },
        ].map(({ key, label }) => (
          <motion.span
            key={key}
            whileTap={prefersReduced ? {} : { scale: 0.98 }}
            role="button"
            tabIndex={0}
            aria-current={currentCat === key ? "true" : undefined}
            aria-pressed={currentCat === key}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCategoryChange(key)}
            className={`inline-flex w-fit items-center gap-2 rounded-lg px-1 py-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 ${
              currentCat === key
                ? "text-blue-800 underline underline-offset-2"
                : "text-blue-700 hover:underline underline-offset-2"
            }`}
            onClick={() => handleCategoryChange(key)}
          >
            {label}
          </motion.span>
        ))}
      </div>
    </aside>
  );
};

export default SideMenu;
