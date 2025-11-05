import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const AboutPage = () => {
  const reduce = useReducedMotion();

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 10, filter: reduce ? "none" : "blur(2px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: { type: "spring", stiffness: 260, damping: 24 },
    },
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Sobre – AX | Blog de Notícias",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "/" },
        { "@type": "ListItem", position: 2, name: "Sobre" },
      ],
    },
    mainEntity: {
      "@type": "Organization",
      name: "AX",
      url: typeof window !== "undefined" ? window.location.origin : "",
      sameAs: [],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quem escreve no blog da AX?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Conteúdo produzido por um time editorial próprio e colaboradores convidados, seguindo uma política de revisão dupla e checagem de fatos.",
        },
      },
      {
        "@type": "Question",
        name: "Como selecionamos as pautas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Monitoramos fontes confiáveis, dados públicos e tendências de pesquisa. A prioridade é dada a temas úteis, atuais e de interesse público.",
        },
      },
      {
        "@type": "Question",
        name: "Posso sugerir uma matéria?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim. Você pode enviar sugestões pela página de contato ou mencionando-nos nas redes. Avaliamos todas as pautas recebidas.",
        },
      },
      {
        "@type": "Question",
        name: "Como tratamos correções?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Erros identificados são corrigidos com transparência. Em atualizações substanciais, adicionamos uma nota de edição com data.",
        },
      },
    ],
  };

  const fadeUp = reduce
    ? {}
    : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 } };

  return (
    <section aria-label="Sobre o blog AX" className="bg-white text-black overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <nav aria-label="Trilha de navegação" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link
              to="/"
              className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded"
            >
              Início
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-400">•</li>
          <li aria-current="page" className="text-blue-700 font-medium">Sobre</li>
        </ol>
      </nav>

      <main id="conteudo" className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero */}
        <motion.header
          {...fadeUp}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10 md:mb-12 rounded-3xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm"
        >
          {/* gradient underlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-8 mx-auto h-24 w-[92%] rounded-3xl blur-3xl"
            style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(37,99,235,0.12) 0%, rgba(34,211,238,0.12) 55%, transparent 80%)" }}
          />

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-900 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            Sobre o AX
          </div>

          <h1 className="mt-3 max-w-4xl text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Quem somos e como
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              produzimos notícias
            </span>
          </h1>

          <p className="mt-3 max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600">
            O AX é um blog de notícias orientado por dados. Cobrimos ciência, política, negócios, tecnologia e marketing
            com foco em precisão, contexto e acessibilidade. Nosso objetivo é oferecer leitura rápida, moderna e inclusiva.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/contato"
              className="inline-flex items-center justify-center rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:scale-[0.98]"
              style={{ background: "linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)" }}
            >
              Fale com a redação
            </Link>
            <Link
              to="/sobre#politica-editorial"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
            >
              Ver diretrizes editoriais
            </Link>
          </div>
        </motion.header>

        {/* KPIs */}
        <section className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {[
            { k: "+1200", l: "matérias publicadas" },
            { k: "5", l: "editorias ativas" },
            { k: "24/7", l: "monitoramento de fontes" },
            { k: "2 camadas", l: "revisão editorial" },
          ].map((m) => (
            <motion.div
              key={m.l}
              initial={reduce ? {} : { opacity: 0, y: 8 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
            >
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-600 to-cyan-400" />
              <div className="text-2xl md:text-3xl font-semibold text-slate-900">{m.k}</div>
              <div className="text-sm text-slate-600">{m.l}</div>
            </motion.div>
          ))}
        </section>

        {/* Missão & Editorial */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.article
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">Nossa missão</h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Tornar a informação de qualidade acessível para todos — sem jargões desnecessários, sem ruído e com checagem rigorosa.
              Priorizamos fontes oficiais, estudos revisados por pares e relatórios de órgãos confiáveis.
            </p>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Acreditamos que boas decisões começam com bons dados e um jornalismo responsável. Em cada matéria respondemos:
              <span className="ml-1 font-medium text-slate-900">o que aconteceu, por que importa e o que observar a seguir.</span>
            </p>
          </motion.article>

          <motion.aside
            id="politica-editorial"
            aria-label="Política editorial"
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">Política editorial</h2>
            <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-2">
              <li>Independência: não aceitamos interferência em pauta/conclusão.</li>
              <li>Transparência: correções recebem nota de edição e data.</li>
              <li>Conflitos de interesse são divulgados quando existirem.</li>
              <li>Acessibilidade e linguagem clara como padrão de estilo.</li>
            </ul>
          </motion.aside>
        </section>

        {/* Como trabalhamos */}
        <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">Como trabalhamos</h2>
          <motion.ul
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {[
              {
                t: "Apuração",
                d: "Coletamos dados de bases públicas, fontes oficiais e especialistas; priorizamos documentos originais.",
              },
              {
                t: "Checagem",
                d: "Mínimo de duas fontes independentes; números verificados com metodologia descrita no texto.",
              },
              {
                t: "Revisão",
                d: "Toda matéria passa por revisão de estilo e revisão técnica quando o tema exige.",
              },
              {
                t: "Atualizações",
                d: "Indicamos o horário da última atualização e mantemos histórico de grandes mudanças.",
              },
              {
                t: "Ilustrações",
                d: "Gráficos e imagens têm textos alternativos descritivos e evitam sensacionalismo.",
              },
              {
                t: "Privacidade",
                d: "Respeitamos LGPD. Métricas são anonimizadas e coletadas apenas após consentimento.",
              },
            ].map((i) => (
              <motion.li key={i.t} variants={itemVariants} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                <h3 className="font-medium text-slate-900">{i.t}</h3>
                <p className="mt-1 text-sm text-slate-700">{i.d}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* Ligações internas / Categorias e CTA */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">Explore por categoria</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {[
                { to: "/posts?cat=ciencia", label: "Ciência" },
                { to: "/posts?cat=politica", label: "Política" },
                { to: "/posts?cat=negocios", label: "Negócios" },
                { to: "/posts?cat=tecnologia", label: "Tecnologia" },
                { to: "/posts?cat=marketing", label: "Marketing" },
                { to: "/posts", label: "Todas as matérias" },
              ].map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.35 }}
            className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900">Assine a newsletter</h2>
            <p className="mt-2 text-slate-700">
              Receba um resumo diário com os principais destaques. Sem spam — só o essencial.
            </p>
            <form
              className="mt-4 flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="email-news" className="sr-only">
                Seu e-mail
              </label>
              <input
                id="email-news"
                type="email"
                placeholder="Seu e-mail"
                className="w-full sm:flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                required
                autoComplete="email"
              />
              <motion.button
                type="submit"
                whileTap={reduce ? {} : { scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-xl border border-transparent px-5 py-3 text-sm font-medium text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                style={{ background: "linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)" }}
              >
                Assinar newsletter
              </motion.button>
            </form>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">Perguntas frequentes</h2>
          <div className="mt-4 divide-y divide-slate-200">
            {[
              {
                q: "Quem escreve no blog da AX?",
                a: "Nosso time editorial interno com apoio de especialistas convidados. Todo material passa por revisão de estilo e, quando necessário, revisão técnica.",
              },
              {
                q: "Como selecionam as fontes?",
                a: "Preferimos documentos oficiais, artigos revisados por pares, bases públicas e entrevistas com especialistas. Links e referências são fornecidos quando possível.",
              },
              {
                q: "Como faço contato com a redação?",
                a: "Use a página de contato ou nossas redes sociais. Para assuntos de imprensa, utilize o assunto 'Imprensa' no formulário.",
              },
              {
                q: "Posso republicar conteúdos?",
                a: "Consulte os termos de uso. Em geral, trechos curtos com crédito e link são permitidos; reprodução integral requer autorização.",
              },
            ].map((f, i) => (
              <details key={i} className="group py-3">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-slate-900">{f.q}</span>
                  <span className="ml-4 text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <p className="mt-2 text-sm text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </section>
  );
};

export default AboutPage;