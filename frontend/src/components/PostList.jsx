import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
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
  if (!data || !Array.isArray(data.posts)) {
    throw new Error("Resposta inesperada da API");
  }
  return data; // { posts, hasMore, page, total, limit }
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

const PostList = () => {
  const [searchParams] = useSearchParams();
  const prefersReduced = useReducedMotion();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1, signal }) =>
      fetchPosts({ pageParam, searchParams, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage?.hasMore ? pages.length + 1 : undefined,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 30_000,
  });

  if (status === "pending") {
    return (
      <section
        aria-label="Lista de matérias"
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

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

  const allPosts = data?.pages?.flatMap((p) => p.posts) || [];

  const fadeInUp = {
    initial: {
      opacity: 0,
      y: prefersReduced ? 0 : 10,
      filter: prefersReduced ? "none" : "blur(2px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "none",
      transition: { duration: 0.32, ease: "easeOut" },
    },
  };
  const stagger = {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  return (
    <section
      aria-label="Lista de matérias"
      aria-busy={isFetching || isFetchingNextPage}
      className="rounded-2xl border border-slate-200 bg-white p-0 shadow-sm overflow-x-hidden"
    >
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={Boolean(hasNextPage)}
        style={{ overflow: "visible" }}
        className="overflow-visible"
        loader={
          <div
            role="status"
            aria-live="polite"
            className="px-4 py-3 text-sm text-slate-600"
          >
            Carregando mais matérias...
          </div>
        }
        endMessage={
          <p className="px-4 py-3 text-sm text-slate-700">
            <b>Todos os posts foram carregados.</b>
          </p>
        }
      >
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
          <meta itemProp="numberOfItems" content={String(allPosts.length)} />
          {allPosts.map((post) => (
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
      </InfiniteScroll>
    </section>
  );
};

export default PostList;
