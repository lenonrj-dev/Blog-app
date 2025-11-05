import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { motion, useReducedMotion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

const Homepage = () => {
  const prefersReduced = useReducedMotion();
  const { user, isSignedIn } = useUser();
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  // ===================
  // Cookie Consent (LGPD/GDPR-ready básico)
  // ===================
  const STORAGE_KEY = "syn-consent";
  const [showCookies, setShowCookies] = useState(false);
  const [openPrefs, setOpenPrefs] = useState(false);
  const [prefs, setPrefs] = useState({ necessary: true, analytics: true, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setShowCookies(true);
      } else {
        const saved = JSON.parse(raw);
        // sane defaults + hydration
        setPrefs({ necessary: true, analytics: !!saved.analytics, marketing: !!saved.marketing });
      }
    } catch (e) {
      setShowCookies(true);
    }
  }, []);

  const saveConsent = (values) => {
    const payload = {
      necessary: true,
      analytics: !!values.analytics,
      marketing: !!values.marketing,
      ts: Date.now(),
      version: 1,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
    // evento simples p/ outros módulos ouvirem consentimento
    window.dispatchEvent(new Event("consentchange"));
    setPrefs(payload);
    setShowCookies(false);
    setOpenPrefs(false);
  };

  const acceptAll = () => saveConsent({ analytics: true, marketing: true });
  const rejectNonEssential = () => saveConsent({ analytics: false, marketing: false });
  const savePreferences = () => saveConsent(prefs);

  const breadcrumbLd = useMemo(() => ({
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
  }), []);

  const fadeUp = prefersReduced ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <main
      id="conteudo"
      className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col gap-8"
      aria-label="Página inicial"
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      {/* Breadcrumb */}
      <nav aria-label="Trilha de navegação" className="flex items-center gap-2 text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              to="/"
              className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
            >
              Início
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-400">•</li>
          <li aria-current="page" className="text-blue-700 font-medium">Blog e matérias</li>
        </ol>
      </nav>

      {/* HERO */}
      <motion.header
        {...fadeUp}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center text-center"
      >
        {isAdmin ? (
          <Link
            to="/write"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm ring-1 ring-slate-200/70 backdrop-blur hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            aria-label="Abrir Generator Admin (somente administradores)"
            title="Generator admin"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Generator admin
          </Link>
        ) : (
          <span
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm ring-1 ring-slate-200/70 backdrop-blur select-none pointer-events-none"
            aria-label="Bem-vindo(a)"
            title="Bem-vindo(a)"
            role="status"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Bem-vindo(a)
          </span>
        )}

        <h1 className="mt-3 max-w-4xl text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Seu Blog Nº1{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">como Plataforma de Notícias</span>.
        </h1>

        <p id="intro-desc" className="mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
          Este é o seu espaço para pensar em voz alta, compartilhar o que importa e escrever sem filtros. De uma linha a mil, sua história começa aqui.
        </p>
      </motion.header>

      {/* Categorias e busca */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <MainCategories inlineFilter />
      </motion.div>

      {/* Destaques */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <FeaturedPosts />
      </motion.div>

      {/* Recentes filtráveis */}
      <section aria-labelledby="titulo-recentes" className="mt-2">
        <h2 id="titulo-recentes" className="my-4 text-2xl text-slate-700 font-semibold">Matérias recentes</h2>
        <PostList />

        {/* CTA Ver tudo */}
        <div className="mt-6 flex justify-center">
          <Link
            to={`/posts${typeof window !== "undefined" && window.location.search ? window.location.search : ""}`}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 active:scale-[0.98]"
            style={{ background: "linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)" }}
          >
            Ver tudo
          </Link>
        </div>
      </section>

      {/* Cookie Banner — fixo, acessível e elegante */}
      {showCookies && (
        <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:pb-6">
          <div
            role="dialog"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-desc"
            className="mx-auto max-w-screen-lg rounded-2xl border border-slate-200 bg-white/95 backdrop-blur p-4 sm:p-5 shadow-lg ring-1 ring-slate-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <h2 id="cookie-title" className="text-base font-semibold text-slate-900">Nós usamos cookies 🍪</h2>
                <p id="cookie-desc" className="mt-1 text-sm text-slate-700">
                  Utilizamos cookies necessários para funcionamento do site e, com o seu consentimento, cookies de métricas (analytics) e marketing para melhorar sua experiência.
                  Leia a nossa {" "}
                  <Link to="/privacidade#cookies" className="text-blue-700 underline underline-offset-2 hover:no-underline">Política de Privacidade</Link>{" "}
                  para saber detalhes.
                </p>

                {openPrefs && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                    <fieldset className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-900">
                        <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                        Cookies necessários (sempre ativos)
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-900">
                        <input
                          type="checkbox"
                          checked={!!prefs.analytics}
                          onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        Métricas e desempenho (analytics)
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-900">
                        <input
                          type="checkbox"
                          checked={!!prefs.marketing}
                          onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        Personalização e marketing
                      </label>
                    </fieldset>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:w-[320px] gap-2">
                {!openPrefs && (
                  <button
                    type="button"
                    onClick={() => setOpenPrefs(true)}
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md hover:bg-slate-50 px-4 py-2 text-sm font-medium"
                  >
                    Preferências
                  </button>
                )}
                {openPrefs ? (
                  <button
                    type="button"
                    onClick={savePreferences}
                    className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
                    style={{ background: "linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)" }}
                  >
                    Salvar preferências
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={acceptAll}
                      className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
                      style={{ background: "linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)" }}
                    >
                      Aceitar tudo
                    </button>
                    <button
                      type="button"
                      onClick={rejectNonEssential}
                      className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md hover:bg-slate-50 px-4 py-2 text-sm font-medium"
                    >
                      Recusar não essenciais
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </main>
  );
};

export default Homepage;
