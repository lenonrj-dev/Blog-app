import { useEffect, useState } from "react";
import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const PAGE_SIZE = 10;

async function fetchPosts({ pageParam, searchParams, signal }) {
  const params = Object.fromEntries([...searchParams]);
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: PAGE_SIZE, ...params },
    signal,
    timeout: 15000,
    withCredentials: false,
  });
  if (!data || !Array.isArray(data.posts)) throw new Error("Resposta inesperada da API");
  return data; // { posts, hasMore }
}

function SkeletonCard() {
  return (
    <article className="animate-pulse w-full overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6">
      <div className="h-40 md:h-48 w-full rounded-xl bg-slate-200 mb-4" />
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-2/4" />
    </article>
  );
}

export default function PostList() {
  const [searchParams] = useSearchParams();
  const prefersReduced = useReducedMotion();
  const [page, setPage] = useState(1);

  // Sempre que filtros/busca mudarem, volta pra página 1
  useEffect(() => {
    setPage(1);
  }, [searchParams.toString()]);

  const {
    data,
    error,
    status,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["posts", searchParams.toString(), page],
    queryFn: ({ signal }) => fetchPosts({ pageParam: page, searchParams, signal }),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 30_000,
  });

  const posts = data?.posts ?? [];
  const hasMore = Boolean(data?.hasMore);

  const fadeInUp = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 10, filter: prefersReduced ? "none" : "blur(2px)" },
    animate: { opacity: 1, y: 0, filter: "none", transition: { duration: 0.32, ease: "easeOut" } },
  };
  const stagger = { animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

  // Loading inicial
  if (status === "pending") {
    return (
      <section aria-label="Lista de matérias" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  // Erro
  if (status === "error") {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
        <p className="text-sm text-red-700">
          Não foi possível carregar as matérias. {error?.message || ""}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section
      aria-label="Lista de matérias"
      aria-busy={isFetching || isRefetching}
      className="rounded-2xl border border-slate-200 bg-white p-0 shadow-sm overflow-x-hidden"
    >
      {/* Lista de apenas 10 itens (página atual) */}
      {posts.length === 0 ? (
        <div className="px-4 py-6 text-sm text-slate-600">Nenhuma matéria encontrada.</div>
      ) : (
        <motion.ul
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.15 }}
          role="list"
          itemScope
          itemType="https://schema.org/ItemList"
          className="flex flex-col gap-8"
        >
          <meta itemProp="numberOfItems" content={String(posts.length)} />
          {posts.map((post) => (
            <motion.li
              key={post._id}
              variants={fadeInUp}
              whileHover={prefersReduced ? {} : { y: -1 }}
              itemProp="itemListElement"
              className="rounded-2xl"
            >
              <PostListItem post={post} />
            </motion.li>
          ))}
        </motion.ul>
      )}

      {/* Rodapé de paginação */}
      <div className="flex items-center justify-between gap-3 px-4 py-4 border-t border-slate-200">
        <div className="text-xs text-slate-500">
          Página {page} {isFetching && <span className="ml-1">(carregando...)</span>}
        </div>
        <div className="flex items-center gap-2">
          {/* Botão Voltar (opcional – aparece só se page>1) */}
          {page > 1 && (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" }) || setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-3 py-2 text-xs font-medium"
            >
              Voltar
            </button>
          )}

          {hasMore ? (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" }) || setPage((p) => p + 1)}
              aria-disabled={isFetching}
              disabled={isFetching}
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 text-white shadow-sm hover:shadow-md hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Ver mais
            </button>
          ) : (
            <span className="text-xs text-slate-500">Sem mais resultados</span>
          )}
        </div>
      </div>
    </section>
  );
}
