'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { getProjects, getPayments, getExpenses, Project, ProjectPayment, Expense } from '@/lib/db';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import UpcomingSchedules from '@/components/admin/dashboard/UpcomingSchedules';
import ServiceDistribution from '@/components/admin/dashboard/ServiceDistribution';
import CalendarWidget from '@/components/admin/dashboard/CalendarWidget';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    setIsLoading(true);
    try {
      const pr = await getProjects();
      setProjects(pr);
      const pa = await getPayments();
      setPayments(pa);
      const ex = await getExpenses();
      setExpenses(ex);
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const estimatedRevenue = projects.reduce((sum, p) => sum + p.total_value, 0);
  const collectedFunds = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = collectedFunds - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const actualFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const calendarDays = [];
  for (let i = 0; i < actualFirstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const upcomingEvents = projects.filter(p => p.status === 'active').slice(0, 5);

  const stats = [
    { title: "Estimasi Pendapatan", value: formatCurrency(estimatedRevenue), subtitle: "Total Nilai Seluruh Proyek", icon: DollarSign, color: "text-accent-primary", bg: "bg-accent-primary/10", border: "bg-accent-primary", gradient: "from-accent-primary/5" },
    { title: "Dana Terkumpul", value: formatCurrency(collectedFunds), subtitle: "Pembayaran yang sudah lunas", icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "bg-success", gradient: "from-success/5" },
    { title: "Biaya Operasional", value: formatCurrency(totalExpenses), subtitle: "Pengeluaran Proyek & Universal", icon: AlertCircle, color: "text-danger", bg: "bg-danger/10", border: "bg-danger", gradient: "from-danger/5" },
    { title: "Profit Kotor", value: formatCurrency(grossProfit), subtitle: "Dana Terkumpul - Operasional", icon: TrendingUp, color: "text-accent-secondary", bg: "bg-accent-secondary/10", border: "bg-accent-secondary", gradient: "from-accent-secondary/5" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <DashboardHeader today={today} />
        <StatsGrid stats={stats} isLoading={isLoading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UpcomingSchedules upcomingEvents={upcomingEvents} isLoading={isLoading} formatCurrency={formatCurrency} />
            <ServiceDistribution projects={projects} isLoading={isLoading} />
          </div>
          <CalendarWidget today={today} monthNames={monthNames} month={month} year={year} calendarDays={calendarDays} />
        </div>
      </div>
    </AdminLayout>
  );
}
