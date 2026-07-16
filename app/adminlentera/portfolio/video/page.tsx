import PortfolioManager from '@/components/admin/PortfolioManager';
import { Suspense } from 'react';

export default function PortfolioVideo() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-500">Memuat manajer portofolio...</div>}>
      <PortfolioManager mediaType="video" />
    </Suspense>
  );
}
