import PostListItem from "./PostListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

async function fetchPosts({ pageParam, searchParams, signal }) {
  const params = Object.fromEntries([...searchParams]); // sem console.log
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...params },
    signal,
    timeout: 15000,
    withCredentials: false,
  });
  if (!data || !Array.isArray(data.posts)) throw new Error("Resposta inesperada da API");
  return data;
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
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1, signal }) => fetchPosts({ pageParam, searchParams, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (lastPage?.hasMore ? pages.length + 1 : undefined),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 30_000,
  });

  if (status === "pending")
    return (
      <div role="status" aria-live="polite" className="text-sm text-slate-600 px-4 py-3">
        Carregando...
      </div>
    );

  if (status === "error")
    return (
      <div role="alert" className="text-sm text-red-600 px-4 py-3">
        Não foi possível carregar as matérias. {error?.message || ""}
      </div>
    );

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  const fadeInUp = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 10, filter: prefersReduced ? "none" : "blur(2px)" },
    animate: { opacity: 1, y: 0, filter: "none", transition: { duration: 0.32, ease: "easeOut" } },
  };
  const stagger = { animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

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
          <div role="status" aria-live="polite" className="px-4 py-3 text-sm text-slate-600">
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
