import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import { motion, useReducedMotion } from "framer-motion";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`
  );
  return res.data;
};

const FeaturedPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: () => fetchPost(),
  });

  if (isPending) return "Carregando...";
  if (error) return "Ocorreu um erro! " + error.message;

  const posts = data?.posts || [];
  if (!posts.length) return null;

  const prefersReduced = useReducedMotion();

  const cardHover = prefersReduced
    ? {}
    : {
        scale: 1.01,
        rotateX: 2,
        rotateY: -2,
        transition: { type: "spring", stiffness: 180, damping: 18 },
      };

  const catHref = (cat) => `/posts?cat=${encodeURIComponent(cat || "")}`;

  return (
    <section
      aria-label="Matérias em destaque"
      className="mt-8 flex flex-col lg:flex-row gap-6 md:gap-8 overflow-x-hidden"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="itemListOrder" content="http://schema.org/ItemListOrderAscending" />
      <meta itemProp="numberOfItems" content={String(Math.min(posts.length, 4))} />

      {/* PRIMEIRO CARD */}
      <motion.article
        itemScope
        itemType="https://schema.org/NewsArticle"
        itemProp="itemListElement"
        initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={cardHover}
        whileTap={{ scale: 0.99 }}
        className="w-full lg:w-1/2 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 will-change-transform min-w-0"
        aria-labelledby="feat-title-1"
      >
        {posts[0]?.img && (
          <Image
            src={posts[0].img}
            alt={posts[0].title || "Imagem da matéria em destaque"}
            className="rounded-2xl object-cover w-full max-w-full aspect-[16/9]"
            w="895"
            loading="lazy"
            decoding="async"
            itemProp="image"
          />
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
          <h3 className="font-semibold lg:text-lg text-slate-900/95" aria-hidden>
            01.
          </h3>
          <Link
            to={catHref(posts[0]?.category)}
            className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 rounded cursor-pointer"
            aria-label={`Categoria ${posts[0]?.category || ""}`}
          >
            {posts[0]?.category}
          </Link>
          {posts[0]?.createdAt && (
            <time
              dateTime={new Date(posts[0].createdAt).toISOString()}
              className="text-slate-500"
              itemProp="datePublished"
            >
              {format(posts[0].createdAt)}
            </time>
          )}
        </div>

        <Link
          to={posts[0]?.slug || "/"}
          className="text-xl lg:text-3xl font-semibold lg:font-bold text-slate-900/95 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded cursor-pointer break-words [overflow-wrap:anywhere] hyphens-auto"
          aria-label={`Ler matéria: ${posts[0]?.title || ""}`}
          id="feat-title-1"
          itemProp="headline"
        >
          {posts[0]?.title}
        </Link>
      </motion.article>

      {/* COLUNA DIREITA (2,3,4) */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4 min-w-0">
        {posts[1] && (
          <motion.article
            itemScope
            itemType="https://schema.org/NewsArticle"
            itemProp="itemListElement"
            initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={cardHover}
            whileTap={{ scale: 0.99 }}
            className="lg:h-1/3 flex justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300 will-change-transform min-w-0"
            aria-labelledby="feat-title-2"
          >
            {posts[1]?.img && (
              <div className="w-1/3 aspect-video">
                <Image
                  src={posts[1].img}
                  alt={posts[1].title || "Imagem da matéria"}
                  className="rounded-2xl object-cover w-full h-full max-w-full"
                  w="298"
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                />
              </div>
            )}

            <div className="w-2/3 min-w-0">
              <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base mb-3 text-slate-700">
                <h3 className="font-semibold text-slate-900/95" aria-hidden>
                  02.
                </h3>
                <Link
                  to={catHref(posts[1]?.category)}
                  className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 cursor-pointer"
                  aria-label={`Categoria ${posts[1]?.category || ""}`}
                >
                  {posts[1]?.category}
                </Link>
                {posts[1]?.createdAt && (
                  <time
                    dateTime={new Date(posts[1].createdAt).toISOString()}
                    className="text-slate-500 text-sm"
                    itemProp="datePublished"
                  >
                    {format(posts[1].createdAt)}
                  </time>
                )}
              </div>

              <Link
                to={posts[1]?.slug || "/"}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium text-slate-900/95 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded cursor-pointer break-words [overflow-wrap:anywhere] hyphens-auto"
                aria-label={`Ler matéria: ${posts[1]?.title || ""}`}
                id="feat-title-2"
                itemProp="headline"
              >
                {posts[1]?.title}
              </Link>
            </div>
          </motion.article>
        )}

        {posts[2] && (
          <motion.article
            itemScope
            itemType="https://schema.org/NewsArticle"
            itemProp="itemListElement"
            initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={cardHover}
            whileTap={{ scale: 0.99 }}
            className="lg:h-1/3 flex justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300 will-change-transform min-w-0"
            aria-labelledby="feat-title-3"
          >
            {posts[2]?.img && (
              <div className="w-1/3 aspect-video">
                <Image
                  src={posts[2].img}
                  alt={posts[2].title || "Imagem da matéria"}
                  className="rounded-2xl object-cover w-full h-full max-w-full"
                  w="298"
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                />
              </div>
            )}

            <div className="w-2/3 min-w-0">
              <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base mb-3 text-slate-700">
                <h3 className="font-semibold text-slate-900/95" aria-hidden>
                  03.
                </h3>
                <Link
                  to={catHref(posts[2]?.category)}
                  className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 cursor-pointer"
                  aria-label={`Categoria ${posts[2]?.category || ""}`}
                >
                  {posts[2]?.category}
                </Link>
                {posts[2]?.createdAt && (
                  <time
                    dateTime={new Date(posts[2].createdAt).toISOString()}
                    className="text-slate-500 text-sm"
                    itemProp="datePublished"
                  >
                    {format(posts[2].createdAt)}
                  </time>
                )}
              </div>

              <Link
                to={posts[2]?.slug || "/"}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium text-slate-900/95 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded cursor-pointer break-words [overflow-wrap:anywhere] hyphens-auto"
                aria-label={`Ler matéria: ${posts[2]?.title || ""}`}
                id="feat-title-3"
                itemProp="headline"
              >
                {posts[2]?.title}
              </Link>
            </div>
          </motion.article>
        )}

        {posts[3] && (
          <motion.article
            itemScope
            itemType="https://schema.org/NewsArticle"
            itemProp="itemListElement"
            initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={cardHover}
            whileTap={{ scale: 0.99 }}
            className="lg:h-1/3 flex justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300 will-change-transform min-w-0"
            aria-labelledby="feat-title-4"
          >
            {posts[3]?.img && (
              <div className="w-1/3 aspect-video">
                <Image
                  src={posts[3].img}
                  alt={posts[3].title || "Imagem da matéria"}
                  className="rounded-2xl object-cover w-full h-full max-w-full"
                  w="298"
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                />
              </div>
            )}

            <div className="w-2/3 min-w-0">
              <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base mb-3 text-slate-700">
                <h3 className="font-semibold text-slate-900/95" aria-hidden>
                  04.
                </h3>
                <Link
                  to={catHref(posts[3]?.category)}
                  className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 cursor-pointer"
                  aria-label={`Categoria ${posts[3]?.category || ""}`}
                >
                  {posts[3]?.category}
                </Link>
                {posts[3]?.createdAt && (
                  <time
                    dateTime={new Date(posts[3].createdAt).toISOString()}
                    className="text-slate-500 text-sm"
                    itemProp="datePublished"
                  >
                    {format(posts[3].createdAt)}
                  </time>
                )}
              </div>

              <Link
                to={posts[3]?.slug || "/"}
                className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium text-slate-900/95 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded cursor-pointer break-words [overflow-wrap:anywhere] hyphens-auto"
                aria-label={`Ler matéria: ${posts[3]?.title || ""}`}
                id="feat-title-4"
                itemProp="headline"
              >
                {posts[3]?.title}
              </Link>
            </div>
          </motion.article>
        )}
      </div>
    </section>
  );
};

export default FeaturedPosts;
