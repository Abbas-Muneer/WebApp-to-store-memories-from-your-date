import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMemories } from '../api/memories';
import DateCard from '../components/DateCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import SortFilterDropdown from '../components/SortFilterDropdown';
import { SkeletonGrid } from '../components/Skeletons';
import MemoryModal from '../components/MemoryModal';

export default function AllDates() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [sort, setSort] = useState(params.get('sort') || 'recent');
  const page = Number(params.get('page') || 0);
  const size = 12;
  const isFirstRun = useRef(true);
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['memories', page, search, sort],
    queryFn: () => fetchMemories({ page, size, search, sort })
  });

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const nextParams = {};
    if (search) nextParams.search = search;
    if (sort) nextParams.sort = sort;
    nextParams.page = 0;
    setParams(nextParams);
  }, [search, sort, setParams]);

  const handlePageChange = (next) => {
    const nextParams = {};
    if (search) nextParams.search = search;
    if (sort) nextParams.sort = sort;
    nextParams.page = next;
    setParams(nextParams);
  };

  const hasResults = (data?.content || []).length > 0;

  return (
    <div className="space-y-8">
        <div className="rounded-3xl bg-white p-4 shadow-card md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-vault-ink">All dates</h1>
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <div className="w-full md:min-w-[240px] md:w-auto">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <SortFilterDropdown value={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      {isLoading && <SkeletonGrid count={6} />}
      {!isLoading && hasResults && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.content.map((memory) => (
            <DateCard key={memory.id} memory={memory} onClick={() => setSelected(memory)} />
          ))}
        </div>
      )}
      {!isLoading && !hasResults && (
        <div className="rounded-2xl bg-white px-6 py-8 text-sm text-slate-500 shadow-soft">
          No memories yet. Try logging a new date or adjust your search.
        </div>
      )}

      <Pagination
        page={data?.page || 0}
        totalPages={data?.totalPages || 0}
        onPageChange={handlePageChange}
      />
      {selected && <MemoryModal memory={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
