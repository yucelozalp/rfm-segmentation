import { RFMData, RFMScore, RFMFilters } from '@/types/rfm';
import mockData from '@/data/mockData.json';

/**
 * Mock RFM verisi JSON dosyasından okur
 * 150 satırlık önceden hazırlanmış gerçekçi veri
 */
export function loadMockRFMData(): RFMData[] {
  // JSON dosyasından veriyi yükle ve tip güvenliği sağla
  return mockData.map(item => ({
    id: item.id,
    recency: item.recency,
    frequency: item.frequency,
    monetary: item.monetary
  })) as RFMData[];
}

/**
 * Dinamik RFM verisi üretir - tüm frequency aralığında dengeli dağılım
 * 150 satırlık veri, her frequency score aralığında müşteri olacak şekilde
 */
export function generateDynamicRFMData(): RFMData[] {
  const data: RFMData[] = [];
  
  // Her frequency score aralığı için müşteri sayısı (1-5 score için)
  const customersPerScoreRange = 30; // 30 * 5 = 150 müşteri
  
  for (let scoreRange = 1; scoreRange <= 5; scoreRange++) {
    for (let i = 0; i < customersPerScoreRange; i++) {
      const customerId = `customer_${(data.length + 1).toString().padStart(3, '0')}`;
      
      // Frequency değerlerini score aralığına göre ayarla
      let frequency: number;
      switch (scoreRange) {
        case 1: frequency = Math.floor(Math.random() * 10) + 1; break;    // 1-10 (düşük)
        case 2: frequency = Math.floor(Math.random() * 10) + 11; break;   // 11-20
        case 3: frequency = Math.floor(Math.random() * 10) + 21; break;   // 21-30
        case 4: frequency = Math.floor(Math.random() * 10) + 31; break;   // 31-40
        case 5: frequency = Math.floor(Math.random() * 10) + 41; break;   // 41-50 (yüksek)
        default: frequency = Math.floor(Math.random() * 50) + 1;
      }
      
      // Monetary değerlerini de çeşitlendir
      const monetary = Math.floor(Math.random() * 9000) + 1000; // 1000-10000 TL
      
      // Recency değerlerini çeşitlendir (düşük recency = iyi müşteri)
      const recency = Math.floor(Math.random() * 350) + 1; // 1-350 gün
      
      data.push({
        id: customerId,
        recency,
        frequency,
        monetary
      });
    }
  }
  
  // Veriyi karıştır
  return data.sort(() => Math.random() - 0.5);
}

/**
 * Geriye uyumluluk için eski fonksiyon adını koruyoruz
 * @deprecated loadMockRFMData() veya generateDynamicRFMData() kullanın
 */
export function generateMockRFMData(): RFMData[] {
  return loadMockRFMData();
}

/**
 * Yüzde dilimlerine göre skor hesaplar (1-5 arası)
 * Düşük değer = yüksek skor (recency için)
 * Yüksek değer = yüksek skor (frequency ve monetary için)
 */
function calculatePercentileScore(value: number, values: number[], reverse: boolean = false): number {
  // Değerleri sıralayıp yüzde dilimlerini hesaplıyoruz
  const sortedValues = [...values].sort((a, b) => a - b);
  const length = sortedValues.length;
  
  // Değerin hangi yüzde dilimde olduğunu buluyoruz
  let percentile = 0;
  for (let i = 0; i < length; i++) {
    if (sortedValues[i] >= value) {
      percentile = i / length;
      break;
    }
  }
  
  // Recency için tersine çeviriyoruz (düşük recency = iyi müşteri)
  if (reverse) {
    percentile = 1 - percentile;
  }
  
  // 1-5 arası skora dönüştürüyoruz
  if (percentile <= 0.2) return 1;
  if (percentile <= 0.4) return 2;
  if (percentile <= 0.6) return 3;
  if (percentile <= 0.8) return 4;
  return 5;
}

/**
 * RFM verilerini skorlara dönüştürür
 * x = frequency_score (1-5)
 * y = monetary_score (1-5)
 */
export function calculateRFMScores(data: RFMData[]): RFMScore[] {
  // Tüm değerleri ayrı ayrı topluyoruz
  const recencyValues = data.map(d => d.recency);
  const frequencyValues = data.map(d => d.frequency);
  const monetaryValues = data.map(d => d.monetary);
  
  return data.map(item => ({
    ...item,
    // Recency: düşük değer = yüksek skor (reverse=true)
    recency_score: calculatePercentileScore(item.recency, recencyValues, true),
    // Frequency: yüksek değer = yüksek skor
    frequency_score: calculatePercentileScore(item.frequency, frequencyValues, false),
    // Monetary: yüksek değer = yüksek skor
    monetary_score: calculatePercentileScore(item.monetary, monetaryValues, false)
  }));
}

/**
 * RFM skorlarını filtrelere göre filtreler
 */
export function filterRFMData(data: RFMScore[], filters: RFMFilters): RFMScore[] {
  return data.filter(item => {
    return (
      item.recency >= filters.recency.min &&
      item.recency <= filters.recency.max &&
      item.frequency >= filters.frequency.min &&
      item.frequency <= filters.frequency.max &&
      item.monetary >= filters.monetary.min &&
      item.monetary <= filters.monetary.max
    );
  });
}

/**
 * Filtreleme için min/max değerleri hesaplar
 */
export function getFilterRanges(data: RFMScore[]): RFMFilters {
  if (data.length === 0) {
    return {
      recency: { min: 0, max: 365 },
      frequency: { min: 0, max: 50 },
      monetary: { min: 0, max: 10000 }
    };
  }
  
  return {
    recency: {
      min: Math.min(...data.map(d => d.recency)),
      max: Math.max(...data.map(d => d.recency))
    },
    frequency: {
      min: Math.min(...data.map(d => d.frequency)),
      max: Math.max(...data.map(d => d.frequency))
    },
    monetary: {
      min: Math.min(...data.map(d => d.monetary)),
      max: Math.max(...data.map(d => d.monetary))
    }
  };
}

/**
 * 5x5 grid için verileri organize eder
 */
export function organizeDataForGrid(data: RFMScore[]) {
  const grid: { [key: string]: RFMScore[] } = {};
  
  // Grid hücrelerini başlatıyoruz
  for (let x = 1; x <= 5; x++) {
    for (let y = 1; y <= 5; y++) {
      grid[`${x}-${y}`] = [];
    }
  }
  
  // Verileri grid hücrelerine yerleştiriyoruz
  data.forEach(item => {
    const key = `${item.frequency_score}-${item.monetary_score}`;
    if (grid[key]) {
      grid[key].push(item);
    }
  });
  
  return grid;
}