'use client';

import { ModalProvider } from '@/components/admin/ModalContext';

export default function AdminLenteraLayout({ children }: { children: React.ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}
