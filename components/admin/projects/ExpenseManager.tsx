import { Expense, deleteExpense } from '@/lib/db';
import { Edit2, Trash2 } from 'lucide-react';

export default function ExpenseManager({
  expenses,
  isEditingExpense,
  expenseForm,
  setIsEditingExpense,
  setExpenseForm,
  handleExpenseSubmit,
  fetchData,
  formatCurrency
}: {
  expenses: Expense[];
  isEditingExpense: boolean;
  expenseForm: Partial<Expense>;
  setIsEditingExpense: (v: boolean) => void;
  setExpenseForm: (e: Partial<Expense>) => void;
  handleExpenseSubmit: (e: React.FormEvent) => void;
  fetchData: () => void;
  formatCurrency: (amount: number) => string;
}) {
  return (
    <div className="space-y-4">
      {isEditingExpense ? (
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="font-bold mb-4">{expenseForm.id ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Proyek'}</h2>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Deskripsi Pengeluaran</label>
              <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={expenseForm.description || ''} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} placeholder="Misal: Bensin Tim / Makan Siang" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Jumlah (Rp)</label>
              <input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={expenseForm.amount || ''} onChange={e => setExpenseForm({...expenseForm, amount: parseInt(e.target.value) || 0})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Tanggal</label>
              <input required type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" value={expenseForm.expense_date || ''} onChange={e => setExpenseForm({...expenseForm, expense_date: e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#c29631] text-white px-4 py-2 rounded-lg text-sm font-bold">Simpan</button>
              <button type="button" onClick={() => setIsEditingExpense(false)} className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold">Batal</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-sm">Daftar Pengeluaran Tim</h3>
            <button onClick={() => { setExpenseForm({}); setIsEditingExpense(true); }} className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold hover:text-[#c29631]">
              + Tambah Pengeluaran
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase text-gray-500 bg-white">
                <th className="p-4">Deskripsi</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Jumlah</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} className="border-b border-gray-50">
                  <td className="p-4 font-bold">{exp.description}</td>
                  <td className="p-4 text-gray-500">{new Date(exp.expense_date).toLocaleDateString('id-ID')}</td>
                  <td className="p-4 text-red-500 font-semibold">{formatCurrency(exp.amount)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setExpenseForm(exp); setIsEditingExpense(true); }} className="p-2 text-gray-400 hover:text-[#c29631]"><Edit2 size={14}/></button>
                    <button onClick={async () => { if(confirm('Hapus pengeluaran ini?')) { await deleteExpense(exp.id); fetchData(); } }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada pengeluaran dicatat.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
