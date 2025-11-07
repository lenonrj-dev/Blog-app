import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, useReducedMotion } from "framer-motion";

// Utilitário: sanitiza título para evitar caracteres que quebrem slug/rota
function sanitizeTitleInput(input) {
  if (!input) return "";
  // Permite letras (com acento), números, espaço e hífen; remove o resto
  const cleaned = input.replace(/[^0-9A-Za-zÀ-ÿ\s-]/g, " ");
  // Normaliza espaços
  return cleaned.replace(/\s+/g, " ").trimStart();
}

export default function PostMenuActions({ post }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const queryClient = useQueryClient();

  // =========================
  // Salvos do usuário (quando logado)
  // =========================
  const {
    isPending: savedLoading,
    isError: savedError,
    data: savedData,
  } = useQuery({
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

  // =========================
  // Mutations: excluir / salvar / destacar
  // =========================
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

  // =========================
  // Edição inline (ADMIN)
  // =========================
  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [category, setCategory] = useState(post?.category || "");
  const [desc, setDesc] = useState(post?.desc || "");

  useEffect(() => {
    // Mantém os campos sincronizados caso o post mude (navegação client-side)
    setTitle(post?.title || "");
    setCategory(post?.category || "");
    setDesc(post?.desc || "");
  }, [post?._id]);

  const clientSlugPreview = title
    ? sanitizeTitleInput(title).toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-")
    : "";

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      // Preferimos PATCH para atualização parcial
      return axios.patch(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (res) => {
      const updated = res?.data || {};
      toast.success("Matéria atualizada!");
      setEditOpen(false);
      // Atualiza cache do post atual
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
      // Se o backend gerou um novo slug, navega para ele (evita 404 e mantém URL correta)
      if (updated?.slug && updated.slug !== post.slug) {
        navigate(`/${updated.slug}`, { replace: true });
      }
    },
    onError: (error) => toast.error(error?.response?.data || "Erro ao atualizar matéria"),
  });

  const handleEditOpen = () => {
    if (!isAdmin) return;
    setTitle(post?.title || "");
    setCategory(post?.category || "");
    setDesc(post?.desc || "");
    setEditOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!isAdmin || updateMutation.isPending) return;

    const cleanTitle = sanitizeTitleInput(title);
    if (!cleanTitle) {
      toast.error("Informe um título válido.");
      return;
    }

    const payload = {
      title: cleanTitle,
      category: category || undefined,
      desc: desc || "",
      // Se quiser forçar slug no cliente, descomente a linha abaixo
      // slug: clientSlugPreview,
    };

    updateMutation.mutate(payload);
  };

  const tapAnim = prefersReduced ? {} : { scale: 0.98 };
  const hoverAnim = prefersReduced ? {} : { y: -1 };

  // Não logado → sem ações
  if (!user) return null;

  return (
    <section
      aria-labelledby="acoes-post"
      aria-busy={
        savedLoading ||
        saveMutation.isPending ||
        featureMutation.isPending ||
        deleteMutation.isPending ||
        updateMutation.isPending
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
          onClick={() => saveMutation.mutate()}
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

      {/* Divider quando houver bloco admin */}
      {isAdmin && <hr className="my-2 border-slate-200" />}

      {/* Admin-only */}
      {isAdmin && (
        <>
          <motion.button
            type="button"
            whileHover={hoverAnim}
            whileTap={tapAnim}
            aria-pressed={post.isFeatured}
            aria-disabled={featureMutation.isPending}
            disabled={featureMutation.isPending}
            onClick={() => featureMutation.mutate()}
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

          {/* EDITAR INLINE (abre modal) */}
          <motion.button
            type="button"
            whileHover={hoverAnim}
            whileTap={tapAnim}
            onClick={handleEditOpen}
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
            onClick={() => deleteMutation.mutate()}
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
                d="M21 2c-1.65 0-3 1.35-3 3v2H8a1 1 0 100 2h1v36c0 1.65 1.35 3 3 3h26c1.65 0 3-1.35 3-3V9h1a1 1 0 100-2h-7V5c0-1.65-1.35-3-3-3h-8zm0 2h8c.55 0 1 .45 1 1v2H20V5c0-.55.45-1 1-1zm-9 5h26v36c0 .55-.45 1-1 1H12c-.55 0-1-.45-1-1V9zm7 5a1 1 0 100 2v24a1 1 0 100-2V14zm6 0a1 1 0 100 2v24a1 1 0 100-2V14zm6 0a1 1 0 100 2v24a1 1 0 100-2V14z"
              />
            </svg>
            <span className="text-slate-900/95">Excluir</span>
            {deleteMutation.isPending && (
              <span className="text-xs text-slate-500">(em andamento)</span>
            )}
          </motion.button>
        </>
      )}

      {/* ===== Modal de edição inline ===== */}
      {isAdmin && editOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            aria-hidden="true"
            onClick={() => setEditOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-editar-titulo"
            initial={prefersReduced ? {} : { opacity: 0, y: 12, scale: 0.98 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-[61] w-full max-w-xl rounded-2xl ring-1 ring-slate-200 bg-white shadow-xl p-4 md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="dialog-editar-titulo" className="text-lg font-semibold text-slate-900">
                Editar matéria (rápido)
              </h3>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                aria-label="Fechar"
                title="Fechar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              {/* Título (sanitizado em tempo real) */}
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-slate-800">
                  Título
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(sanitizeTitleInput(e.target.value))}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = (e.clipboardData || window.clipboardData).getData("text");
                    setTitle(sanitizeTitleInput(text));
                  }}
                  className="mt-1 w-full rounded-xl ring-1 ring-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  placeholder="Título da matéria"
                  autoComplete="off"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">
                  Link previsto: <span className="font-mono">/{clientSlugPreview}</span>
                </p>
              </div>

              {/* Categoria */}
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-slate-800">
                  Categoria
                </label>
                <select
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl ring-1 ring-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                >
                  <option value="">Selecione</option>
                  <option value="ciencia">Ciência</option>
                  <option value="politica">Política</option>
                  <option value="negocios">Negócios</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              {/* Descrição curta */}
              <div>
                <label htmlFor="edit-desc" className="block text-sm font-medium text-slate-800">
                  Descrição curta
                </label>
                <textarea
                  id="edit-desc"
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="mt-1 w-full rounded-2xl ring-1 ring-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  placeholder="Resumo da matéria"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 text-white shadow-sm hover:shadow-md hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? "Salvando…" : "Salvar alterações"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
