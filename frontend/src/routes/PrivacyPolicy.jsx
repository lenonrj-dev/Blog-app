import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

export default function PrivacyPolicy() {
  const reduce = useReducedMotion();

  const rise = reduce ? {} : { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.35 } };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Política de Privacidade — SYN Blog",
    description: "Política de Privacidade e Cookies do SYN Blog, com informações sobre dados coletados, bases legais, direitos do titular e contatos.",
  };

  return (
    <main id="conteudo" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav aria-label="Trilha de navegação" className="mb-6 text-sm">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="text-blue-700 no-underline hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded">Início</Link>
          </li>
          <li aria-hidden="true" className="text-slate-400">•</li>
          <li aria-current="page" className="text-blue-700 font-medium">Política de Privacidade</li>
        </ol>
      </nav>

      {/* Título */}
      <header className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          Política de Privacidade & Cookies
        </h1>
        <p className="mt-3 max-w-3xl text-slate-700">Esta página descreve como tratamos seus dados pessoais, quais cookies utilizamos e como você pode controlar suas preferências. Cumprimos a LGPD (Lei nº 13.709/2018) e adotamos boas práticas inspiradas no GDPR.</p>
      </header>

      {/* Seções */}
      <div className="space-y-8">
        <motion.section {...rise} aria-labelledby="dados-coletados" id="dados">
          <h2 id="dados-coletados" className="text-xl md:text-2xl font-semibold tracking-tight">Quais dados coletamos</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
            <li><strong>Conta e autenticação:</strong> nome, e-mail e metadados de perfil fornecidos por você (ex.: serviço de login).</li>
            <li><strong>Conteúdo enviado:</strong> comentários, textos e mídias compartilhadas no site.</li>
            <li><strong>Registros técnicos:</strong> IP, agente do navegador, páginas acessadas, data/hora (para segurança e prevenção a abusos).</li>
            <li><strong>Cookies e identificadores:</strong> usados para lembrar preferências e, com consentimento, medir audiência e personalização.</li>
          </ul>
        </motion.section>

        <motion.section {...rise} aria-labelledby="bases-legais">
          <h2 id="bases-legais" className="text-xl md:text-2xl font-semibold tracking-tight">Bases legais de tratamento</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
            <li><strong>Execução de contrato/serviço:</strong> fornecer o site, permitir login e publicar conteúdos.</li>
            <li><strong>Legítimo interesse:</strong> manter segurança, prevenir fraudes e melhorar recursos essenciais.</li>
            <li><strong>Consentimento:</strong> para cookies não essenciais (analytics/marketing) e comunicações opcionais (newsletter).</li>
            <li><strong>Cumprimento de obrigação legal:</strong> atender solicitações de autoridades e obrigações regulatórias.</li>
          </ul>
        </motion.section>

        <motion.section {...rise} aria-labelledby="uso-dos-dados">
          <h2 id="uso-dos-dados" className="text-xl md:text-2xl font-semibold tracking-tight">Como usamos seus dados</h2>
          <p className="mt-3 text-slate-700">Usamos os dados para operar e melhorar o site, personalizar a experiência, medir desempenho, prevenir fraudes, responder a contatos e cumprir obrigações legais. Não vendemos seus dados pessoais.</p>
        </motion.section>

        <motion.section {...rise} aria-labelledby="compartilhamento">
          <h2 id="compartilhamento" className="text-xl md:text-2xl font-semibold tracking-tight">Compartilhamento</h2>
          <p className="mt-3 text-slate-700">Podemos compartilhar dados com provedores de infraestrutura e analytics (apenas com consentimento, quando aplicável), e com autoridades quando exigido por lei. Firmamos contratos e medidas de proteção com parceiros.</p>
        </motion.section>

        <motion.section {...rise} aria-labelledby="cookies" id="cookies" className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 md:p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Cookies</h2>
          <p className="mt-3 text-slate-700">Usamos cookies necessários para autenticação, segurança e lembrar preferências. Cookies de <em>analytics</em> e marketing só são ativados com o seu consentimento no aviso de cookies.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm border-separate border-spacing-y-1">
              <thead>
                <tr className="text-slate-600">
                  <th className="py-2">Categoria</th>
                  <th className="py-2">Finalidade</th>
                  <th className="py-2">Base legal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-50">
                  <td className="py-2 font-medium">Necessários</td>
                  <td className="py-2">Login, segurança, preferências básicas.</td>
                  <td className="py-2">Execução de contrato/legítimo interesse</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-2 font-medium">Analytics</td>
                  <td className="py-2">Medição de audiência e performance.</td>
                  <td className="py-2">Consentimento</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-2 font-medium">Marketing</td>
                  <td className="py-2">Personalização e patrocínios.</td>
                  <td className="py-2">Consentimento</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                try { localStorage.removeItem("syn-consent"); } catch {}
                window.dispatchEvent(new Event("consentchange"));
                // Sugestão: redirecionar para home para reabrir o banner
                window.location.assign("/");
              }}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
              style={{ background: "linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)" }}
            >
              Reconfigurar preferências de cookies
            </button>
          </div>
        </motion.section>

        <motion.section {...rise} aria-labelledby="direitos" id="direitos">
          <h2 id="direitos" className="text-xl md:text-2xl font-semibold tracking-tight">Seus direitos (LGPD)</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
            <li>Confirmação de tratamento e acesso aos dados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
            <li>Portabilidade, quando aplicável.</li>
            <li>Informação sobre compartilhamentos e consequências do consentimento.</li>
            <li>Revogação do consentimento a qualquer momento.</li>
          </ul>
        </motion.section>

        <motion.section {...rise} aria-labelledby="seguranca-retencao">
          <h2 id="seguranca-retencao" className="text-xl md:text-2xl font-semibold tracking-tight">Segurança e retenção</h2>
          <p className="mt-3 text-slate-700">Adotamos medidas técnicas e administrativas proporcionais ao risco, como controle de acesso, criptografia em trânsito e monitoramento. Mantemos dados pelo tempo necessário ao cumprimento das finalidades e obrigações legais.</p>
        </motion.section>

        <motion.section {...rise} aria-labelledby="transferencia">
          <h2 id="transferencia" className="text-xl md:text-2xl font-semibold tracking-tight">Transferência internacional</h2>
          <p className="mt-3 text-slate-700">Quando houver processamento fora do Brasil, buscamos garantir salvaguardas adequadas, como cláusulas contratuais e avaliação de conformidade do provedor.</p>
        </motion.section>

        <motion.section {...rise} aria-labelledby="contato" id="contato">
          <h2 id="contato" className="text-xl md:text-2xl font-semibold tracking-tight">Contato do Encarregado (DPO)</h2>
          <p className="mt-3 text-slate-700">Para exercer direitos ou tirar dúvidas, entre em contato com nosso Encarregado de Dados (DPO):</p>
          <p className="mt-1 text-slate-800"><strong>E-mail:</strong> <a href="mailto:axsuporteblog@gmail.com" className="text-blue-700 underline underline-offset-2 hover:no-underline">axsuporteblog@gmail.com</a></p>
          <p className="text-slate-500 text-sm mt-2">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
        </motion.section>
      </div>
    </main>
  );
}
