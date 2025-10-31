import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReduced = useReducedMotion();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      if (location.pathname === "/posts") {
        setSearchParams({ ...Object.fromEntries(searchParams), search: query });
      } else {
        navigate(`/posts?search=${query}`);
      }
    }
  };

  const inputId = "campo-busca";
  const hintId = "busca-dica";
  const currentQuery = searchParams.get("search") || "";

  return (
    <motion.div
      role="search"
      aria-label="Buscar matérias"
      initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full bg-white px-3 py-2 rounded-2xl ring-1 ring-slate-200 hover:ring-slate-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-600/40"
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        className="text-slate-500"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>

      <label htmlFor={inputId} className="sr-only">
        Buscar matéria
      </label>
      <input
        id={inputId}
        type="text"
        placeholder="Buscar matéria..."
        defaultValue={currentQuery}
        className="w-full rounded-2xl border-0 bg-transparent px-1 py-1 text-sm md:text-base placeholder-slate-400 text-slate-900/95 focus:outline-none focus:ring-0"
        onKeyDown={handleKeyPress}
        inputMode="search"
        enterKeyHint="search"
        aria-describedby={hintId}
        aria-label="Digite para buscar e pressione Enter"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
      />
      <span id={hintId} className="sr-only">
        Pressione Enter para buscar
      </span>
    </motion.div>
  );
};

export default Search;
