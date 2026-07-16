import { ProjectPayment, deletePayment } from '@/lib/db';
import { CheckCircle2, Clock, Edit2, Trash2 } from 'lucide-react';
import { useModal } from '@/components/admin/ModalContext';

export default function PaymentManager({
  payments,
  isEditingPayment,
  paymentForm,
  setIsEditingPayment,
  setPaymentForm,
  handlePaymentSubmit,
  fetchData,
  formatCurrency
}: {
  payments: ProjectPayment[];
  isEditingPayment: boolean;
  paymentForm: Partial<ProjectPayment>;
  setIsEditingPayment: (v: boolean) => void;
  setPaymentForm: (p: Partial<ProjectPayment>) => void;
  handlePaymentSubmit: (e: React.FormEvent) => void;
  fetchData: () => void;
  formatCurrency: (amount: number) => string;
}) {
  const { showConfirm } = useModal();

  return (
    <div className="space-y-4">
      {isEditingPayment ? (
        <div className="bg-bg-surface p-6 rounded-2xl border border-border">
          <h2 className="font-bold mb-4">{paymentForm.id ? 'Edit Termin' : 'Tambah Termin Baru'}</h2>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Nama Termin</label>
              <input required type="text" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" value={paymentForm.term_name || ''} onChange={e => setPaymentForm({...paymentForm, term_name: e.target.value})} placeholder="Misal: DP 70%" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Jumlah (Rp)</label>
              <input required type="number" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" value={paymentForm.amount || ''} onChange={e => setPaymentForm({...paymentForm, amount: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Jatuh Tempo</label>
              <input required type="date" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" value={paymentForm.due_date || ''} onChange={e => setPaymentForm({...paymentForm, due_date: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Status</label>
              <select className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" value={paymentForm.status || 'unpaid'} onChange={e => setPaymentForm({...paymentForm, status: e.target.value as ProjectPayment['status']})}>
                <option value="unpaid">Belum Dibayar</option>
                <option value="paid">Lunas</option>
              </select>
            </div>
            {paymentForm.status === 'paid' && (
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Tanggal Dibayar</label>
                <input type="date" className="w-full bg-bg-elevated border border-border rounded-lg p-2.5 text-sm" value={paymentForm.paid_date || ''} onChange={e => setPaymentForm({...paymentForm, paid_date: e.target.value})} />
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" className="bg-[#c29631] text-white px-4 py-2 rounded-lg text-sm font-bold">Simpan</button>
              <button type="button" onClick={() => setIsEditingPayment(false)} className="bg-[#222] px-4 py-2 rounded-lg text-sm font-bold">Batal</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-bg-surface rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex justify-between items-center bg-bg-elevated">
            <h3 className="font-bold text-sm">Daftar Termin</h3>
            <button onClick={() => { setPaymentForm({ status: 'unpaid' }); setIsEditingPayment(true); }} className="text-xs bg-bg-surface border border-border px-3 py-1.5 rounded-lg font-bold hover:text-[#c29631]">
              + Tambah Termin
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/50 text-[10px] uppercase text-text-secondary bg-bg-surface">
                <th className="p-4">Nama Termin</th>
                <th className="p-4">Jumlah</th>
                <th className="p-4">Jatuh Tempo</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} className="border-b border-gray-50">
                  <td className="p-4 font-bold">{pay.term_name}</td>
                  <td className="p-4">{formatCurrency(pay.amount)}</td>
                  <td className="p-4 text-text-secondary">{new Date(pay.due_date).toLocaleDateString('id-ID')}</td>
                  <td className="p-4 text-center">
                    {pay.status === 'paid' ? 
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold"><CheckCircle2 size={12}/> Lunas</span> :
                      <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-bold"><Clock size={12}/> Belum</span>
                    }
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setPaymentForm(pay); setIsEditingPayment(true); }} className="p-2 text-text-secondary/70 hover:text-[#c29631]"><Edit2 size={14}/></button>
                    <button onClick={async () => { if(await showConfirm('Hapus termin ini?')) { await deletePayment(pay.id); fetchData(); } }} className="p-2 text-text-secondary/70 hover:text-red-500"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-text-secondary/70">Belum ada termin.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
