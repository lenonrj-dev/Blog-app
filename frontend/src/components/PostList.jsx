import PostListItem from "./PostListItem";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  console.log(searchParamsObj);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReduced = useReducedMotion();

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["posts", searchParams.toString()],
      queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    });

  if (isFetching)
    return (
      <div role="status" aria-live="polite" className="text-sm text-slate-600 px-4 py-3">
        Carregando...
      </div>
    );

  if (error)
    return (
      <div role="status" aria-live="assertive" className="text-sm text-red-600 px-4 py-3">
        Algo deu errado!
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
      className="rounded-2xl border border-slate-200 bg-white p-0 shadow-sm"
    >
      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
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