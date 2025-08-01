'use client';

import { RFMScore } from '@/types/rfm';
import { organizeDataForGrid } from '@/utils/rfmUtils';

interface RFMGridProps {
  data: RFMScore[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

/**
 * 5x5 RFM Grid component'i
 * x = frequency_score (1-5), y = monetary_score (1-5)
 */
export default function RFMGrid({ data, selectedIds, onSelectionChange }: RFMGridProps) {
  // Verileri grid formatına organize ediyoruz
  const gridData = organizeDataForGrid(data);

  /**
   * Müşteri seçimini toggle eder
   */
  const toggleCustomerSelection = (customerId: string) => {
    const isSelected = selectedIds.includes(customerId);
    
    if (isSelected) {
      // Seçimi kaldır
      onSelectionChange(selectedIds.filter(id => id !== customerId));
    } else {
      // Seçime ekle
      onSelectionChange([...selectedIds, customerId]);
    }
  };

  /**
   * Hücredeki tüm müşterileri seç/seçimi kaldır
   */
  const toggleCellSelection = (cellCustomers: RFMScore[]) => {
    const cellIds = cellCustomers.map(c => c.id);
    const allSelected = cellIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      // Hücredeki tüm seçimleri kaldır
      onSelectionChange(selectedIds.filter(id => !cellIds.includes(id)));
    } else {
      // Hücredeki tüm müşterileri seç
      const newSelectedIds = [...selectedIds];
      cellIds.forEach(id => {
        if (!newSelectedIds.includes(id)) {
          newSelectedIds.push(id);
        }
      });
      onSelectionChange(newSelectedIds);
    }
  };

  /**
   * Grid hücresinin rengini belirler
   */
  const getCellColor = (x: number, y: number) => {
    // Frequency (x) ve Monetary (y) skorlarına göre renk gradyanı
    const intensity = (x + y) / 10; // 0.2 - 1.0 arası
    
    if (intensity >= 0.8) return 'bg-green-500'; // En değerli müşteriler
    if (intensity >= 0.6) return 'bg-green-400';
    if (intensity >= 0.4) return 'bg-yellow-400';
    if (intensity >= 0.2) return 'bg-orange-400';
    return 'bg-red-400'; // En az değerli müşteriler
  };

  /**
   * Segment adını döndürür
   */
  const getSegmentName = (x: number, y: number) => {
    if (x >= 4 && y >= 4) return 'Şampiyonlar';
    if (x >= 4 && y >= 2) return 'Sadık Müşteriler';
    if (x >= 3 && y >= 3) return 'Potansiyel Sadıklar';
    if (x >= 3 && y >= 1) return 'Yeni Müşteriler';
    if (x >= 2 && y >= 3) return 'Umut Vadenler';
    if (x >= 2 && y >= 1) return 'Dikkat Gerektirenler';
    if (x >= 1 && y >= 3) return 'Kaybetme Riski';
    if (x >= 1 && y >= 1) return 'Kayıp Müşteriler';
    return 'Diğer';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">RFM Segmentasyon Grid'i</h3>
        <p className="text-sm text-gray-600">
          X ekseni: Frequency Score (Satın Alma Sıklığı) | Y ekseni: Monetary Score (Harcama Miktarı)
        </p>
      </div>

      {/* Grid Container */}
      <div className="relative">
        {/* Y ekseni etiketi */}
        <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90">
          <span className="text-sm font-medium text-gray-700">Monetary Score</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-1 border-2 border-gray-300">
          {/* Y ekseni 5'ten 1'e doğru (yukarıdan aşağıya) */}
          {[5, 4, 3, 2, 1].map(y => (
            <div key={`row-${y}`} className="contents">
              {/* X ekseni 1'den 5'e doğru (soldan sağa) */}
              {[1, 2, 3, 4, 5].map(x => {
                const cellKey = `${x}-${y}`;
                const cellCustomers = gridData[cellKey] || [];
                const cellSelectedCount = cellCustomers.filter(c => selectedIds.includes(c.id)).length;
                
                return (
                  <div
                    key={cellKey}
                    className={`
                      relative h-24 border border-gray-200 p-1 cursor-pointer group
                      ${getCellColor(x, y)} bg-opacity-20 hover:bg-opacity-40
                      transition-all duration-200 hover:shadow-lg
                      ${cellSelectedCount > 0 ? 'border-blue-500 border-2' : ''}
                    `}
                    onClick={() => toggleCellSelection(cellCustomers)}
                  >
                    {/* Hücre koordinatları */}
                    <div className="absolute top-0 left-0 text-xs text-gray-500 bg-white px-1 rounded">
                      {x},{y}
                    </div>
                    
                    {/* Seçim arka planı - en altta */}
                    {cellSelectedCount > 0 && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-sm z-0"></div>
                    )}

                    {/* Müşteri sayısı - ortada */}
                    <div className="relative flex flex-col items-center justify-center h-full z-10">
                      <div className={`text-lg font-bold transition-colors ${
                        cellSelectedCount > 0 ? 'text-blue-700' : 'text-gray-800'
                      }`}>
                        {cellCustomers.length}
                      </div>
                      {cellSelectedCount > 0 && (
                        <div className="relative text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full z-20">
                          ✓ {cellSelectedCount} müşteri seçildi
                        </div>
                      )}
                    </div>

                    {/* Onay işareti - en üstte */}
                    {cellSelectedCount > 0 && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center z-30">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                      <div className="font-semibold">{getSegmentName(x, y)}</div>
                      <div className="text-xs text-gray-300">
                        {cellCustomers.length} customers • Coordinate: ({x},{y})
                      </div>
                      <div className="text-xs text-gray-300">
                        Frequency: {x}/5 • Monetary: {y}/5
                      </div>
                      {/* Tooltip ok */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* X ekseni etiketi */}
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-gray-700">Frequency Score</span>
        </div>

        {/* X ekseni değerleri */}
        <div className="grid grid-cols-5 gap-1 mt-1">
          {[1, 2, 3, 4, 5].map(x => (
            <div key={x} className="text-center text-xs text-gray-600">
              {x}
            </div>
          ))}
        </div>

        {/* Y ekseni değerleri */}
        <div className="absolute -left-8 top-0 h-full flex flex-col justify-between py-1">
          {[5, 4, 3, 2, 1].map(y => (
            <div key={y} className="text-xs text-gray-600 h-6 flex items-center">
              {y}
            </div>
          ))}
        </div>
      </div>

      {/* Seçim özeti */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Toplam müşteri: {data.length} | Seçilen: {selectedIds.length}
          </span>
          {selectedIds.length > 0 && (
            <button
              onClick={() => onSelectionChange([])}
              className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
            >
              Tüm Seçimleri Kaldır
            </button>
          )}
        </div>
      </div>
    </div>
  );
}