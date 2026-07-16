'use client';

import { useState, useEffect } from 'react';
import { getExpenses, saveExpense, deleteExpense, Expense } from '@/lib/db';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useModal } from '@/components/admin/ModalContext';

export default function ExpensesAdmin() {
  const { showAlert, showConfirm } = useModal();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Expense>>({});
  const fetchData = async () => {
    const data = await getExpenses();
    // Only show universal expenses here
    setExpenses(data.filter(e => e.expense_type === 'universal'));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleEdit = (expense: Expense) => {
    setFormData(expense);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (await showConfirm('Yakin ingin menghapus pengeluaran ini?')) {
      await deleteExpense(id);
      fetchData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: formData.id || 'exp-' + Date.now().toString(),
      description: formData.description || '',
      amount: formData.amount || 0,
      expense_date: formData.expense_date || new Date().toISOString().split('T')[0],
      expense_type: 'universal', // Always universal on this page
      project_id: 'universal',
      created_at: formData.created_at || new Date().toISOString()
    };
    
    await saveExpense(newExpense);
    setIsEditing(false);
    setFormData({});
    fetchData();
  };

  if (loading) return (
    <AdminLayout>
      <div className="p-10 text-gray-500">Memuat data...</div>
    </AdminLayout>
  );

  if (isEditing) {
    return (
      <AdminLayout>
      <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{formData.id ? 'Edit Pengeluaran' : 'Catat Pengeluaran'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Deskripsi Pengeluaran</label>
            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" 
                   value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} 
                   placeholder="Misal: Langganan Internet, Listrik, Beli Kamera Baru" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Jumlah (Rp)</label>
            <input required type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" 
                   value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseInt(e.target.value) || 0})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Tanggal</label>
            <input required type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm" 
                   value={formData.expense_date || ''} onChange={e => setFormData({...formData, expense_date: e.target.value})} />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="submit" className="bg-[#c29631] text-white px-4 py-2 rounded-lg text-sm font-bold">Simpan</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold">Batal</button>
          </div>
        </form>
      </div>
      </div>
      </AdminLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary mb-1">Pengeluaran Operasional (Universal)</h1>
          <p className="text-sm text-text-secondary">Catat pengeluaran perusahaan secara umum di luar proyek</p>
        </div>
        <button onClick={() => { setFormData({}); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl font-bold transition-colors self-start md:self-auto">
          <Plus className="h-4 w-4" /> Tambah Pengeluaran
        </button>
      </div>

      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Total Pengeluaran Universal</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalExpense)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              <th className="p-4">Deskripsi Pengeluaran</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Jumlah</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900 text-sm">{expense.description}</td>
                <td className="p-4 text-gray-600 text-sm">{new Date(expense.expense_date).toLocaleDateString('id-ID')}</td>
                <td className="p-4 font-semibold text-red-600 text-sm">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <button onClick={() => handleEdit(expense)} className="p-2 text-gray-400 bg-white rounded-lg border border-gray-100"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(expense.id)} className="p-2 text-gray-400 bg-white rounded-lg border border-gray-100"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">Belum ada pengeluaran dicatat.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </AdminLayout>
  );
}
