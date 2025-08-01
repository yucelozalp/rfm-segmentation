// RFM analizi için veri tiplerini tanımlıyoruz
export interface RFMData {
  id: string;
  recency: number;    // Son satın alma tarihinden bu yana geçen gün sayısı
  frequency: number;  // Toplam satın alma sayısı
  monetary: number;   // Toplam harcama miktarı
}

// Grid pozisyonu için tip tanımı
export interface RFMScore {
  id: string;
  recency: number;
  frequency: number;
  monetary: number;
  frequency_score: number; // 1-5 arası x koordinatı
  monetary_score: number;  // 1-5 arası y koordinatı
  recency_score: number;   // 1-5 arası recency skoru
}

// Filtreleme için tip tanımı
export interface RFMFilters {
  recency: {
    min: number;
    max: number;
  };
  frequency: {
    min: number;
    max: number;
  };
  monetary: {
    min: number;
    max: number;
  };
}

// Grid hücresi için tip tanımı
export interface GridCell {
  x: number; // frequency_score (1-5)
  y: number; // monetary_score (1-5)
  items: RFMScore[];
}