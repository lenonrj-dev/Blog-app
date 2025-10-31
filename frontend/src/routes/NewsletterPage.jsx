import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

export default function NewsletterPage() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = useState("");

  const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const name = String(form.get("name") || "").trim();
    const frequency = String(form.get("frequency") || "semanal").trim();
    const notes = String(form.get("notes") || "").trim();
    const topics = form.getAll("topics").map(String);
    const consent = Boolean(form.get("consent"));

    // validação mínima de e-mail
    const emailOk = /\S+@\S+\.\S+/.test(email);
    if (!emailOk || !consent) {
      setStatus("error");
      setMsg("Informe um e-mail válido e aceite os termos de consentimento.");
      return;
    }

    try {
      setStatus("loading");
      setMsg("");

      const payload = { name, email, frequency, topics, notes, consent };
      const url = `${API.replace(/\/$/, "")}/newsletter/subscribe`;

      const { data } = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });

      setStatus("success");
      setMsg(
        data?.message ||
          "Cadastro recebido! Enviamos um e-mail para confirmar sua assinatura (double opt-in)."
      );

      // limpa o formulário, mas mantém feedback
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setMsg(
        err?.response?.data?.message ||
          "Não foi possível assinar agora. Tente novamente em instantes."
      );
    }
  };

  const container = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <main id="conteudo" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 bg-white text-black">
      {/* Breadcrumbs */}
      <nav aria-label="Trilha de navegação" className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-neutral-700">
          <li>
            <Link
              to="/"
              className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded"
            >
              Início
            </Link>
          </li>
          <li aria-hidden="true" className="text-neutral-400">•</li>
          <li aria-current="page" className="text-neutral-900 font-medium">Newsletter</li>
        </ol>
      </nav>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Newsletter — SYN Blog",
            description:
              "Assine a newsletter do SYN Blog e receba curadoria semanal de notícias com análise, contexto e links verificados.",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: typeof window !== "undefined" ? window.location.origin : "" },
                { "@type": "ListItem", position: 2, name: "Newsletter" },
              ],
            },
            potentialAction: {
              "@type": "SubscribeAction",
              target: typeof window !== "undefined" ? window.location.href : "",
              name: "Assinar newsletter do SYN Blog",
            },
          }),
        }}
      />

      {/* Hero */}
      <header className="mb-6 md:mb-10 max-w-3xl">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-neutral-900">
          Assine a newsletter do SYN — notícias essenciais, contexto claro.
        </h1>
        <p className="mt-3 text-neutral-700 leading-relaxed">
          Receba um resumo confiável e direto ao ponto com os principais destaques do Brasil e do mundo. Sem spam,
          apenas o que importa — com links verificados e análise editorial.
        </p>
      </header>

      {/* Grid: Formulário + Benefícios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulário */}
        <motion.section
          {...container}
          aria-labelledby="titulo-assinar"
          className="lg:col-span-2 rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
        >
          <h2 id="titulo-assinar" className="text-xl font-semibold text-neutral-900">Quero receber por e-mail</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Campos marcados com * são obrigatórios.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-1">
              <label htmlFor="nome" className="block text-sm font-medium text-neutral-900">Nome</label>
              <input
                id="nome"
                name="name"
                type="text"
                autoComplete="name"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-neutral-900 placeholder-neutral-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                placeholder="Seu nome (opcional)"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900">E-mail *</label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-neutral-900 placeholder-neutral-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                placeholder="voce@exemplo.com"
              />
            </div>

            <div className="md:col-span-1">
              <label htmlFor="frequencia" className="block text-sm font-medium text-neutral-900">Frequência</label>
              <select
                id="frequencia"
                name="frequency"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                defaultValue="semanal"
              >
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="resumo">Resumo do fim de semana</option>
              </select>
            </div>

            <fieldset className="md:col-span-2">
              <legend className="text-sm font-medium text-neutral-900">Temas de interesse</legend>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  ["ciencia", "Ciência"],
                  ["politica", "Política"],
                  ["negocios", "Negócios"],
                  ["tecnologia", "Tecnologia"],
                  ["marketing", "Marketing"],
                  ["ultimas", "Últimas notícias"],
                ].map(([value, label]) => (
                  <label key={value} className="inline-flex items-center gap-2 text-sm text-neutral-900">
                    <input
                      type="checkbox"
                      name="topics"
                      value={value}
                      className="h-4 w-4 rounded border-slate-300 text-blue-700 focus-visible:ring-blue-600/40"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="md:col-span-2">
              <label htmlFor="observacoes" className="block text-sm font-medium text-neutral-900">Observações</label>
              <textarea
                id="observacoes"
                name="notes"
                rows={3}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-neutral-900 placeholder-neutral-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                placeholder="Conte-nos como podemos personalizar melhor os envios para você (opcional)."
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              <label className="inline-flex items-start gap-3 text-sm text-neutral-900">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus-visible:ring-blue-600/40"
                />
                <span>
                  Concordo em receber e-mails do SYN Blog e entendo que posso cancelar a assinatura a qualquer momento.
                  Li e aceito a <Link to="/privacidade" className="text-blue-700 hover:underline underline-offset-2">Política de Privacidade</Link>.
                </span>
              </label>
              <p id="lgpd-hint" className="text-xs text-neutral-600">
                Em conformidade com a LGPD: coletamos apenas e-mail e preferências para fins de envio. Não vendemos dados.
              </p>
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <motion.button
                type="submit"
                whileTap={reduce ? {} : { scale: 0.98 }}
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-5 py-3.5 text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                aria-describedby="lgpd-hint"
              >
                {status === "loading" ? "Enviando..." : "Assinar newsletter"}
              </motion.button>
              <span className="text-sm text-neutral-600">Sem spam. Cancelamento com um clique.</span>
            </div>

            <div role="status" aria-live="polite" className={`md:col-span-2 text-sm ${status === "error" ? "text-red-600" : "text-green-700"}`}>
              {msg}
            </div>
          </form>
        </motion.section>

        {/* Benefícios / Conteúdo auxiliar */}
        <motion.aside {...container} aria-label="Por que assinar" className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md">
          <h2 className="text-base font-semibold text-neutral-900">Por que a newsletter da SYN é diferente?</h2>
          <ul className="mt-3 space-y-2 text-neutral-800">
            <li>• Curadoria humana com critérios editoriais claros.</li>
            <li>• Contexto e links oficiais para leitura aprofundada.</li>
            <li>• Zero sensacionalismo: foco em precisão e utilidade.</li>
            <li>• Transparência: correções públicas quando necessário.</li>
          </ul>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-neutral-900">O que você vai receber</h3>
            <div className="mt-3 grid grid-cols-1 gap-3">
              {["Resumo diário ou semanal","Análises rápidas do que mudou","Agenda do dia e alertas de última hora","Seleção de leituras recomendadas"].map((t) => (
                <div key={t} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <p className="text-sm text-neutral-800">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-neutral-900">Compromissos editoriais</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Nossas decisões seguem política editorial própria, critérios de relevância pública e checagem de fatos.
              Em caso de erro, publicamos correções de forma visível.
            </p>
          </div>
        </motion.aside>
      </div>

      {/* FAQ */}
      <motion.section {...container} aria-labelledby="faq" className="mt-10 rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md">
        <h2 id="faq" className="text-xl font-semibold text-neutral-900">Perguntas Frequentes</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
            ["Posso cancelar quando quiser?", "Sim. Cada e-mail traz um link de descadastro imediato."],
            ["Com que frequência vocês enviam?", "Oferecemos diária, semanal e resumo do fim de semana — você escolhe."],
            ["Vão compartilhar meu e-mail?", "Não. Usamos apenas para envio da newsletter e métricas agregadas."],
            ["Receberei publicidade?", "Podemos incluir patrocínios sinalizados. Conteúdo editorial é sempre independente."],
          ].map(([q, a]) => (
            <details key={q} className="group rounded-xl border border-slate-200 bg-white p-3">
              <summary className="cursor-pointer select-none text-neutral-900 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded">
                {q}
              </summary>
              <p className="mt-2 text-neutral-700 text-sm">{a}</p>
            </details>
          ))}
        </div>
      </motion.section>

      {/* JSON-LD FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Posso cancelar quando quiser?", acceptedAnswer: { "@type": "Answer", text: "Sim. Cada e-mail traz um link de descadastro imediato." } },
              { "@type": "Question", name: "Com que frequência vocês enviam?", acceptedAnswer: { "@type": "Answer", text: "Oferecemos diária, semanal e resumo do fim de semana — você escolhe." } },
              { "@type": "Question", name: "Vão compartilhar meu e-mail?", acceptedAnswer: { "@type": "Answer", text: "Não. Usamos apenas para envio da newsletter e métricas agregadas." } },
              { "@type": "Question", name: "Receberei publicidade?", acceptedAnswer: { "@type": "Answer", text: "Podemos incluir patrocínios sinalizados. Conteúdo editorial é sempre independente." } },
            ],
          }),
        }}
      />
    </main>
  );
}