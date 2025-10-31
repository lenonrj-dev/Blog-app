import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  return (
    <nav
      aria-label="Categorias principais"
      className="hidden md:flex items-center justify-center gap-8 rounded-3xl xl:rounded-full ring-1 ring-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
    >
      <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
        <Link
          to="/posts"
          className="inline-flex items-center justify-center rounded-xl border border-transparent bg-black no-underline shadow-sm hover:shadow-md hover:bg-black/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm font-medium cursor-pointer !text-white"
          aria-label="Ver todas as matérias"
        >
          Todas as matérias
        </Link>

        <Link
          to="/posts?cat=ciencia"
          className="inline-flex items-center justify-center rounded-xl border ring-1 ring-slate-200 bg-white no-underline hover:bg-slate-50 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm md:text-base font-medium cursor-pointer !text-slate-900"
          aria-label="Ver matérias de Ciência"
        >
          Ciência
        </Link>

        <Link
          to="/posts?cat=politica"
          className="inline-flex items-center justify-center rounded-xl border ring-1 ring-slate-200 bg-white no-underline hover:bg-slate-50 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm md:text-base font-medium cursor-pointer !text-slate-900"
          aria-label="Ver matérias de Política"
        >
          Política
        </Link>

        <Link
          to="/posts?cat=negocios"
          className="inline-flex items-center justify-center rounded-xl border ring-1 ring-slate-200 bg-white no-underline hover:bg-slate-50 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm md:text-base font-medium cursor-pointer !text-slate-900"
          aria-label="Ver matérias de Negócios"
        >
          Negócios
        </Link>

        <Link
          to="/posts?cat=tecnologia"
          className="inline-flex items-center justify-center rounded-xl border ring-1 ring-slate-200 bg-white no-underline hover:bg-slate-50 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm md:text-base font-medium cursor-pointer !text-slate-900"
          aria-label="Ver matérias de Tecnologia"
        >
          Tecnologia
        </Link>

        <Link
          to="/posts?cat=marketing"
          className="inline-flex items-center justify-center rounded-xl border ring-1 ring-slate-200 bg-white no-underline hover:bg-slate-50 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm md:text-base font-medium cursor-pointer !text-slate-900"
          aria-label="Ver matérias de Marketing"
        >
          Marketing
        </Link>
      </div>

      <span className="text-xl font-medium select-none text-slate-300" aria-hidden="true">
        |
      </span>

      <div className="w-full max-w-sm">
        <label htmlFor="busca-principal" className="sr-only">
          Buscar matérias
        </label>
        <Search id="busca-principal" />
      </div>
    </nav>
  );
};

export default MainCategories;