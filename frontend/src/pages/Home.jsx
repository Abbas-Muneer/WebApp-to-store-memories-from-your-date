import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchRecent } from '../api/memories';
import { me } from '../api/auth';
import DateCard from '../components/DateCard';
import SearchBar from '../components/SearchBar';
import { SkeletonGrid } from '../components/Skeletons';
import MemoryModal from '../components/MemoryModal';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: me });
  const { data: recent, isLoading, isError, error } = useQuery({
    queryKey: ['recent-memories'],
    queryFn: () => fetchRecent(3)
  });
  const [selected, setSelected] = useState(null);

  const handleSearch = () => {
    if (search.trim()) navigate(`/dates?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="space-y-10">
      {/* Welcome card */}
      <section className="romantic-card p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-vault-muted">Welcome</div>
            <h1 className="mt-3 text-3xl font-semibold text-vault-ink">
              Hey, {user?.name || 'there'} 💕
            </h1>
            <p className="mt-2 text-sm text-vault-muted">
              Capture tonight's date and relive your memories in one private vault.
            </p>
          </div>
          <button
            className="romantic-primary w-full px-6 py-3 text-sm md:w-auto"
            onClick={() => navigate('/upload')}
          >
            Log a new date ✨
          </button>
        </div>

        {/* Search row */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <button
            className="romantic-pill w-full px-5 py-2.5 text-sm font-semibold md:w-auto"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </section>

      {/* Recent dates */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-vault-ink">Your last 3 dates</h2>
          <button
            className="text-sm font-semibold text-vault-navy hover:underline"
            onClick={() => navigate('/dates')}
          >
            View all →
          </button>
        </div>

        {isLoading && <SkeletonGrid count={3} />}

        {isError && (
          <div className="romantic-card flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between">
            <span className="text-sm text-vault-muted">
              {error?.response?.data?.message || 'Invite your partner to start saving memories.'}
            </span>
            <button
              className="romantic-primary w-full px-4 py-2 text-xs md:w-auto"
              onClick={() => navigate('/invite')}
            >
              Invite by email 💌
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(recent || []).map((memory) => (
              <DateCard key={memory.id} memory={memory} onClick={() => setSelected(memory)} />
            ))}
          </div>
        )}
      </section>

      {selected && <MemoryModal memory={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
