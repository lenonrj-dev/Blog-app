import { useUser, useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, useReducedMotion } from "framer-motion";

const PostMenuActions = ({ post }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const queryClient = useQueryClient();

  // Busca de salvos somente quando logado
  const { isPending: savedLoading, isError: savedError, data: savedData } = useQuery({
    queryKey: ["savedPosts"],
    enabled: !!user,
    queryFn: async () => {
      const token = await getToken();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return Array.isArray(res.data) ? res.data : res.data?.saved || [];
    },
  });

  const isAdmin = user?.publicMetadata?.role === "admin";
  const isSaved = Array.isArray(savedData) && savedData.some((p) => p === post._id);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Matéria excluída com sucesso!");
      navigate("/");
    },
    onError: (error) => toast.error(error?.response?.data || "Erro ao excluir matéria"),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["savedPosts"] }),
    onError: (error) => toast.error(error?.response?.data || "Erro ao salvar matéria"),
  });

  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["post", post.slug] }),
    onError: (error) => toast.error(error?.response?.data || "Erro ao destacar matéria"),
  });

  const handleDelete = () => {
    if (!isAdmin || deleteMutation.isPending) return;
    deleteMutation.mutate();
  };

  const handleFeature = () => {
    if (!isAdmin || featureMutation.isPending) return;
    featureMutation.mutate();
  };

  const handleSave = () => {
    if (!user || saveMutation.isPending) return;
    saveMutation.mutate();
  };

  const handleEdit = () => {
    if (!isAdmin) return;
    navigate(`/write?edit=${post._id}`);
  };

  const tapAnim = prefersReduced ? {} : { scale: 0.98 };
  const hoverAnim = prefersReduced ? {} : { y: -1 };

  // Se não estiver logado, não renderiza ações
  if (!user) return null;

  return (
    <section
      aria-labelledby="acoes-post"
      aria-busy={
        savedLoading ||
        saveMutation.isPending ||
        featureMutation.isPending ||
        deleteMutation.isPending
      }
      className="relative box-border w-full max-w-full overflow-x-clip break-words [overflow-wrap:anywhere] rounded-2xl ring-1 ring-slate-200 bg-white p-4 shadow-sm hover:shadow-md"
    >
      <h2 id="acoes-post" className="mt-1 mb-4 text-sm font-medium tracking-tight text-slate-900/95">
        Ações
      </h2>

      {/* Salvar — visível para qualquer usuário logado */}
      {savedLoading ? (
        <div role="status" aria-live="polite" className="text-sm text-slate-600">
          Carregando...
        </div>
      ) : savedError ? (
        <div role="status" aria-live="assertive" className="text-sm text-red-600">
          Falha ao obter matérias salvas!
        </div>
      ) : (
        <motion.button
          type="button"
          whileHover={hoverAnim}
          whileTap={tapAnim}
          aria-pressed={isSaved}
          aria-disabled={saveMutation.isPending}
          disabled={saveMutation.isPending}
          onClick={handleSave}
          className={`w-full text-left flex items-center gap-3 py-2 px-2 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 transition ${
            saveMutation.isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-50"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20"
            height="20"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z"
              stroke="currentColor"
              strokeWidth="2"
              fill={isSaved ? "currentColor" : "none"}
            />
          </svg>
          <span className="text-slate-900/95">{isSaved ? "Salvo" : "Salvar matéria"}</span>
          {saveMutation.isPending && (
            <span className="text-xs text-slate-500">(em andamento)</span>
          )}
        </motion.button>
      )}

      {isAdmin && <hr className="my-2 border-slate-200" />}

      {isAdmin && (
        <>
          <motion.button
            type="button"
            whileHover={hoverAnim}
            whileTap={tapAnim}
            aria-pressed={post.isFeatured}
            aria-disabled={featureMutation.isPending}
            disabled={featureMutation.isPending}
            onClick={handleFeature}
            className={`mt-1 w-full text-left flex items-center gap-3 py-2 px-2 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 transition ${
              featureMutation.isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="20"
              height="20"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
                stroke="currentColor"
                strokeWidth="2"
                fill={post.isFeatured ? "currentColor" : "none"}
              />
            </svg>
            <span className="text-slate-900/95">{post.isFeatured ? "Destacada" : "Destacar"}</span>
            {featureMutation.isPending && (
              <span className="text-xs text-slate-500">(em andamento)</span>
            )}
          </motion.button>

          <motion.button
            type="button"
            whileHover={hoverAnim}
            whileTap={tapAnim}
            onClick={handleEdit}
            className="mt-1 w-full text-left flex items-center gap-3 py-2 px-2 rounded-xl text-sm font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
            </svg>
            <span className="text-slate-900/95">Editar</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={prefersReduced ? {} : { y: -1 }}
            whileTap={tapAnim}
            aria-disabled={deleteMutation.isPending}
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            className={`mt-1 w-full text-left flex items-center gap-3 py-2 px-2 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 transition ${
              deleteMutation.isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-red-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="20"
              height="20"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                fill="currentColor"
                d="M21 2c-1.65 0-3 1.35-3 3v2H8a1 1 0 100 2h1v36c0 1.65 1.35 3 3 3h26c1.65 0 3-1.35 3-3V9h1a1 1 0 100-2h-7V5c0-1.65-1.35-3-3-3h-8zm0 2h8c.55 0 1 .45 1 1v2H20V5c0-.55.45-1 1-1zm-9 5h26v36c0 .55-.45 1-1 1H12c-.55 0-1-.45-1-1V9zm7 5a1 1 0 100 2v24a1 1 0 100-2V14zm6 0a 1 1 0 100 2v24a1 1 0 100-2V14zm6 0a1 1 0 100 2v24a1 1 0 100-2V14z"
              />
            </svg>
            <span className="text-slate-900/95">Excluir</span>
            {deleteMutation.isPending && (
              <span className="text-xs text-slate-500">(em andamento)</span>
            )}
          </motion.button>
        </>
      )}
    </section>
  );
};

export default PostMenuActions;
