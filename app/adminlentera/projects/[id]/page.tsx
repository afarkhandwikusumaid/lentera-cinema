'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProjects, getPayments, getExpenses, savePayment, saveExpense, deletePayment, deleteExpense, Project, ProjectPayment, Expense } from '@/lib/db';
import AdminLayout from '@/components/AdminLayout';
import { useParams } from 'next/navigation';
import ProjectHeader from '@/components/admin/projects/ProjectHeader';
import PaymentManager from '@/components/admin/projects/PaymentManager';
import ExpenseManager from '@/components/admin/projects/ExpenseManager';

export default function ProjectDetailAdmin() {
  const { id } = useParams();
  const projectId = id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'payments' | 'expenses'>('payments');
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState<Partial<ProjectPayment>>({});
  
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState<Partial<Expense>>({});

  const fetchData = useCallback(async () => {
    const projData = await getProjects();
    const proj = projData.find(p => p.id === projectId) || null;
    setProject(proj);

    const payData = await getPayments();
    setPayments(payData.filter(p => p.project_id === projectId));

    const expData = await getExpenses();
    setExpenses(expData.filter(e => e.project_id === projectId));

    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment: ProjectPayment = {
      id: paymentForm.id || 'pay-' + Date.now().toString(),
      project_id: projectId,
      term_name: paymentForm.term_name || '',
      amount: paymentForm.amount || 0,
      due_date: paymentForm.due_date || new Date().toISOString().split('T')[0],
      status: paymentForm.status || 'unpaid',
      created_at: paymentForm.created_at || new Date().toISOString(),
      paid_date: paymentForm.status === 'paid' ? (paymentForm.paid_date || new Date().toISOString().split('T')[0]) : undefined,
    };
    await savePayment(newPayment);
    setIsEditingPayment(false);
    fetchData();
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: expenseForm.id || 'exp-' + Date.now().toString(),
      project_id: projectId,
      description: expenseForm.description || '',
      amount: expenseForm.amount || 0,
      expense_date: expenseForm.expense_date || new Date().toISOString().split('T')[0],
      expense_type: 'project',
      created_at: expenseForm.created_at || new Date().toISOString(),
    };
    await saveExpense(newExpense);
    setIsEditingExpense(false);
    fetchData();
  };

  if (loading) return <AdminLayout><div className="p-10 text-text-secondary">Memuat data proyek...</div></AdminLayout>;
  if (!project) return <AdminLayout><div className="p-10 text-text-secondary">Proyek tidak ditemukan.</div></AdminLayout>;

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalPaid - totalExpense;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ProjectHeader 
          project={project}
          totalPaid={totalPaid}
          totalExpense={totalExpense}
          netProfit={netProfit}
          formatCurrency={formatCurrency}
        />

        <div className="flex gap-4 border-b border-border">
          <button onClick={() => setActiveTab('payments')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'payments' ? 'border-[#c29631] text-[#c29631]' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
            Termin Pembayaran
          </button>
          <button onClick={() => setActiveTab('expenses')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'expenses' ? 'border-[#c29631] text-[#c29631]' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
            Pengeluaran Proyek
          </button>
        </div>

        {activeTab === 'payments' && (
          <PaymentManager 
            payments={payments}
            isEditingPayment={isEditingPayment}
            paymentForm={paymentForm}
            setIsEditingPayment={setIsEditingPayment}
            setPaymentForm={setPaymentForm}
            handlePaymentSubmit={handlePaymentSubmit}
            fetchData={fetchData}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseManager 
            expenses={expenses}
            isEditingExpense={isEditingExpense}
            expenseForm={expenseForm}
            setIsEditingExpense={setIsEditingExpense}
            setExpenseForm={setExpenseForm}
            handleExpenseSubmit={handleExpenseSubmit}
            fetchData={fetchData}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </AdminLayout>
  );
}
