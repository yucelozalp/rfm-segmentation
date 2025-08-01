'use client';

import { RFMFilters as RFMFiltersType } from '@/types/rfm';

interface RFMFiltersProps {
  filters: RFMFiltersType;
  onFiltersChange: (filters: RFMFiltersType) => void;
  ranges: RFMFiltersType;
}

/**
 * RFM filtreleme component'i
 * Recency, Frequency ve Monetary değerleri için range slider'lar sağlar
 */
export default function RFMFilters({ filters, onFiltersChange, ranges }: RFMFiltersProps) {
  
  /**
   * Filtre değişikliklerini handle eder
   */
  const handleFilterChange = (
    type: 'recency' | 'frequency' | 'monetary',
    bound: 'min' | 'max',
    value: number
  ) => {
    const newFilters = {
      ...filters,
      [type]: {
        ...filters[type],
        [bound]: value
      }
    };
    onFiltersChange(newFilters);
  };

  /**
   * Filtreleri sıfırlar
   */
  const resetFilters = () => {
    onFiltersChange(ranges);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filtreler</h3>
        <button
          onClick={resetFilters}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Sıfırla
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Recency Filtresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recency (Son Satın Alma - Gün)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="range"
                  min={ranges.recency.min}
                  max={ranges.recency.max}
                  value={filters.recency.min}
                  onChange={(e) => handleFilterChange('recency', 'min', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-600">{filters.recency.min} gün</span>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="range"
                  min={ranges.recency.min}
                  max={ranges.recency.max}
                  value={filters.recency.max}
                  onChange={(e) => handleFilterChange('recency', 'max', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-600">{filters.recency.max} gün</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequency Filtresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency (Satın Alma Sayısı)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="range"
                  min={ranges.frequency.min}
                  max={ranges.frequency.max}
                  value={filters.frequency.min}
                  onChange={(e) => handleFilterChange('frequency', 'min', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-600">{filters.frequency.min} adet</span>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="range"
                  min={ranges.frequency.min}
                  max={ranges.frequency.max}
                  value={filters.frequency.max}
                  onChange={(e) => handleFilterChange('frequency', 'max', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-600">{filters.frequency.max} adet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monetary Filtresi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monetary (Toplam Harcama - TL)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Min</label>
                <input
                  type="range"
                  min={ranges.monetary.min}
                  max={ranges.monetary.max}
                  value={filters.monetary.min}
                  onChange={(e) => handleFilterChange('monetary', 'min', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-600">{filters.monetary.min.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Max</label>
                <input
                  type="range"
                  min={ranges.monetary.min}
                  max={ranges.monetary.max}
                  value={filters.monetary.max}
                  onChange={(e) => handleFilterChange('monetary', 'max', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-600">{filters.monetary.max.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}