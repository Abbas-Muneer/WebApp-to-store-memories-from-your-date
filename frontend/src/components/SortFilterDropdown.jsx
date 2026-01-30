export default function SortFilterDropdown({ value, onChange }) {
  return (
    <select
      className="rounded-full border-none bg-white px-4 py-2 text-sm shadow-soft focus:outline-none"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="recent">Most recent</option>
      <option value="oldest">Oldest</option>
      <option value="highRating">Highest rating</option>
      <option value="lowRating">Lowest rating</option>
    </select>
  );
}
