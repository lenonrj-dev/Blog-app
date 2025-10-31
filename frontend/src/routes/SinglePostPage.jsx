import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import DOMPurify from "dompurify";
import { motion, useReducedMotion } from "framer-motion";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  const prefersReduced = useReducedMotion();

  if (isPending) return "Carregando...";
  if (error) return "Algo deu errado! " + error.message;
  if (!data) return "Matéria não encontrada!";

  const safeHtml = DOMPurify.sanitize(data.content || "");

  const createdISO = data?.createdAt ? new Date(data.createdAt).toISOString() : undefined;
  const createdHuman = data?.createdAt
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date(data.createdAt))
    : undefined;

  const cardHover = prefersReduced
    ? {}
    : { scale: 1.01, rotateX: 2, rotateY: -2, transition: { type: "spring", stiffness: 180, damping: 18 } };

  const hasSchema = Boolean(data?.title && data?.createdAt);

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
      data?.category
        ? {
            "@type": "ListItem",
            position: 2,
            name: data.category,
            item:
              typeof window !== "undefined"
                ? window.location.origin + `/posts?cat=${encodeURIComponent(data.category)}`
                : `/posts?cat=${encodeURIComponent(data.category)}`,
          }
        : undefined,
      {
        "@type": "ListItem",
        position: data?.category ? 3 : 2,
        name: data?.title || "Matéria",
        item: typeof window !== "undefined" ? window.location.href : `/${slug}`,
      },
    ].filter(Boolean),
  };

  const faqLd = Array.isArray(data?.faq) && data.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faq.slice(0, 6).map((q) => ({
          "@type": "Question",
          name: q?.question,
          acceptedAnswer: { "@type": "Answer", text: q?.answer },
        })),
      }
    : null;

  return (
    <main
      id="conteudo"
      className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col gap-8 bg-white text-black"
      aria-label="Página da matéria"
    >
      {hasSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: data.title,
              datePublished: createdISO,
              dateModified: createdISO,
              author: data?.user?.username ? { "@type": "Person", name: data.user.username } : undefined,
              image: data?.img ? [data.img] : undefined,
              mainEntityOfPage: { "@type": "WebPage", "@id": (typeof window !== "undefined" && window.location?.href) || "" },
            }),
          }}
        />
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <nav aria-label="Trilha de navegação" className="flex items-center gap-2 text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              to="/"
              className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
            >
              Início
            </Link>
          </li>
          {data.category && (
            <>
              <li aria-hidden="true" className="text-slate-400">•</li>
              <li>
                <Link
                  to={`/posts?cat=${data.category}`}
                  className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
                >
                  {data.category}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true" className="text-slate-400">•</li>
          <li aria-current="page" className="text-blue-700 font-medium truncate max-w-[50vw]">
            {data.title}
          </li>
        </ol>
      </nav>

      <div className="flex gap-8">
        <motion.header
          initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="lg:w-3/5 flex flex-col gap-4 md:gap-6"
        >
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight text-slate-900/95">
            {data.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-slate-500 text-sm">
            <span>por</span>
            {data.user?.username ? (
              <Link
                to={`/posts?author=${data.user.username}`}
                className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
              >
                {data.user.username}
              </Link>
            ) : (
              <span>—</span>
            )}
            <span>em</span>
            <Link className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer">
              {data.category}
            </Link>
            {createdISO && (
              <time dateTime={createdISO} title={createdHuman} className="text-slate-500">
                {format(data.createdAt)}
              </time>
            )}
          </div>

          {data.desc && <p className="text-slate-700 font-medium leading-relaxed">{data.desc}</p>}
        </motion.header>

        {data.img && (
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            whileHover={cardHover}
            viewport={{ once: true, amount: 0.2 }}
            className="hidden lg:block w-2/5 rounded-2xl ring-1 ring-slate-200 p-2 shadow-sm hover:shadow-md transition-all duration-300 will-change-transform"
            style={{ transformPerspective: 900, backfaceVisibility: "hidden" }}
          >
            <Image
              src={data.img}
              alt={data.title || "Imagem da matéria"}
              w="600"
              className="rounded-xl object-cover w-full"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-12 justify-between">
        <motion.article
          itemScope
          itemType="https://schema.org/NewsArticle"
          initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="lg:text-lg flex flex-col gap-6 text-justify rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
        >
          {safeHtml ? (
            <div itemProp="articleBody" className="prose prose-neutral max-w-none prose-p:leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
            </div>
          ) : (
            <p className="text-slate-600">Sem conteúdo.</p>
          )}

          {Array.isArray(data?.tags) && data.tags.length > 0 && (
            <section aria-label="Tags" className="mt-2">
              <h2 className="text-sm font-medium text-slate-900/95 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/posts?search=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900 no-underline shadow-sm hover:shadow-md hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-3 py-1 text-xs font-medium"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {Array.isArray(data?.faq) && data.faq.length > 0 && (
            <section aria-label="Perguntas frequentes" className="mt-4">
              <h2 className="text-lg font-semibold text-slate-900/95 mb-2">Perguntas frequentes</h2>
              <div className="divide-y divide-slate-200 ring-1 ring-slate-200 rounded-2xl overflow-hidden">
                {data.faq.slice(0, 6).map((qa, idx) => (
                  <details key={idx} className="group open:bg-slate-50">
                    <summary className="cursor-pointer list-none px-4 py-3 text-slate-900/95 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40">
                      {qa?.question}
                    </summary>
                    <div className="px-4 pb-4 text-slate-700">{qa?.answer}</div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {Array.isArray(data?.related) && data.related.length > 0 && (
            <section aria-label="Leia também" className="mt-4">
              <h2 className="text-lg font-semibold text-slate-900/95 mb-2">Leia também</h2>
              <ul className="list-disc pl-6 space-y-1">
                {data.related.slice(0, 6).map((r) => (
                  <li key={r?.slug}>
                    <Link
                      to={`/${r?.slug}`}
                      className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                    >
                      {r?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-label="Engajamento" className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/posts?cat=${encodeURIComponent(data.category || "")}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 no-underline shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm font-medium"
              >
                Explorar categoria
              </Link>
              <Link
                to="/newsletter"
                className="inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 text-white no-underline shadow-sm hover:shadow-md hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm font-medium"
              >
                Assinar newsletter
              </Link>
            </div>
          </section>
        </motion.article>

        <aside className="px-4 h-max sticky top-8" aria-label="Menu lateral">
          <h2 className="mb-4 text-sm font-medium text-slate-900/95">Autor</h2>
          <div className="flex flex-col gap-4 rounded-2xl ring-1 ring-slate-200 bg-white p-4 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4">
              {data.user?.img && (
                <Image
                  src={data.user.img}
                  alt={`Avatar de ${data.user?.username || "autor"}`}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200"
                  w="48"
                  h="48"
                  loading="lazy"
                  decoding="async"
                />
              )}
              {data.user?.username && (
                <Link
                  to={`/posts?author=${data.user.username}`}
                  className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
                >
                  {data.user.username}
                </Link>
              )}
            </div>

            <PostMenuActions post={data} />

            <div className="mt-2">
              <h2 className="mt-6 mb-4 text-sm font-medium text-slate-900/95">Categorias</h2>
              <nav className="flex flex-col gap-2 text-sm" aria-label="Categorias">
                <Link
                  to="/posts"
                  className="text-blue-700 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
                >
                  Todas
                </Link>
                <Link
                  to="/posts?cat=ciencia"
                  className="text-blue-700 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
                >
                  Ciência
                </Link>
                <Link
                  to="/posts?cat=politica"
                  className="text-blue-700 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
                >
                  Política
                </Link>
                <Link
                  to="/posts?cat=negocios"
                  className="text-blue-700 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
                >
                  Negócios
                </Link>
                <Link
                  to="/posts?cat=tecnologia"
                  className="text-blue-700 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
                >
                  Tecnologia
                </Link>
                <Link
                  to="/posts?cat=marketing"
                  className="text-blue-700 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
                >
                  Marketing
                </Link>
              </nav>
            </div>

            <div className="mt-6">
              <h2 className="mb-4 text-sm font-medium text-slate-900/95">Buscar</h2>
              <Search />
            </div>
          </div>
        </aside>
      </div>

      <Comments postId={data._id} />
    </main>
  );
};

export default SinglePostPage;
