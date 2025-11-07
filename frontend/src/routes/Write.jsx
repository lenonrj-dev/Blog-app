import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import { motion, useReducedMotion } from "framer-motion";

// ================================
// Utilidades de sanitização
// ================================
// Conjunto de caracteres PERIGOSOS para path/URL que vamos BLOQUEAR no título
// Inclui separadores de caminho, querystring, fragmentos e símbolos comuns que podem confundir roteamento
const DISALLOWED_REGEX = /[\/\\\?\#\%\&\+\;\:\=\@\[\]\{\}\(\)\*'"<>\|\^~`,.!]/g; // eslint-disable-line no-useless-escape

// Mantemos letras (inclui acentos latinos), números, espaço e hífen
// Qualquer outro caractere vira espaço e depois colapsamos
const ALLOWED_REGEX = /[^0-9A-Za-zÀ-ÖØ-öø-ÿ \-]/g;

function sanitizeTitleForPath(input) {
  if (!input) return "";
  // 1) Substitui explicitamente os perigosos por espaço (garante remoção de / ? # etc.)
  let s = input.replace(DISALLOWED_REGEX, " ");
  // 2) Remove qualquer coisa fora do conjunto seguro (mantém letras acentuadas, dígitos, espaço, hífen)
  s = s.replace(ALLOWED_REGEX, " ");
  // 3) Colapsa espaços e trim
  s = s.replace(/\s+/g, " ").trim();
  // 4) Evita nomes especiais de path (., ..)
  if (s === "." || s === "..") s = "";
  return s;
}

// Evita digitação direta de caracteres proibidos (melhora UX no mobile)
function isDisallowedKey(key) {
  // Usa a mesma lista conceitual do DISALLOWED_REGEX (apenas atalho para eventos de teclado)
  return /[\\/\?\#\%\&\+\;\:\=\@\[\]\{\}\(\)\*'"<>\|\^~`,.!]/.test(key);
}

const Write = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [removedCount, setRemovedCount] = useState(0);
  const prefersReduced = useReducedMotion();

  const navigate = useNavigate();
  const { getToken } = useAuth();

  // ✅ Gate de acesso: só ADMIN pode permanecer nesta página
  useEffect(() => {
    if (!isLoaded) return; // aguarda Clerk

    if (!isSignedIn) {
      navigate("/login", { replace: true });
      return;
    }

    if (!isAdmin) {
      toast.error("Acesso restrito — apenas administradores.");
      navigate("/", { replace: true });
    }
  }, [isLoaded, isSignedIn, isAdmin, navigate]);

  // Insere mídia no editor ao terminar upload
  useEffect(() => {
    if (img) setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    if (video) setValue((prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`);
  }, [video]);

  // Título "seguro" derivado (mostrado como placeholder de slug mental)
  const safeTitlePreview = useMemo(() => sanitizeTitleForPath(title), [title]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (res) => {
      toast.success("Matéria criada com sucesso!");
      navigate(`/${res.data.slug}`);
    },
    onError: (err) => {
      toast.error(err?.response?.data || "Erro ao criar matéria");
    },
  });

  if (!isLoaded) {
    return (
      <div role="status" aria-live="polite" className="text-sm text-slate-600 p-6">
        Carregando…
      </div>
    );
  }
  if (!isSignedIn) {
    return (
      <div role="status" aria-live="polite" className="text-sm text-slate-800 p-6">
        Redirecionando para o login…
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div role="status" aria-live="assertive" className="text-sm text-slate-800 p-6">
        Redirecionando…
      </div>
    );
  }

  // ================================
  // Handlers de Título (bloqueio total de caracteres perigosos)
  // ================================
  const handleTitleChange = (e) => {
    const incoming = e.target.value || "";
    const beforeLen = incoming.length;
    const sanitized = sanitizeTitleForPath(incoming);
    const afterLen = sanitized.length;
    const removed = Math.max(0, beforeLen - afterLen);
    setRemovedCount((prev) => (removed > 0 ? prev + removed : prev));
    setTitle(sanitized);
  };

  const handleTitleKeyDown = (e) => {
    // Bloqueia imediatamente teclas perigosas (inclui '/')
    if (isDisallowedKey(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTitlePaste = (e) => {
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const sanitized = sanitizeTitleForPath(text);
    e.preventDefault();
    // Insere o texto já sanitizado
    const target = e.target;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const next = (title.slice(0, start) + sanitized + title.slice(end)).slice(0, 180);
    setTitle(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const titleSafe = sanitizeTitleForPath(title);
    if (!titleSafe) {
      toast.error("Informe um título válido (sem caracteres especiais proibidos).");
      return;
    }

    const data = {
      img: cover.filePath || "",
      title: titleSafe, // ✅ envia TÍTULO já sanitizado (evita gerar slug ruim no backend)
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    mutation.mutate(data);
  };

  const isUploading = progress > 0 && progress < 100;
  const tapAnim = prefersReduced ? {} : { scale: 0.98 };
  const riseAnim = prefersReduced ? {} : { opacity: 1, y: 0 };
  const riseInitial = prefersReduced ? {} : { opacity: 0, y: 8 };

  return (
    <main
      id="conteudo"
      aria-labelledby="titulo-criar-materia"
      className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col gap-6 bg-white text-slate-900"
    >
      <h1 id="titulo-criar-materia" className="text-2xl md:text-4xl font-bold tracking-tight">
        Criar nova matéria
      </h1>

      <motion.form
        noValidate
        onSubmit={handleSubmit}
        initial={riseInitial}
        whileInView={riseAnim}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        aria-busy={mutation.isPending || isUploading}
        className="flex flex-col gap-6 flex-1 mb-6"
      >
        <section aria-label="Imagem de capa" className="flex flex-col gap-3">
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 no-underline shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm font-medium"
              aria-label="Adicionar imagem de capa"
              title="Adicionar imagem de capa"
            >
              Adicionar imagem de capa
            </button>
          </Upload>
          {cover?.url && (
            <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <img
                src={cover.url}
                alt="Prévia da imagem de capa"
                loading="lazy"
                decoding="async"
                className="w-full h-52 md:h-64 object-cover"
              />
            </div>
          )}
        </section>

        {/* TÍTULO com BLOQUEIO de caracteres perigosos */}
        <div>
          <label htmlFor="titulo" className="sr-only">
            Título da matéria
          </label>
          <input
            id="titulo"
            className="w-full text-2xl md:text-4xl font-semibold bg-transparent rounded-xl px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
            type="text"
            placeholder="Título da matéria (será usado no link)"
            name="title-input"
            aria-label="Título da matéria"
            autoComplete="off"
            inputMode="text"
            maxLength={180}
            // pattern extra (bloqueia no submit caso browser suporte)
            pattern="[0-9A-Za-zÀ-ÖØ-öø-ÿ \-]+"
            title="Use apenas letras (com acentos), números, espaços e hífen."
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            onPaste={handleTitlePaste}
          />
          <div className="mt-1 text-xs text-slate-500" aria-live="polite">
            Link seguro prévia: <span className="font-medium">{safeTitlePreview || "(vazio)"}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="categoria" className="text-sm text-slate-800">
            Escolha uma categoria:
          </label>
          <select
            name="category"
            id="categoria"
            className="rounded-xl ring-1 ring-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/40"
            aria-label="Categoria"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="ciencia">Ciência</option>
            <option value="politica">Política</option>
            <option value="negocios">Negócios</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label htmlFor="descricao" className="sr-only">
            Descrição curta
          </label>
          <textarea
            id="descricao"
            className="w-full rounded-2xl ring-1 ring-slate-200 bg-white px-4 py-3 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
            name="desc"
            placeholder="Descrição curta"
            aria-label="Descrição curta"
            maxLength={320}
          />
          {removedCount > 0 && (
            <p className="mt-1 text-xs text-amber-600">
              {removedCount} caractere(s) especial(is) foram removidos do título para manter o link seguro.
            </p>
          )}
        </div>

        <section aria-label="Editor de conteúdo" className="flex flex-1">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              <span
                role="img"
                aria-label="Inserir imagem no conteúdo"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md hover:bg-slate-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                title="Inserir imagem"
              >
                🌆
              </span>
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              <span
                role="img"
                aria-label="Inserir vídeo no conteúdo"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-slate-200 bg-white shadow-sm hover:shadow-md hover:bg-slate-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
                title="Inserir vídeo"
              >
                ▶️
              </span>
            </Upload>
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm">
            <ReactQuill
              theme="snow"
              className="flex-1 rounded-2xl"
              value={value}
              onChange={setValue}
              readOnly={isUploading}
              placeholder="Escreva o conteúdo da matéria..."
            />
          </div>
        </section>

        <motion.button
          type="submit"
          whileTap={tapAnim}
          aria-disabled={mutation.isPending || isUploading}
          disabled={mutation.isPending || isUploading}
          className="inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 text-white no-underline shadow-sm hover:shadow-md hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-base font-medium w-40 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Enviando..." : "Publicar"}
        </motion.button>

        <div className="space-y-2" aria-live="polite" aria-atomic="true" id="progresso-upload">
          <div className="text-sm text-slate-600">Progresso: {progress}%</div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full bg-blue-600 transition-[width] duration-300"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      </motion.form>
    </main>
  );
};

export default Write;
