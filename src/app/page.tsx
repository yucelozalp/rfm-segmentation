'use client';

import { useState, useEffect, useMemo } from 'react';
import { RFMData, RFMScore, RFMFilters as RFMFiltersType } from '@/types/rfm';
import {
  loadMockRFMData,
  generateDynamicRFMData,
  calculateRFMScores,
  filterRFMData,
  getFilterRanges
} from '@/utils/rfmUtils';
import RFMFilters from '@/components/RFMFilters';
import RFMGrid from '@/components/RFMGrid';
import SelectedCustomers from '@/components/SelectedCustomers';

/**
 * Ana RFM Segmentasyon Arayüzü
 * React, Next.js kullanarak RFM verilerinden x-y koordinatları türetilen grid arayüzü
 */
export default function RFMSegmentationPage() {
  // State tanımlamaları
  const [allRFMData, setAllRFMData] = useState<RFMScore[]>([]);
  const [filters, setFilters] = useState<RFMFiltersType>({
    recency: { min: 0, max: 365 },
    frequency: { min: 0, max: 50 },
    monetary: { min: 0, max: 10000 }
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string>('');
  const [dataSource, setDataSource] = useState<'json' | 'dynamic'>('json');

  /**
   * Component mount edildiğinde mock veri üretir ve skorları hesaplar
   */
  /**
   * Veri kaynağını değiştir ve yeniden yükle
   */
  const loadData = (source: 'json' | 'dynamic') => {
    let mockData: RFMData[];
    
    if (source === 'json') {
      // JSON dosyasından veri yükle
      mockData = loadMockRFMData();
      console.log('RFM verisi JSON dosyasından yüklendi');
    } else {
      // Dinamik veri üret
      mockData = generateDynamicRFMData();
      console.log('RFM verisi dinamik olarak oluşturuldu');
    }
    
    // RFM skorlarını hesapla (x=frequency_score, y=monetary_score)
    const scoredData = calculateRFMScores(mockData);
    
    // State'i güncelle
    setAllRFMData(scoredData);
    
    // Filtreleme aralıklarını ayarla
    const ranges = getFilterRanges(scoredData);
    setFilters(ranges);
    
    // Seçimleri temizle
    setSelectedIds([]);
    setApiMessage('');
    
    console.log('Veri yüklendi:', {
      source,
      totalCustomers: scoredData.length,
      sampleData: scoredData.slice(0, 3)
    });
  };

  /**
   * Component mount edildiğinde varsayılan veri kaynağını yükle
   */
  useEffect(() => {
    loadData(dataSource);
  }, []);

  /**
   * Veri kaynağı değiştiğinde yeniden yükle
   */
  const handleDataSourceChange = (source: 'json' | 'dynamic') => {
    setDataSource(source);
    loadData(source);
  };

  /**
   * Filtrelenmiş veriyi hesaplar (memoized)
   */
  const filteredData = useMemo(() => {
    return filterRFMData(allRFMData, filters);
  }, [allRFMData, filters]);

  /**
   * Seçilen müşterilerin detaylarını döndürür (memoized)
   */
  const selectedCustomers = useMemo(() => {
    return filteredData.filter(customer => selectedIds.includes(customer.id));
  }, [filteredData, selectedIds]);

  /**
   * Filtre aralıklarını hesaplar (memoized)
   */
  const filterRanges = useMemo(() => {
    return getFilterRanges(allRFMData);
  }, [allRFMData]);

  /**
   * Müşteri seçimini handle eder
   */
  const handleSelectionChange = (newSelectedIds: string[]) => {
    setSelectedIds(newSelectedIds);
    setApiMessage(''); // Önceki API mesajını temizle
  };

  /**
   * Seçilen müşteriyi kaldırır
   */
  const handleRemoveCustomer = (customerId: string) => {
    setSelectedIds(prev => prev.filter(id => id !== customerId));
  };

  /**
   * Seçilen ID'leri API'ye gönderir
   */
  const handleSendToAPI = async () => {
    if (selectedIds.length === 0) {
      setApiMessage('Lütfen önce müşteri seçin.');
      return;
    }

    setIsLoading(true);
    setApiMessage('');

    try {
      const response = await fetch('/api/selected-ids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedIds: selectedIds
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setApiMessage(`✅ Başarılı: ${result.message}`);
        console.log('API yanıtı:', result);
      } else {
        setApiMessage(`❌ Hata: ${result.error}`);
      }
    } catch (error) {
      console.error('API hatası:', error);
      setApiMessage('❌ Bağlantı hatası oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            RFM Segmentasyon Arayüzü
          </h1>
          <p className="text-lg text-gray-600">
            Müşteri segmentasyonu için RFM (Recency, Frequency, Monetary) analizi
          </p>
          
          {/* Veri Kaynağı Seçimi */}
          <div className="mt-4 flex justify-center items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Veri Kaynağı:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDataSourceChange('json')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dataSource === 'json'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                JSON Dosyası
              </button>
              <button
                onClick={() => handleDataSourceChange('dynamic')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  dataSource === 'dynamic'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Dinamik Oluştur
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Toplam müşteri: {allRFMData.length} | Filtrelenmiş: {filteredData.length} | Seçilen: {selectedIds.length}
          </div>
          
          {/* Veri Kaynağı Açıklaması */}
          <div className="mt-2 text-xs text-gray-400">
            {dataSource === 'json'
              ? 'Sabit veriler JSON dosyasından okunuyor'
              : 'Tüm frequency aralığında dengeli dağılım ile dinamik veri oluşturuluyor'
            }
          </div>
        </div>

        {/* API mesajı */}
        {apiMessage && (
          <div className={`
            mb-6 p-4 rounded-md text-center font-medium
            ${apiMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          `}>
            {apiMessage}
          </div>
        )}

        {/* Ana içerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol panel - Filtreler */}
          <div className="lg:col-span-1">
            <RFMFilters
              filters={filters}
              onFiltersChange={setFilters}
              ranges={filterRanges}
            />
          </div>

          {/* Orta panel - Grid */}
          <div className="lg:col-span-2">
            <RFMGrid
              data={filteredData}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>

        {/* Alt panel - Seçilen müşteriler */}
        <div className="mt-6">
          <SelectedCustomers
            selectedCustomers={selectedCustomers}
            onRemoveCustomer={handleRemoveCustomer}
            onSendToAPI={handleSendToAPI}
            isLoading={isLoading}
          />
        </div>

        {/* Açıklama */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Nasıl Kullanılır?</h3>
          <div className="space-y-2 text-blue-800">
            <p>• <strong>Filtreleme:</strong> Sol paneldeki slider'ları kullanarak Recency, Frequency ve Monetary değerlerine göre müşterileri filtreleyin.</p>
            <p>• <strong>Seçim:</strong> Grid'deki hücrelere tıklayarak o segmentteki tüm müşterileri seçin/seçimi kaldırın.</p>
            <p>• <strong>Grid:</strong> X ekseni Frequency Score (1-5), Y ekseni Monetary Score (1-5) değerlerini gösterir.</p>
            <p>• <strong>API Gönderimi:</strong> Seçilen müşteri ID'lerini POST /api/selected-ids endpoint'ine gönderin.</p>
            <p>• <strong>Renkler:</strong> Yeşil = Değerli müşteriler, Kırmızı = Düşük değerli müşteriler</p>
          </div>
        </div>
      </div>
    </div>
  );
}
