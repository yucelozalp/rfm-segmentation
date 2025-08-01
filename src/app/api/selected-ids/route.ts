import { NextRequest, NextResponse } from 'next/server';

/**
 * Seçilen ID'leri alan POST endpoint'i
 * Mock API olarak çalışır ve gelen verileri konsola yazdırır
 */
export async function POST(request: NextRequest) {
  try {
    // Request body'den seçilen ID'leri alıyoruz
    const body = await request.json();
    const { selectedIds } = body;
    
    // Gelen verileri doğruluyoruz
    if (!Array.isArray(selectedIds)) {
      return NextResponse.json(
        { error: 'selectedIds array olmalıdır' },
        { status: 400 }
      );
    }
    
    // Mock işlem - gerçek uygulamada burada veritabanı işlemleri yapılabilir
    console.log('Seçilen müşteri ID\'leri:', selectedIds);
    console.log('Toplam seçilen müşteri sayısı:', selectedIds.length);
    
    // Başarılı yanıt döndürüyoruz
    return NextResponse.json({
      success: true,
      message: `${selectedIds.length} müşteri başarıyla seçildi`,
      selectedIds: selectedIds,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint'i - API'nin çalıştığını test etmek için
 */
export async function GET() {
  return NextResponse.json({
    message: 'RFM Segmentasyon API çalışıyor',
    endpoint: '/api/selected-ids',
    method: 'POST',
    expectedBody: {
      selectedIds: ['customer_001', 'customer_002']
    }
  });
}