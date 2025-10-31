import { format } from "timeago.js";
import Image from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";

const Comment = ({ comment, postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const prefersReduced = useReducedMotion();
  const queryClient = useQueryClient();

  // Somente admin pode excluir
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Fallbacks seguros
  const authorName = comment?.user?.username || comment?.username || "Usuário";
  const avatarUrl = comment?.user?.img || comment?.userImage || comment?.user?.imageUrl || null;

  // Datas seguras
  const createdDate = comment?.createdAt ? new Date(comment.createdAt) : null;
  const createdISO = createdDate && !isNaN(+createdDate) ? createdDate.toISOString() : undefined;
  const createdHuman =
    createdDate && !isNaN(+createdDate)
      ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(createdDate)
      : undefined;

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comentário excluído com sucesso");
    },
    onError: (error) => {
      toast.error(error?.response?.data || "Erro ao excluir comentário");
    },
  });

  const handleDelete = () => {
    if (!isAdmin || mutation.isPending) return; // garante apenas admin
    mutation.mutate();
  };

  return (
    <motion.article
      itemScope
      itemType="https://schema.org/Comment"
      initial={prefersReduced ? {} : { opacity: 0, y: 10, filter: "blur(2px)" }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0, filter: "none" }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="group p-4 md:p-6 bg-white rounded-2xl mb-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
      aria-label={`Comentário de ${authorName}`}
    >
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt={`Avatar de ${authorName}`}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
            w="40"
            loading="lazy"
            decoding="async"
            itemProp="image"
          />
        )}

        <span className="font-medium text-slate-900" itemProp="author">
          {authorName}
        </span>

        <span className="text-slate-500" aria-hidden="true">•</span>

        {createdISO ? (
          <time
            dateTime={createdISO}
            title={createdHuman}
            className="text-sm text-slate-500"
            itemProp="dateCreated"
          >
            {format(createdDate)}
          </time>
        ) : (
          <span className="text-sm text-slate-500">agora</span>
        )}

        {isAdmin && (
          <motion.span
            whileHover={prefersReduced ? {} : { y: -1 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            aria-label={`Excluir comentário de ${authorName}`}
            aria-disabled={mutation.isPending}
            className={`ml-auto inline-flex items-center h-9 px-3 rounded-lg text-xs font-medium transition ${
              mutation.isPending
                ? "text-red-300 opacity-60 cursor-not-allowed"
                : "text-red-600 hover:text-red-700 active:opacity-90 cursor-pointer"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30`}
            onClick={handleDelete}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !mutation.isPending) handleDelete();
            }}
          >
            Excluir{mutation.isPending && <span className="ml-1">(em andamento)</span>}
          </motion.span>
        )}
      </div>

      <div className="mt-4">
        <p className="leading-relaxed text-slate-900" itemProp="text">
          {comment?.desc?.trim() ? comment.desc : "[sem texto]"}
        </p>
      </div>
    </motion.article>
  );
};

export default Comment;
