import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

/**
 * MainCategories
 * - Mantém busca que redireciona para /posts preservando ?cat
 * - Pills de categoria funcionam inline quando a rota atual usar esse componente na Home
 * - Tema atualizado: gradiente azul → ciano para botões e seleção
 */
const MainCategories = ({ inlineFilter = true }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // estado do campo de busca sincronizado com query ?search
  const initialTerm = searchParams.get("search") || "";
  const [term, setTerm] = useState(initialTerm);
  useEffect(() => setTerm(initialTerm), [initialTerm]);

  // categoria ativa (para estilizar a “pill” selecionada)
  const currentCat = searchParams.get("cat") || "";

  // categorias (mesmas chaves do backend)
  const categories = useMemo(
    () => [
      { to: "/posts", key: "", label: "Todas" },
      { to: "/posts?cat=ciencia", key: "ciencia", label: "Ciência" },
      { to: "/posts?cat=politica", key: "politica", label: "Política" },
      { to: "/posts?cat=negocios", key: "negocios", label: "Negócios" },
      { to: "/posts?cat=tecnologia", key: "tecnologia", label: "Tecnologia" },
      { to: "/posts?cat=marketing", key: "marketing", label: "Marketing" },
    ],
    []
  );

  const onSubmit = (e) => {
    e.preventDefault();
    const q = term.trim();
    const cat = currentCat ? `cat=${encodeURIComponent(currentCat)}&` : "";
    navigate(`/posts?${cat}${q ? `search=${encodeURIComponent(q)}` : ""}`);
  };

  const handleSelectCatInline = (key) => {
    if (!inlineFilter) return;
    const next = new URLSearchParams(searchParams);
    if (key) next.set("cat", key); else next.delete("cat");
    setSearchParams(next, { replace: true });
  };

  return (
    <nav aria-label="Categorias e busca da página inicial" className="w-full">
      {/* Searchbar maior com botão ao lado */}
      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-2xl rounded-2xl ring-1 ring-slate-200 bg-white p-1 shadow-sm"
      >
        <label htmlFor="busca-home" className="sr-only">
          Buscar matérias
        </label>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <input
            id="busca-home"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar matérias"
            className="h-12 w-full rounded-xl border-0 bg-transparent px-4 text-sm md:text-base text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30"
            aria-label="Campo de busca"
          />
          <button
            type="submit"
            className="h-12 min-w-[110px] rounded-xl px-4 text-sm md:text-base font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 active:scale-[0.98]"
            style={{ background: "linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)" }}
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Linha de pills das categorias */}
      <div
        className="mx-auto mr-50 mt-8 flex w-full max-w-2xl flex-wrap items-center gap-2"
        role="navigation"
        aria-label="Categorias"
      >
        {categories.map(({ to, key, label }) => {
          const active = (currentCat || "") === key;
          const isAll = key === "" && currentCat === "";
          const selected = active || isAll;

          const classBase =
            "px-3 py-1.5 rounded-full text-sm transition focus-visible:outline-none focus-visible:ring-2";

          if (inlineFilter) {
            return (
              <button
                key={key || "todas"}
                type="button"
                onClick={() => handleSelectCatInline(key)}
                className={
                  selected
                    ? `${classBase} text-white shadow-sm focus-visible:ring-cyan-500/40`
                    : `${classBase} text-slate-700 ring-1 ring-slate-200 hover:ring-cyan-400 focus-visible:ring-cyan-500/40`
                }
                style={
                  selected
                    ? { background: "linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)" }
                    : undefined
                }
                aria-pressed={selected}
              >
                {label}
              </button>
            );
          }

          // fallback: navegação tradicional
          return (
            <Link
              key={key || "todas"}
              to={to}
              className={
                selected
                  ? `${classBase} text-white shadow-sm focus-visible:ring-cyan-500/40`
                  : `${classBase} text-slate-700 ring-1 ring-slate-200 hover:ring-cyan-400 focus-visible:ring-cyan-500/40`
              }
              style={
                selected
                  ? { background: "linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)" }
                  : undefined
              }
              aria-current={selected ? "true" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MainCategories;
