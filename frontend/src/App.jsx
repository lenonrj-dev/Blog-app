import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* NAVBAR global */}
      <Navbar />

      {/* Conteúdo das páginas */}
      <main id="conteudo" className="flex-1 px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
        <Outlet />
      </main>

      {/* FOOTER global */}
      <Footer />
    </div>
  );
}
