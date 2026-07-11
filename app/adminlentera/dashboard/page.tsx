'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ClipboardList, Clock, CheckCircle2, DollarSign, Users, AlertCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { getBookings, getServices, getPackages, Booking, Service, Package } from '@/lib/db';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  async function loadData() {
    try {
      const b = await getBookings();
      setBookings(b);
      const s = await getServices();
      setServices(s);
      const p = await getPackages();
      setPackages(p);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Compute Stats
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  const estimatedRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => {
      const pkg = packages.find(p => p.id === b.package_id);
      return sum + (pkg ? pkg.price : 0);
    }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get service distribution for simple charts
  const getCategoryCount = (serviceId: string) => {
    return bookings.filter(b => b.service_id === serviceId).length;
  };

  // Simple calendar scheduling highlights (current month)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day of week (0-6)

  const calendarDays = [];
  // Fill leading empty days
  for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex - 1); i++) {
    calendarDays.push(null);
  }
  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const getBookingsOnDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return bookings.filter(b => b.event_date === dateStr && b.status !== 'cancelled');
  };

  // Filter next 7 days bookings
  const upcomingEvents = bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">Ringkasan operasional dan jadwal Lentera Cinema.</p>
          </div>
          <div className="text-sm bg-bg-surface px-4 py-2 rounded-xl border border-border text-text-secondary">
            Hari Ini: <span className="font-semibold text-text-primary">{today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Revenue */}
          <div className="p-6 rounded-2xl bg-bg-surface border border-border flex items-center justify-between overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-accent-primary opacity-0 transition-opacity" />
            <div className="space-y-2">
              <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Estimasi Revenue</p>
              <h3 className="text-2xl font-bold font-heading">{formatCurrency(estimatedRevenue)}</h3>
              <p className="text-[10px] text-text-secondary">Dari Confirmed & Completed</p>
            </div>
            <div className="p-4 rounded-xl bg-accent-primary/10 text-accent-primary">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Confirmed */}
          <div className="p-6 rounded-2xl bg-bg-surface border border-border flex items-center justify-between overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-success opacity-0 transition-opacity" />
            <div className="space-y-2">
              <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Confirmed Booking</p>
              <h3 className="text-2xl font-bold font-heading">{confirmedCount}</h3>
              <p className="text-[10px] text-success">Jadwal acara terkonfirmasi</p>
            </div>
            <div className="p-4 rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="p-6 rounded-2xl bg-bg-surface border border-border flex items-center justify-between overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-warning opacity-0 transition-opacity" />
            <div className="space-y-2">
              <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Pending Form</p>
              <h3 className="text-2xl font-bold font-heading">{pendingCount}</h3>
              <p className="text-[10px] text-warning">Menunggu verifikasi admin</p>
            </div>
            <div className="p-4 rounded-xl bg-warning/10 text-warning">
              <Clock className="h-6 w-6" />
            </div>
          </div>

          {/* Card 4: Total Bookings */}
          <div className="p-6 rounded-2xl bg-bg-surface border border-border flex items-center justify-between overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-accent-secondary opacity-0 transition-opacity" />
            <div className="space-y-2">
              <p className="text-xs text-text-secondary uppercase tracking-widest font-semibold">Total Booking</p>
              <h3 className="text-2xl font-bold font-heading">{totalCount}</h3>
              <p className="text-[10px] text-text-secondary">Akumulasi seluruh booking</p>
            </div>
            <div className="p-4 rounded-xl bg-accent-secondary/10 text-accent-secondary">
              <ClipboardList className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Schedules (Left, 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-bg-surface border border-border space-y-6">
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-accent-primary" />
                  Jadwal Terdekat (7 Hari Depan)
                </h3>
                <span className="text-xs text-text-secondary">{upcomingEvents.length} Acara Terkunci</span>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Tidak ada acara terkonfirmasi dalam waktu dekat.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {upcomingEvents.map((event) => {
                    const srv = services.find(s => s.id === event.service_id);
                    const pkg = packages.find(p => p.id === event.package_id);
                    return (
                      <div key={event.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-text-primary">{event.client_name}</span>
                            <span className="text-[10px] bg-bg-elevated px-2 py-0.5 rounded border border-border text-accent-primary font-bold">
                              {event.booking_code}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary">
                            {srv?.name.split(' (')[0]} &bull; {pkg?.name}
                          </p>
                          <p className="text-xs text-text-secondary flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" /> {event.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-bg-elevated rounded-lg border border-border text-xs font-semibold text-text-primary">
                            {new Date(event.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Analytics Summary */}
            <div className="p-6 rounded-2xl bg-bg-surface border border-border space-y-6">
              <h3 className="text-lg font-bold font-heading">Distribusi Layanan</h3>
              <div className="space-y-4">
                {services.map((srv) => {
                  const count = getCategoryCount(srv.id);
                  const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
                  return (
                    <div key={srv.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-text-primary">{srv.name.split(' (')[0]}</span>
                        <span className="text-text-secondary">{count} Booking ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="h-2 w-full bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-primary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Calendar Heatmap Widget (Right, 1 col) */}
          <div className="p-6 rounded-2xl bg-bg-surface border border-border space-y-6">
            <div className="border-b border-border/50 pb-4">
              <h3 className="text-lg font-bold font-heading text-center">
                Kalender Jadwal ({monthNames[month]} {year})
              </h3>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-text-secondary uppercase">
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
              <span>Min</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="py-2" />;
                }

                const dayBookings = getBookingsOnDay(day);
                const hasPending = dayBookings.some(b => b.status === 'pending');
                const hasConfirmed = dayBookings.some(b => b.status === 'confirmed');
                const hasConflict = dayBookings.filter(b => b.status === 'confirmed').length > 1;

                let dayBg = 'text-text-secondary';
                if (hasConflict) {
                  dayBg = 'bg-danger text-white border border-danger font-bold ring-2 ring-danger/40';
                } else if (hasConfirmed) {
                  dayBg = 'bg-success/20 text-success border border-success/40 font-bold';
                } else if (hasPending) {
                  dayBg = 'bg-warning/20 text-warning border border-warning/40';
                }

                return (
                  <div
                    key={`day-${day}`}
                    className={`py-2 rounded-lg cursor-pointer transition-colors relative group ${dayBg}`}
                    title={dayBookings.length > 0 ? `${dayBookings.length} booking` : 'Jadwal kosong'}
                  >
                    <span>{day}</span>
                    {dayBookings.length > 0 && (
                      <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        hasConflict ? 'bg-white' : hasConfirmed ? 'bg-success' : 'bg-warning'
                      }`} />
                    )}

                    {/* Popover on hover */}
                    {dayBookings.length > 0 && (
                      <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 p-4 rounded-xl bg-white border border-gray-200 shadow-2xl text-left z-50">
                        <div className="font-bold border-b border-gray-100 pb-2 mb-2 text-gray-900 text-[11px] uppercase tracking-wider">
                          Jadwal: {day} {monthNames[month]} {year}
                        </div>
                        <div className="space-y-2">
                          {dayBookings.map((b) => (
                            <div key={b.id} className="flex flex-col gap-0.5">
                              <p className="font-semibold text-gray-800 text-xs truncate">
                                <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${
                                  b.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'
                                }`} />
                                {b.client_name}
                              </p>
                              <p className="text-[10px] text-gray-500 ml-3 truncate">ID: {b.booking_code}</p>
                            </div>
                          ))}
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="pt-4 border-t border-border/50 text-[10px] text-text-secondary space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-success/20 border border-success/40" />
                <span>Acara Terkonfirmasi (Confirmed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-warning/20 border border-warning/40" />
                <span>Menunggu Konfirmasi (Pending)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-danger text-white" />
                <span>Bentrok Jadwal (Lebih dari 1 acara confirmed!)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
