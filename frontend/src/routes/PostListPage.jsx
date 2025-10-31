import { useState } from "react";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import { motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

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

  return (
    <section aria-labelledby="titulo-lista-posts" className="bg-white text-black">
      <motion.h1
        id="titulo-lista-posts"
        initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight"
      >
        {pageTitle}
      </motion.h1>

      <motion.button
        type="button"
        whileTap={prefersReduced ? {} : { scale: 0.98 }}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="menu-lateral"
        className="md:hidden inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition border border-black/10 bg-black text-white hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/30 active:translate-y-px cursor-pointer mb-4"
      >
        {open ? "Fechar" : "Filtrar ou buscar"}
      </motion.button>

      <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0 w-full">
          <PostList />
        </div>

        <motion.div
          id="menu-lateral"
          initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.3 }}
          className={`${open ? "block" : "hidden"} md:block md:flex-none w-full md:w-[280px] lg:w-[320px] xl:w-[340px]`}
        >
          <SideMenu />
        </motion.div>
      </div>
    </section>
  );
};

export default PostListPage;
