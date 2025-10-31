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
    name: "Sobre – SYN | Blog de Notícias",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "/" },
        { "@type": "ListItem", position: 2, name: "Sobre" },
      ],
    },
    mainEntity: {
      "@type": "Organization",
      name: "SYN",
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
        name: "Quem escreve no blog da SYN?",
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

  return (
    <section aria-label="Sobre o blog SYN" className="bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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

      <main id="conteudo" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Hero / Título */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">SYN — Blog de Notícias</h1>
          <p className="mt-3 text-slate-700 max-w-3xl">
            O SYN é um blog de notícias orientado por dados, com cobertura ágil e
            análise clara sobre ciência, política, negócios, tecnologia e marketing. Nosso
            compromisso é oferecer informação precisa, contexto acessível e uma
            experiência de leitura rápida, moderna e inclusiva.
          </p>
        </header>

        {/* KPIs / Destaques */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 mb-10">
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
              className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
            >
              <div className="text-2xl md:text-3xl font-semibold">{m.k}</div>
              <div className="text-sm text-slate-600">{m.l}</div>
            </motion.div>
          ))}
        </section>

        {/* Missão & Editorial */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
          <motion.article
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-2 rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Nossa missão</h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Tornar a informação de qualidade acessível para todos — sem jargões
              desnecessários, sem ruído e com checagem rigorosa. Priorizamos fontes
              oficiais, estudos revisados por pares e relatórios de órgãos confiáveis.
            </p>
            <p className="mt-3 text-slate-700 leading-relaxed">
              Acreditamos que boas decisões começam com bons dados e um jornalismo
              responsável. Por isso, cada matéria busca responder rapidamente ao
              “o que aconteceu, por que importa e o que observar a seguir”.
            </p>
          </motion.article>

          <motion.aside
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
            aria-label="Política editorial"
          >
            <h2 className="text-lg font-semibold">Política editorial</h2>
            <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-2">
              <li>Independência: não aceitamos interferência em pauta/conclusão.</li>
              <li>Transparência: correções recebem nota de edição e data.</li>
              <li>Conflitos de interesse são divulgados quando existirem.</li>
              <li>Acessibilidade e linguagem clara como padrão de estilo.</li>
            </ul>
          </motion.aside>
        </section>

        {/* Como trabalhamos */}
        <section className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md mb-10">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Como trabalhamos</h2>
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
              <motion.li
                key={i.t}
                variants={itemVariants}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <h3 className="font-medium">{i.t}</h3>
                <p className="mt-1 text-sm text-slate-700">{i.d}</p>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* Ligações internas / Categorias e CTA */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">Explore por categoria</h2>
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
            initial={reduce ? {} : { opacity: 0, y: 10 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-2 rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">Assine a newsletter</h2>
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
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-black text-white shadow-sm hover:shadow-md hover:bg-black/90 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-5 py-3 text-sm font-medium"
              >
                Assinar newsletter
              </motion.button>
            </form>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Perguntas frequentes</h2>
          <div className="mt-4 divide-y divide-slate-200">
            {[
              {
                q: "Quem escreve no blog da SYN?",
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
                  <span className="font-medium">{f.q}</span>
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
