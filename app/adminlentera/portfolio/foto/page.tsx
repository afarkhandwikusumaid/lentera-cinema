import PortfolioManager from '@/components/admin/PortfolioManager';
import { Suspense } from 'react';

export default function PortfolioFoto() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-500">Memuat manajer portofolio...</div>}>
      <PortfolioManager mediaType="image" />
    </Suspense>
  );
}
