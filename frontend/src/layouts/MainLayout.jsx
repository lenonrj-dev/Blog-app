import { Suspense } from "react";
import { Outlet, useRouteError } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* NAVBAR global */}
      <Navbar />

      {/* CONTEÚDO das rotas */}
      <Suspense fallback={<PageLoader />}> 
        <main id="conteudo" className="flex-1 px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64 py-6 md:py-10">
          <Outlet />
        </main>
      </Suspense>

      {/* FOOTER sempre ao final */}
      <Footer />
    </div>
  );
}

// Loader padrão para rotas assíncronas
export function PageLoader() {
  return (
    <div role="status" aria-live="polite" className="mx-auto w-full max-w-screen-xl">
      <div className="h-4 w-40 bg-slate-100 rounded animate-pulse mb-4" />
      <div className="h-6 w-64 bg-slate-100 rounded animate-pulse mb-3" />
      <div className="h-6 w-56 bg-slate-100 rounded animate-pulse mb-6" />
      <div className="h-40 w-full bg-slate-100 rounded animate-pulse" />
    </div>
  );
}

// Error boundary simples para usar em Router (errorElement)
export function RouteErrorBoundary() {
  const err = useRouteError();
  const message = (err && (err.statusText || err.message)) || "Algo deu errado";
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold text-slate-900">Não foi possível carregar esta página</h1>
        <p className="mt-2 text-slate-600 text-sm">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 px-4 py-2 text-sm font-medium"
        >
          Recarregar
        </button>
      </div>
    </main>
  );
}
