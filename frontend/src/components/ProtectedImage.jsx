import { useState } from 'react';

export default function ProtectedImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src) {
    return <div className={'bg-slate-200 ' + className} />;
  }

  return (
    <div className="relative h-full w-full">
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
      {failed ? (
        <div className={'flex items-center justify-center text-xs text-slate-400 ' + className}>no image</div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={className + ' transition-opacity duration-300 ' + (loaded ? 'opacity-100' : 'opacity-0')}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
