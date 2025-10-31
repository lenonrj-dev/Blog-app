import { useState } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { motion, useReducedMotion } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 supports-[backdrop-filter]:backdrop-blur-md">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow focus:outline-none focus:ring-2 focus:ring-slate-900/20"
      >
        Pular para o conteúdo
      </a>

      <nav
        aria-label="Navegação principal"
        className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between text-black after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/0 after:via-white/60 after:to-white"
      >
        <motion.div whileHover={prefersReduced ? {} : { scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-3 md:gap-4 text-2xl font-bold text-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 rounded-lg"
            aria-label="Ir para a página inicial"
          >
            <Image src="logo.png" alt="Logo SYN" w={32} h={32} />
            <span className="leading-none">SYN</span>
          </Link>
        </motion.div>

        <div className="md:hidden">
          <div
            role="button"
            tabIndex={0}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-controls="menu-mobile"
            aria-expanded={open}
            aria-haspopup="menu"
            className="cursor-pointer text-4xl p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen((prev) => !prev);
            }}
          >
            <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
            <div className="flex flex-col gap-[5.4px]">
              <div aria-hidden="true" className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${open && "rotate-45"}`}></div>
              <div aria-hidden="true" className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${open && "opacity-0"}`}></div>
              <div aria-hidden="true" className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${open && "-rotate-45"}`}></div>
            </div>
          </div>

          <motion.div
            id="menu-mobile"
            role="menu"
            aria-hidden={!open}
            initial={false}
            animate={prefersReduced ? {} : { opacity: open ? 1 : 0.6, scale: open ? 1 : 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-white flex flex-col items-center justify-center gap-8 font-medium text-lg fixed inset-x-0 top-16 md:top-20 z-40 border-t border-slate-200 shadow-sm transition-all ease-in-out ${open ? "right-0" : "-right-[100%]"}`}
          >
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="inline-flex items-center h-10 px-3 rounded-lg text-black no-underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 active:opacity-90 cursor-pointer"
              >
                Início
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                to="/posts?sort=trending"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="inline-flex items-center h-10 px-3 rounded-lg text-black no-underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 active:opacity-90 cursor-pointer"
              >
                Em alta
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                to="/posts?sort=popular"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="inline-flex items-center h-10 px-3 rounded-lg text-black no-underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 active:opacity-90 cursor-pointer"
              >
                Mais populares
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="inline-flex items-center h-10 px-3 rounded-lg text-black no-underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 active:opacity-90 cursor-pointer"
              >
                Sobre
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link to="/login" role="menuitem" onClick={() => setOpen(false)}>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-black text-white no-underline shadow-sm hover:shadow-md hover:bg-black/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 px-4 py-2 text-sm font-medium cursor-pointer"
                >
                  Entrar 👋
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="hidden md:flex items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6 font-medium">
          <motion.div whileHover={prefersReduced ? {} : { y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className="inline-flex items-center h-10 px-3 rounded-lg text-black no-underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 active:opacity-90 cursor-pointer"
            >
              Início
            </Link>
          </motion.div>
          <motion.div whileHover={prefersReduced ? {} : { y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/posts?sort=trending"
              className="inline-flex items-center h-10 px-3 rounded-lg text-black no-underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 active:opacity-90 cursor-pointer"
            >
              Em alta
            </Link>
          </motion.div>
          <motion.div whileHover={prefersReduced ? {} : { y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/posts?sort=popular"
              className="inline-flex items-center h-10 px-3 rounded-lg text-black no-underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 active:opacity-90 cursor-pointer"
            >
              Mais populares
            </Link>
          </motion.div>
          <motion.div whileHover={prefersReduced ? {} : { y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/sobre"
              className="inline-flex items-center h-10 px-3 rounded-lg text-black no-underline hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 active:opacity-90 cursor-pointer"
            >
              Sobre
            </Link>
          </motion.div>

          <SignedOut>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link to="/login">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-black text-white no-underline shadow-sm hover:shadow-md hover:bg-black/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 px-4 py-2 text-sm font-medium cursor-pointer"
                >
                  Entrar 👋
                </button>
              </Link>
            </motion.div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center h-10 px-2 rounded-lg ring-1 ring-slate-200 bg-white shadow-sm">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
