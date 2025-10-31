import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { motion, useReducedMotion } from "framer-motion";

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();

  const onError = (err) => {
    console.log(err);
    toast.error("Falha no upload.");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData(res);
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    if (progress?.total) {
      setProgress(Math.round((progress.loaded / progress.total) * 100));
    }
  };

  const label = type === "image" ? "Enviar imagem" : type === "video" ? "Enviar vídeo" : "Enviar arquivo";
  const hintId = "upload-hint";

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        aria-hidden="true"
        ref={ref}
        accept={type ? `${type}/*` : "*/*"}
      />

      <motion.div
        role="button"
        tabIndex={0}
        aria-label={label}
        aria-describedby={hintId}
        title={label}
        whileTap={prefersReduced ? {} : { scale: 0.98 }}
        whileHover={prefersReduced ? {} : { y: -1 }}
        onClick={() => ref.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") ref.current?.click();
        }}
        className="group inline-flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 cursor-pointer select-none"
      >
        {children}
      </motion.div>
      <span id={hintId} className="sr-only">
        Pressione Enter ou Espaço para selecionar um arquivo e iniciar o envio.
      </span>
    </IKContext>
  );
};

export default Upload;