import ProtectedImage from './ProtectedImage';

export default function ImageRow({ images = [] }) {
  if (!images.length) {
    return <div className="text-xs text-slate-400">No images yet</div>;
  }
  return (
    <div className="flex gap-2">
      {images.slice(0, 3).map((image) => (
        <div key={image.id} className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
          <ProtectedImage src={image.url} alt="Date memory" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
