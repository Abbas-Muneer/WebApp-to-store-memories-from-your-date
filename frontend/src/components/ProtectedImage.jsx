import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { getToken } from "../utils/auth";

function normalizeImagePath(path) {
  if (!path) return "";
  let normalized = path;
  if (normalized.startsWith("http")) {
    const match = normalized.match(/\/api\/(.*)$/);
    if (match) {
      normalized = match[1];
    }
  }
  if (normalized.startsWith("/")) {
    normalized = normalized.slice(1);
  }
  if (normalized.startsWith("api/")) {
    normalized = normalized.slice(4);
  }
  return normalized;
}

export default function ProtectedImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blobUrl, setBlobUrl] = useState("");

  const imgSrc = useMemo(() => {
    if (!src) return "";
    const token = getToken();
    const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
    const path = normalizeImagePath(src);
    if (!path) return "";
    const sep = base.endsWith("/") ? "" : "/";
    const tokenParam = token ? `?token=${token}` : "";
    return `${base}${sep}${path}${tokenParam}`;
  }, [src]);

  useEffect(() => {
    let objectUrl = "";
    const load = async () => {
      if (!src) return;
      setFailed(false);
      setLoaded(false);
      setBlobUrl("");
      try {
        const path = normalizeImagePath(src);
        if (!path) return;
        const response = await api.get(`/${path}`, { responseType: "blob" });
        objectUrl = URL.createObjectURL(response.data);
        setBlobUrl(objectUrl);
      } catch (err) {
        setFailed(true);
      }
    };
    load();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!imgSrc && !blobUrl) {
    return <div className={"bg-slate-200 " + className} />;
  }

  return (
    <div className="relative h-full w-full">
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
      {failed ? (
        <div className={"flex items-center justify-center text-xs text-slate-400 " + className}>no image</div>
      ) : (
        <img
          src={blobUrl || imgSrc}
          alt={alt}
          className={className + " transition-opacity duration-300 " + (loaded ? "opacity-100" : "opacity-0")}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
