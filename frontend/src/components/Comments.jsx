import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { motion, useReducedMotion } from "framer-motion";

const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  const payload = res.data;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.comments)) return payload.comments;
  return [];
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const prefersReduced = useReducedMotion();

  const { isPending, isError, data = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    placeholderData: [],
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data || "Erro ao enviar comentário");
    },
  });

  const fadeInUp = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 10, filter: prefersReduced ? "none" : "blur(2px)" },
    animate: { opacity: 1, y: 0, filter: "none", transition: { duration: 0.32, ease: "easeOut" } },
  };
  const stagger = { animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

  return (
    <motion.section
      id="comentarios"
      aria-labelledby="titulo-comentarios"
      aria-describedby="comentarios-descricao"
      aria-busy={isPending}
      initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-6 lg:w-3/5 mb-12 rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md"
    >
      <h2 id="titulo-comentarios" className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
        Comentários
      </h2>
      <p id="comentarios-descricao" className="text-slate-700">
        Participe da conversa com opiniões respeitosas e objetivas. Conteúdos ofensivos podem ser removidos.
      </p>

      <motion.form
        onSubmit={handleSubmit}
        aria-label="Formulário de comentários"
        aria-busy={mutation.isPending}
        initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
        whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="flex items-start md:items-center justify-between gap-4 md:gap-6 w-full"
      >
        <div className="flex-1">
          <label htmlFor="comentario-desc" className="sr-only">
            Escreva um comentário
          </label>
          <textarea
            id="comentario-desc"
            name="desc"
            placeholder="Escreva um comentário..."
            aria-describedby="comentarios-dica"
            className="w-full min-h-28 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm md:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
          />
          <span id="comentarios-dica" className="mt-2 block text-xs text-slate-500">
            Dica: mantenha o respeito e evite links suspeitos.
          </span>
        </div>
        <motion.button
          type="submit"
          whileHover={prefersReduced ? {} : { y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-disabled={mutation.isPending}
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-blue-600 text-white no-underline shadow-sm hover:shadow-md hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3 text-sm font-medium"
        >
          {mutation.isPending ? "Enviando..." : "Enviar"}
        </motion.button>
      </motion.form>

      <div role="status" aria-live="polite" className="text-sm text-slate-500">
        {isPending && "Carregando..."}
        {isError && "Erro ao carregar comentários!"}
      </div>

      {!isPending && !isError && (
        <>
          <motion.ul
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            role="list"
            itemScope
            itemType="https://schema.org/ItemList"
            className="flex flex-col gap-6"
          >
            {mutation.isPending && user && (
              <motion.li variants={fadeInUp} itemProp="itemListElement">
                <Comment
                  comment={{
                    desc: "(Enviando...)",
                    createdAt: new Date(),
                    user: { img: user.imageUrl, username: user.username || "you" },
                  }}
                  postId={postId}
                />
              </motion.li>
            )}

            {data.length === 0 ? (
              <motion.li variants={fadeInUp} className="text-slate-600" itemProp="itemListElement">
                Sem comentários ainda.
              </motion.li>
            ) : (
              data.map((comment) => (
                <motion.li key={comment._id} variants={fadeInUp} itemProp="itemListElement">
                  <Comment comment={comment} postId={postId} />
                </motion.li>
              ))
            )}
          </motion.ul>
        </>
      )}
    </motion.section>
  );

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc")?.trim();

    if (!desc) {
      toast.info("Escreva um comentário.");
      return;
    }

    mutation.mutate({ desc });
    e.target.reset();
  }
};

export default Comments;
