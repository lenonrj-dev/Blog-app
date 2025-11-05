import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import { motion, useReducedMotion } from "framer-motion";

const CATEGORY_LABELS = {
  ciencia: "Ciência",
  politica: "Política",
  negocios: "Negócios",
  tecnologia: "Tecnologia",
  marketing: "Marketing",
  todos: "Todas as matérias",
};

const getPageTitle = (cat, search) => {
  if (cat && CATEGORY_LABELS[cat]) return CATEGORY_LABELS[cat];
  if (search) return `Resultados para “${search}”`;
  return "Todas as matérias";
};

const PostListPage = () => {
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const [searchParams] = useSearchParams();

  const currentCat = (searchParams.get("cat") || "").toLowerCase();
  const currentSearch = searchParams.get("search") || "";
  const pageTitle = getPageTitle(currentCat, currentSearch);

  const fadeIn = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 8 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: typeof window !== "undefined" ? window.location.origin + "/" : "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Matérias",
        item: typeof window !== "undefined" ? window.location.origin + "/posts" : "/posts",
      },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "http://schema.org/ItemListOrderDescending",
    },
  };

  return (
    <section aria-labelledby="titulo-lista-posts" className="bg-white text-black overflow-x-hidden">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav aria-label="Trilha de navegação" className="mb-4 text-sm">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                to="/"
                className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 rounded"
              >
                Início
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">•</li>
            <li aria-current="page" className="text-blue-700 font-medium">Matérias</li>
          </ol>
        </nav>

        {/* Título */}
        <motion.h1
          id="titulo-lista-posts"
          {...fadeIn}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight break-words [overflow-wrap:anywhere] hyphens-auto"
        >
          <span className="bg-[linear-gradient(90deg,#2563eb_0%,#06b6d4_100%)] bg-clip-text text-transparent">
            {pageTitle}
          </span>
        </motion.h1>

        {/* Toggle filtro (mobile) */}
        <motion.button
          type="button"
          whileTap={prefersReduced ? {} : { scale: 0.98 }}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="menu-lateral"
          className="md:hidden inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition border border-slate-200 bg-[linear-gradient(90deg,#2563eb_0%,#06b6d4_100%)] text-white hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 active:translate-y-px cursor-pointer mb-4"
        >
          {open ? "Fechar" : "Filtrar ou buscar"}
        </motion.button>

        {/* Layout */}
        <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          {/* Conteúdo principal */}
          <div className="min-w-0 w-full">
            <PostList />
          </div>

          {/* Lateral */}
          <motion.aside
            id="menu-lateral"
            aria-label="Filtros e busca"
            {...fadeIn}
            transition={{ duration: 0.3 }}
            className={`${open ? "block" : "hidden"} md:block md:flex-none w-full md:w-[280px] lg:w-[320px] xl:w-[340px] md:sticky md:top-24`}
          >
            <SideMenu />
          </motion.aside>
        </div>

        {/* CTA final para ver tudo quando houver filtro/pesquisa ativa (opcional) */}
        {(currentCat || currentSearch) && (
          <div className="mt-8">
            <Link
              to="/posts"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 no-underline shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 px-4 py-2 text-sm font-medium"
            >
              Ver tudo
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PostListPage;
