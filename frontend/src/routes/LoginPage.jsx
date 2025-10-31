import { SignIn } from "@clerk/clerk-react";
import { motion, useReducedMotion } from "framer-motion";

const LoginPage = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-labelledby="titulo-login"
      className="flex items-center justify-center h-[calc(100vh-80px)]"
    >
      <h1 id="titulo-login" className="sr-only">
        Entrar
      </h1>

      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
        animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-4 md:p-6 shadow-sm"
      >
        <SignIn signUpUrl="/register" />
      </motion.div>
    </section>
  );
};

export default LoginPage;
