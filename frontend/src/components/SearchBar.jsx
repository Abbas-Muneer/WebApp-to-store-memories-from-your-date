export default function SearchBar({ value, onChange, placeholder = 'Search restaurants' }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-soft">
      <span className="text-slate-400">🔍</span>
      <input
        className="w-full border-none bg-transparent text-sm focus:outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
