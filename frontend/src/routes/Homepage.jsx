import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

const Homepage = () => {
  const prefersReduced = useReducedMotion();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

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
        name: "Blog e matérias",
        item: typeof window !== "undefined" ? window.location.origin + "/posts" : "/posts",
      },
    ],
  };

  return (
    <main id="conteudo" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col gap-6" aria-label="Página inicial" itemScope itemType="https://schema.org/CollectionPage">
      <nav aria-label="Trilha de navegação" className="flex items-center gap-2 text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer">
              Início
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-400">•</li>
          <li aria-current="page" className="text-blue-700 font-medium">Blog e matérias</li>
        </ol>
      </nav>

      <motion.header initial={prefersReduced ? {} : { opacity: 0, y: 10 }} whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.32, ease: "easeOut" }} className="flex items-center justify-between">
        <div className="max-w-3xl">
          <h1 className="text-slate-900/95 text-2xl md:text-5xl lg:text-4xl font-bold tracking-tight">Bem-vindo ao seu radar de notícias: em 1 minuto você descobre o que está acontecendo no Brasil e no mundo.</h1>
          <p className="mt-3 text-slate-700" id="intro-desc">Seleção diária com curadoria, categorias claras e performance rápida para você se informar sem perder tempo.</p>
        </div>

        {isAdmin && (
          <Link to="write" className="hidden md:block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded-full cursor-pointer" aria-label="Escrever uma matéria" title="Escrever uma matéria">
            <motion.svg viewBox="0 0 200 200" width="200" height="200" aria-hidden="true" initial={prefersReduced ? {} : { rotate: 0 }} animate={prefersReduced ? {} : { rotate: 360 }} transition={prefersReduced ? {} : { repeat: Infinity, duration: 12, ease: "linear" }} className="text-lg tracking-widest" style={{ willChange: "transform", backfaceVisibility: "hidden" }}>
              <path id="circlePath" fill="none" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
              <text className="fill-current text-slate-800">
                <textPath href="#circlePath" startOffset="0%">Escreva sua matéria •</textPath>
                <textPath href="#circlePath" startOffset="50%">Compartilhe sua ideia •</textPath>
              </text>
            </motion.svg>
            <motion.button type="button" whileTap={prefersReduced ? {} : { scale: 0.96 }} className="absolute inset-0 m-auto w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-sm hover:shadow active:translate-y-px transition ring-1 ring-slate-200" aria-hidden="true" tabIndex={-1}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="6" y1="18" x2="18" y2="6" />
                <polyline points="9 6 18 6 18 15" />
              </svg>
            </motion.button>
          </Link>
        )}
      </motion.header>

      <motion.div initial={prefersReduced ? {} : { opacity: 0, y: 8 }} whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.28, ease: "easeOut" }}>
        <MainCategories />
      </motion.div>

      <motion.div initial={prefersReduced ? {} : { opacity: 0, y: 10 }} whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.32, ease: "easeOut" }}>
        <FeaturedPosts />
      </motion.div>

      <section aria-labelledby="titulo-recentes" className="mt-2">
        <h2 id="titulo-recentes" className="my-4 text-2xl text-slate-700 font-semibold">Matérias recentes</h2>
        <PostList />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </main>
  );
};

export default Homepage;