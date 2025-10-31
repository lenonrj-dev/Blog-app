import { Link } from "react-router-dom";
import Image from "./Image";
import { format } from "timeago.js";
import { motion, useReducedMotion } from "framer-motion";

const PostListItem = ({ post }) => {
  const prefersReduced = useReducedMotion();

  const fadeInUp = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 10, filter: prefersReduced ? "none" : "blur(2px)" },
    animate: { opacity: 1, y: 0, filter: "none", transition: { duration: 0.32, ease: "easeOut" } },
  };

  const hover3D = prefersReduced
    ? {}
    : { scale: 1.01, rotateX: 2, rotateY: -2, transition: { type: "spring", stiffness: 180, damping: 18, mass: 0.6 } };

  const createdISO = post?.createdAt ? new Date(post.createdAt).toISOString() : undefined;

  return (
    <motion.article
      itemScope
      itemType="https://schema.org/NewsArticle"
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={hover3D}
      style={{ transformPerspective: 900, willChange: "transform", backfaceVisibility: "hidden" }}
      className="flex flex-col xl:flex-row gap-8 rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300"
      aria-label={`Matéria: ${post?.title || ""}`}
    >
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3">
          <Image
            src={post.img}
            alt={post.title || "Imagem da matéria"}
            className="rounded-2xl object-cover w-full"
            w="735"
            loading="lazy"
            decoding="async"
            itemProp="image"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 xl:w-2/3">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900/95">
          <Link
            to={`/${post.slug}`}
            className="no-underline hover:underline underline-offset-2 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded cursor-pointer"
            aria-label={`Ler matéria: ${post?.title || ""}`}
            itemProp="headline"
          >
            {post.title}
          </Link>
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-slate-500 text-sm">
          <span className="sr-only">Autor</span>
          <span>por</span>
          <Link
            className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 cursor-pointer"
            to={`/posts?author=${post.user.username}`}
            itemProp="author"
          >
            {post.user.username}
          </Link>
          <span className="sr-only">Categoria</span>
          <span>em</span>
          <Link className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 cursor-pointer" itemProp="articleSection">
            {post.category}
          </Link>
          {createdISO && (
            <time dateTime={createdISO} className="text-slate-500" itemProp="datePublished">
              {format(post.createdAt)}
            </time>
          )}
        </div>

        <p className="leading-relaxed text-slate-900/95" itemProp="description">
          {post.desc}
        </p>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Link
            to={`/${post.slug}`}
            className="inline-flex items-center gap-2 text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-blue-600/40 active:opacity-90 cursor-pointer text-sm"
            aria-label={`Ler matéria completa: ${post?.title || ""}`}
          >
            Ler matéria
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
};

export default PostListItem;
