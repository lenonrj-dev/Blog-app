// Footer simples com ícones do lucide-react (Instagram e Facebook)
// Instalar caso ainda não tenha: npm i lucide-react

import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  // Substitua pelos seus perfis oficiais
  const instagramUrl = "https://instagram.com/seuusuario"; // TODO: edite
  const facebookUrl = "https://facebook.com/seuusuario";   // TODO: edite

  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="mt-10 border-t border-slate-200 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600 text-center md:text-left">
          © {year} Plataforma de Notícias. Todos os direitos reservados.
        </p>

        <div className="flex items-center gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar nosso Instagram"
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl ring-1 ring-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/40 active:scale-[0.98] transition"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar nosso Facebook"
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl ring-1 ring-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/40 active:scale-[0.98] transition"
          >
            <Facebook className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
