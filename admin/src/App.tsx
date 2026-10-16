import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BriefcaseMedical,
  CalendarClock,
  ChevronDown,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, dateLabel, shiftDate, useAppContext } from './context/AppContext';
import {
  balanceChipClass,
  chairs,
  formatCurrency,
  getPatientAge,
  getTreatmentProgress,
  localDateKey,
  normalizePhone,
  quickSearchOptions,
  statusChipClass,
  toShortDate,
} from './data/mockData';
import type { Appointment, Patient, PatientStatus, TreatmentArea } from './types';

const navItems = [
  { label: 'Overview', to: '/overview' },
  { label: 'Patient Directory', to: '/patients' },
  { label: 'Clinic Settings', to: '/settings' },
];

const statusMeta: Record<Appointment['status'], { label: string; className: string; tone: string }> = {
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700', tone: 'bg-emerald-500' },
  'in-chair': { label: 'In Chair', className: 'bg-blue-100 text-blue-700', tone: 'bg-blue-500' },
  'checked-in': { label: 'Checked-in', className: 'bg-amber-100 text-amber-700', tone: 'bg-amber-500' },
  confirmed: { label: 'Confirmed', className: 'bg-violet-100 text-violet-700', tone: 'bg-violet-500' },
  open: { label: 'Open Slot', className: 'border border-dashed border-sky-300 bg-sky-50 text-sky-700', tone: 'bg-sky-200' },
  buffer: { label: 'Buffer', className: 'bg-slate-200 text-slate-700', tone: 'bg-slate-400' },
  blocked: { label: 'Blocked', className: 'bg-zinc-200 text-zinc-600', tone: 'bg-zinc-400' },
};

const timeToInputValue = (value: string) => {
  const match = value.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);
  if (!match) return '';
  let hours = Number(match[1]) % 12;
  if (match[3] === 'PM') hours += 12;
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
};

const inputValueToTime = (value: string) => {
  const [hourValue, minuteValue] = value.split(':').map(Number);
  const suffix = hourValue >= 12 ? 'PM' : 'AM';
  const hours = hourValue % 12 || 12;
  return `${String(hours).padStart(2, '0')}:${String(minuteValue).padStart(2, '0')} ${suffix}`;
};

const timeToMinutes = (value: string) => {
  const [time, suffix] = value.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  return ((hours % 12) + (suffix === 'PM' ? 12 : 0)) * 60 + minutes;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

function AppRoutes() {
  const { isLoggedIn } = useAppContext();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to="/overview" replace /> : <LoginPage />} />
      <Route path="/overview" element={<ProtectedRoute><DashboardLayout currentPage="Overview"><OverviewPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><DashboardLayout currentPage="Patient Directory"><PatientDirectoryPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><DashboardLayout currentPage="Clinic Settings"><SettingsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/appointments" element={<Navigate to="/overview" replace />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? '/overview' : '/login'} replace />} />
    </Routes>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAppContext();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Both username and password are required.');
      return;
    }

    const ok = login(username, password, rememberMe);
    if (!ok) {
      setError('Please enter valid credentials.');
      return;
    }

    setError('');
    navigate('/overview', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(116,201,238,0.35),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(250,214,118,0.3),_transparent_25%),linear-gradient(135deg,#edf7fb_0%,#f7f9fc_42%,#f6f1d8_100%)] px-4 py-8">
      <div className="w-full max-w-[520px]">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow-sm ring-1 ring-blue-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="text-left">
            <div className="text-[1.5rem] font-black leading-none tracking-tight text-blue-800">MolarCoaster</div>
            <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-blue-800/75">Dental Clinic</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[20px] border border-blue-100 bg-white/80 p-6 shadow-[0_16px_40px_rgba(21,101,192,0.10)] backdrop-blur-sm md:p-8">
          <h1 className="text-center text-[2.15rem] font-extrabold text-blue-800">Hello, Welcome Admin!</h1>

          <div className="mt-7 space-y-5">
            <div>
              <label htmlFor="admin-username" className="mb-2 block text-sm font-semibold text-slate-700">
                Username<span className="text-red-500">*</span>
              </label>
              <input
                id="admin-username"
                name="username"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-blue-200 bg-slate-50 px-3 py-3 text-base text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-blue-200 bg-slate-50 px-3 py-3 pr-12 text-base text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-blue-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
              Remember me
            </label>

            {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <button type="submit" className="mt-3 w-full rounded-full bg-[#1565C0] px-4 py-3 text-lg font-semibold text-white shadow-[0_10px_25px_rgba(21,101,192,0.3)] transition hover:bg-[#0e4fa8]">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DashboardLayout({ currentPage, children }: { currentPage: string; children: ReactNode }) {
  const { logout, user, settings } = useAppContext();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const manilaParts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date()).map((part) => [part.type, part.value]));
  const todayHours = settings.operatingHours[manilaParts.weekday];
  const currentMinutes = Number(manilaParts.hour) * 60 + Number(manilaParts.minute);
  const clinicOpen = Boolean(todayHours?.enabled)
    && currentMinutes >= timeToMinutes(todayHours.start)
    && currentMinutes < timeToMinutes(todayHours.end);

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800">
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 xl:px-6">
          <button type="button" onClick={() => navigate('/overview')} aria-label="MolarCoaster overview" className="flex items-center gap-3 border-0 bg-transparent p-0 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[1.3rem] font-bold tracking-tight text-slate-800">MolarCoaster</div>
              <div className="text-[0.7rem] uppercase tracking-[0.14em] text-slate-500">Dental Clinic Admin</div>
            </div>
          </button>

          <nav id="dashboard-navigation" aria-label="Dashboard navigation" className={`${mobileNavOpen ? 'flex' : 'hidden'} w-full flex-col items-stretch gap-2 lg:flex lg:w-auto lg:flex-row lg:items-center`}>
            {navItems.map((item) => {
              const active = item.label === currentPage;
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => { navigate(item.to); setMobileNavOpen(false); }}
                  className={[
                    'rounded-xl px-4 py-2 text-sm font-medium transition',
                    active ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-600 hover:bg-slate-100',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/overview')} className="hidden rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 sm:inline-flex">
              Book New Appointment
            </button>
            <span aria-label={clinicOpen ? 'Clinic Open' : 'Clinic Closed'} className={['hidden rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex', clinicOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'].join(' ')}>
              {clinicOpen ? 'Clinic Open' : 'Clinic Closed'}
            </span>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm">
              <Bell className="h-4 w-4 text-slate-500" />
              <span className="hidden font-medium text-slate-700 sm:inline">{user.name}</span>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100" aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
              aria-controls="dashboard-navigation"
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 xl:px-6">{children}</main>
    </div>
  );
}

function OverviewPage() {
  const { appointments, selectedDate, setSelectedDate, settings, changeAppointmentStatus } = useAppContext();

  const filteredAppointments = appointments.filter((appointment) => appointment.date === selectedDate);
  const chairsInDay = chairs.map((chair) => ({
    ...chair,
    appointments: filteredAppointments.filter((appointment) => appointment.chairId === chair.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Overview</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Clinic overview</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setSelectedDate(shiftDate(selectedDate, -1))} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{dateLabel(selectedDate)}</div>
          <button onClick={() => setSelectedDate(shiftDate(selectedDate, 1))} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Next <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => setSelectedDate(localDateKey())} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Today</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_380px]">
        <div className="space-y-5">
          {chairsInDay.map((chair) => (
            <div key={chair.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Chair</div>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{chair.name}</h2>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{chair.specialty}</div>
              </div>

              <div className="space-y-3">
                {chair.appointments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
                    No appointments scheduled in this chair.
                  </div>
                ) : (
                  chair.appointments.map((appointment) => (
                    <div key={appointment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-slate-900">{appointment.patient}</div>
                            <span className={['rounded-full px-2 py-1 text-[11px] font-semibold', statusMeta[appointment.status].className].join(' ')}>
                              {statusMeta[appointment.status].label}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {appointment.time}</span>
                            <span className="inline-flex items-center gap-1"><Stethoscope className="h-4 w-4" /> {appointment.treatment}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Edit</button>
                          {appointment.status === 'confirmed' ? <button type="button" onClick={() => changeAppointmentStatus(appointment.id, 'checked-in')} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Check-in</button> : null}
                          {appointment.status === 'checked-in' ? <button type="button" onClick={() => changeAppointmentStatus(appointment.id, 'in-chair')} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">Start</button> : null}
                          {appointment.status === 'in-chair' ? <button type="button" onClick={() => changeAppointmentStatus(appointment.id, 'completed')} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100">Complete</button> : null}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-5">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Quick Search</h3>
              <button className="rounded-full bg-slate-100 p-2 text-slate-600"><Search className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickSearchOptions.map((item) => (
                <button key={item} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
            <h3 className="text-lg font-bold text-slate-900">Today’s waitlist</h3>
            <div className="mt-4 space-y-3">
              {appointments.filter((appointment) => appointment.status === 'buffer' || appointment.status === 'open').slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <div>
                    <div className="font-semibold text-slate-800">{appointment.patient}</div>
                    <div className="text-xs text-slate-500">{appointment.treatment}</div>
                  </div>
                  <span className={['rounded-full px-2 py-1 text-[10px] font-semibold', statusMeta[appointment.status].className].join(' ')}>
                    {statusMeta[appointment.status].label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
            <h3 className="text-lg font-bold text-slate-900">Practice details</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2"><BriefcaseMedical className="h-4 w-4 text-blue-600" /> {settings.practiceName}</div>
              <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-blue-600" /> Monday–Saturday, 8:30 AM–6:00 PM</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PatientDirectoryPage() {
  const { patients, selectedPatientId, setSelectedPatientId, addPatient, updatePatient, removePatients, updatePatientNotes, recordPayment, toggleTreatmentStep } = useAppContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PatientStatus>('all');
  const [areaFilter, setAreaFilter] = useState<'all' | TreatmentArea>('all');
  const [practitionerFilter, setPractitionerFilter] = useState<'all' | Patient['primaryPractitioner']>('all');
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'overdue' | 'paid'>('all');
  const [sortOrder, setSortOrder] = useState<'name' | 'balance' | 'nextAppt'>('name');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const patientList = useMemo(() => {
    const filtered = patients.filter((patient) => {
      const query = search.trim().toLowerCase();
      const normalizedPhoneQuery = normalizePhone(search);
      const matchesQuery =
        !query ||
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        (normalizedPhoneQuery.length > 0 && normalizePhone(patient.phone).includes(normalizedPhoneQuery)) ||
        patient.email.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      const matchesArea = areaFilter === 'all' || patient.treatmentArea === areaFilter;
      const matchesPractitioner = practitionerFilter === 'all' || patient.primaryPractitioner === practitionerFilter;
      const matchesBalance = balanceFilter === 'all' || (balanceFilter === 'overdue' ? patient.balance > 0 : patient.balance <= 0);
      return matchesQuery && matchesStatus && matchesArea && matchesPractitioner && matchesBalance;
    });

    return [...filtered].sort((left, right) => {
      if (sortOrder === 'balance') return right.balance - left.balance;
      if (sortOrder === 'nextAppt') return new Date(left.nextApptDate).getTime() - new Date(right.nextApptDate).getTime();
      return `${left.lastName} ${left.firstName}`.localeCompare(`${right.lastName} ${right.firstName}`);
    });
  }, [areaFilter, balanceFilter, patients, practitionerFilter, search, sortOrder, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(patientList.length / pageSize));
  const visiblePatients = patientList.slice((page - 1) * pageSize, page * pageSize);
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patientList[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Patients</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Patient Directory</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => searchInputRef.current?.focus()} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              <Search className="h-4 w-4" /> Search
            </button>
            <button onClick={() => setShowAddPatient(true)} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              <Plus className="h-4 w-4" /> New patient
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              aria-label="Search patients by name, ID, phone, or email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search patient, phone, or email"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select aria-label="Filter by patient status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as 'all' | PatientStatus); setPage(1); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
              <option value="all">All status</option>
              <option value="Active">Active</option>
              <option value="In Chair">In Chair</option>
              <option value="Hygiene Due">Hygiene Due</option>
              <option value="Inactive">Inactive</option>
              <option value="Complete">Complete</option>
            </select>

            <select aria-label="Filter by treatment area" value={areaFilter} onChange={(event) => { setAreaFilter(event.target.value as 'all' | TreatmentArea); setPage(1); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
              <option value="all">All areas</option>
              <option value="Periodontal">Periodontal</option>
              <option value="Orthodontic">Orthodontic</option>
              <option value="Surgical">Surgical</option>
              <option value="Hygiene">Hygiene</option>
              <option value="Restorative">Restorative</option>
            </select>

            <select aria-label="Filter by practitioner" value={practitionerFilter} onChange={(event) => { setPractitionerFilter(event.target.value as 'all' | Patient['primaryPractitioner']); setPage(1); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
              <option value="all">All practitioners</option>
              <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
              <option value="Dr. Paolo Reyes">Dr. Paolo Reyes</option>
            </select>

            <select aria-label="Filter by balance" value={balanceFilter} onChange={(event) => { setBalanceFilter(event.target.value as 'all' | 'overdue' | 'paid'); setPage(1); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
              <option value="all">All balances</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
            </select>

            <select aria-label="Sort patients" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'name' | 'balance' | 'nextAppt')} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
              <option value="name">Name</option>
              <option value="balance">Balance</option>
              <option value="nextAppt">Next appointment</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <div className="min-w-0 rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Users className="h-4 w-4 text-indigo-600" /> {patientList.length} patients</div>
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{selectedIds.length} selected</span>
                <button
                  onClick={() => {
                    if (window.confirm(`Remove ${selectedIds.length} selected patient record(s)?`)) {
                      removePatients(selectedIds);
                      setSelectedIds([]);
                    }
                  }}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                >Remove</button>
              </div>
            ) : null}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all patients on this page"
                      onChange={() => {
                        const visibleIds = visiblePatients.map((patient) => patient.id);
                        const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));
                        setSelectedIds(allVisibleSelected
                          ? selectedIds.filter((id) => !visibleIds.includes(id))
                          : [...new Set([...selectedIds, ...visibleIds])]);
                      }}
                      checked={visiblePatients.length > 0 && visiblePatients.every((patient) => selectedIds.includes(patient.id))}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />
                  </th>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Balance</th>
                  <th className="px-5 py-3">Next visit</th>
                  <th className="px-5 py-3">Practitioner</th>
                </tr>
              </thead>
              <tbody>
                {visiblePatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={['cursor-pointer border-b border-slate-100 transition hover:bg-slate-50', patient.id === selectedPatient?.id ? 'bg-indigo-50/60' : ''].join(' ')}
                  >
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${patient.firstName} ${patient.lastName}`}
                        checked={selectedIds.includes(patient.id)}
                        onChange={(event) => {
                          const next = event.target.checked ? [...selectedIds, patient.id] : selectedIds.filter((id) => id !== patient.id);
                          setSelectedIds(next);
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                          {patient.firstName.slice(0, 1)}{patient.lastName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="break-all font-semibold text-slate-800">{patient.firstName} {patient.lastName}</div>
                          <div className="text-xs text-slate-500">{patient.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className={['rounded-full px-2.5 py-1 text-[11px] font-semibold', statusChipClass[patient.status]].join(' ')}>{patient.status}</span></td>
                    <td className="px-5 py-4"><span className={['rounded-full px-2.5 py-1 text-[11px] font-semibold', balanceChipClass[patient.balance > 0 ? 'Overdue' : 'Paid']].join(' ')}>{patient.balance > 0 ? `${formatCurrency(patient.balance)} · Overdue` : 'Paid'}</span></td>
                    <td className="px-5 py-4 text-sm text-slate-600">{toShortDate(patient.nextApptDate)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{patient.primaryPractitioner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40">Previous</button>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <label htmlFor="patient-page-size">Rows</label>
              <select id="patient-page-size" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>Page {page} of {totalPages}</span>
            </div>
            <button disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40">Next</button>
          </div>
        </div>

        <aside className="min-w-0 space-y-5">
          {selectedPatient ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
                    {selectedPatient.firstName.slice(0, 1)}{selectedPatient.lastName.slice(0, 1)}
                  </div>
                  <div>
                        <h2 className="min-w-0 break-all text-2xl font-black text-slate-900">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                      <span>{selectedPatient.gender}</span>
                      <span>•</span>
                      <span>{getPatientAge(selectedPatient.dob)} years</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setPatientToEdit(selectedPatient)} aria-label="Edit patient record" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600"><Pencil className="h-4 w-4" /></button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Phone</div><div className="mt-1 font-semibold text-slate-800">{selectedPatient.phone}</div></div>
                <div className="rounded-2xl bg-slate-50 p-3"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</div><div className="mt-1 font-semibold text-slate-800">{selectedPatient.email}</div></div>
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-indigo-700">Treatment progress</div>
                    <div className="mt-1 text-2xl font-black text-slate-900">{getTreatmentProgress(selectedPatient.treatmentSteps)}%</div>
                  </div>
                  <span className={['rounded-full px-2.5 py-1 text-[11px] font-semibold', statusChipClass[selectedPatient.status]].join(' ')}>{selectedPatient.status}</span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-slate-200"><div className="h-2.5 rounded-full bg-indigo-600" style={{ width: `${getTreatmentProgress(selectedPatient.treatmentSteps)}%` }} /></div>
                <div className="mt-4 space-y-2">
                  {selectedPatient.treatmentSteps.map((step) => (
                    <button key={step.id} onClick={() => toggleTreatmentStep(selectedPatient.id, step.id)} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700">
                      <span>{step.label}</span>
                      <span className={['rounded-full px-2 py-1 text-[10px] font-semibold', step.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : step.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'].join(' ')}>{step.status}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div className="text-sm text-slate-600">Next appointment</div><div className="font-semibold text-slate-800">{toShortDate(selectedPatient.nextApptDate)}</div></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"><div className="text-sm text-slate-600">Outstanding balance</div><div className="font-semibold text-slate-800">{selectedPatient.balance > 0 ? formatCurrency(selectedPatient.balance) : 'Paid'}</div></div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => {
                  const amount = Number(window.prompt('Record payment amount', '1000') ?? 0);
                  if (amount > 0 && !recordPayment(selectedPatient.id, amount, 'Payment recorded')) {
                    window.alert('Payment cannot exceed the outstanding balance.');
                  }
                }} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  <CreditCard className="h-4 w-4" /> Record payment
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  <CalendarClock className="h-4 w-4" /> Book visit
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><FileText className="h-4 w-4" /> Clinical notes</div>
                <textarea aria-label={`Clinical notes for ${selectedPatient.firstName} ${selectedPatient.lastName}`} value={selectedPatient.notes} onChange={(event) => updatePatientNotes(selectedPatient.id, event.target.value)} rows={5} className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between"><div className="text-sm font-semibold text-slate-700">Ledger</div><div className="text-xs uppercase tracking-[0.14em] text-slate-500">Recent</div></div>
                <div className="mt-3 space-y-2">
                  {selectedPatient.ledger.slice(-3).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                      <div>
                        <div className="font-medium text-slate-700">{entry.description}</div>
                        <div className="text-xs text-slate-500">{toShortDate(entry.date)}</div>
                      </div>
                      <div className={['font-semibold', entry.amount < 0 ? 'text-emerald-600' : 'text-slate-800'].join(' ')}>
                        {entry.amount < 0 ? `-${formatCurrency(Math.abs(entry.amount))}` : formatCurrency(entry.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {showAddPatient ? <AddPatientModal onClose={() => setShowAddPatient(false)} onSubmit={(patient) => { addPatient(patient); setShowAddPatient(false); }} /> : null}
      {patientToEdit ? <AddPatientModal key={patientToEdit.id} patientToEdit={patientToEdit} onClose={() => setPatientToEdit(null)} onSubmit={(updates) => { updatePatient(patientToEdit.id, updates); setPatientToEdit(null); }} /> : null}
    </div>
  );
}

function AddPatientModal({ onClose, onSubmit, patientToEdit }: { onClose: () => void; onSubmit: (patient: Partial<Patient>) => void; patientToEdit?: Patient }) {
  const [form, setForm] = useState<Partial<Patient>>(() => patientToEdit ?? ({
    firstName: '',
    lastName: '',
    dob: '2000-01-01',
    gender: 'Female',
    phone: '',
    email: '',
    primaryPractitioner: 'Dr. Sarah Jenkins',
    status: 'Active',
    treatmentArea: 'Hygiene',
    balance: 0,
    notes: '',
  }));

  const updateField = (key: keyof Patient, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="new-patient-title" className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">{patientToEdit ? 'Edit patient' : 'Add patient'}</p>
            <h3 id="new-patient-title" className="mt-2 text-2xl font-black text-slate-900">{patientToEdit ? 'Edit patient record' : 'New patient record'}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close new patient form" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600"><X className="h-4 w-4" /></button>
        </div>

        <form className="mt-5" onSubmit={(event) => { event.preventDefault(); onSubmit(form); }}>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label htmlFor="new-patient-first-name" className="mb-1 block text-sm font-medium">First name</label><input id="new-patient-first-name" name="firstName" autoComplete="given-name" required value={form.firstName ?? ''} onChange={(event) => updateField('firstName', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" /></div>
            <div><label htmlFor="new-patient-last-name" className="mb-1 block text-sm font-medium">Last name</label><input id="new-patient-last-name" name="lastName" autoComplete="family-name" required value={form.lastName ?? ''} onChange={(event) => updateField('lastName', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" /></div>
            <div><label htmlFor="new-patient-dob" className="mb-1 block text-sm font-medium">Date of birth</label><input id="new-patient-dob" name="dob" type="date" max={localDateKey()} required value={form.dob ?? ''} onChange={(event) => updateField('dob', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" /></div>
            <div><label htmlFor="new-patient-gender" className="mb-1 block text-sm font-medium">Gender</label><select id="new-patient-gender" value={form.gender ?? 'Female'} onChange={(event) => updateField('gender', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
              <option value="Female">Female</option><option value="Male">Male</option><option value="Non-binary">Non-binary</option>
            </select></div>
            <div><label htmlFor="new-patient-phone" className="mb-1 block text-sm font-medium">Phone number</label><input id="new-patient-phone" name="phone" type="tel" autoComplete="tel" pattern="\+?[0-9]{7,15}" title="Enter 7 to 15 digits, optionally prefixed by +." required value={form.phone ?? ''} onChange={(event) => updateField('phone', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" /></div>
            <div><label htmlFor="new-patient-email" className="mb-1 block text-sm font-medium">Email address</label><input id="new-patient-email" name="email" type="email" autoComplete="email" required value={form.email ?? ''} onChange={(event) => updateField('email', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" /></div>
            <div><label htmlFor="new-patient-practitioner" className="mb-1 block text-sm font-medium">Primary practitioner</label><select id="new-patient-practitioner" value={form.primaryPractitioner ?? 'Dr. Sarah Jenkins'} onChange={(event) => updateField('primaryPractitioner', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
              <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option><option value="Dr. Paolo Reyes">Dr. Paolo Reyes</option>
            </select></div>
            <div><label htmlFor="new-patient-status" className="mb-1 block text-sm font-medium">Status</label><select id="new-patient-status" value={form.status ?? 'Active'} onChange={(event) => updateField('status', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
              <option value="Active">Active</option><option value="In Chair">In Chair</option><option value="Hygiene Due">Hygiene Due</option><option value="Inactive">Inactive</option><option value="Complete">Complete</option>
            </select></div>
            <div className="md:col-span-2"><label htmlFor="new-patient-area" className="mb-1 block text-sm font-medium">Treatment area</label><select id="new-patient-area" value={form.treatmentArea ?? 'Hygiene'} onChange={(event) => updateField('treatmentArea', event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
              <option value="Hygiene">Hygiene</option><option value="Periodontal">Periodontal</option><option value="Orthodontic">Orthodontic</option><option value="Surgical">Surgical</option><option value="Restorative">Restorative</option>
            </select></div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
            <button type="submit" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">{patientToEdit ? 'Save patient' : 'Create patient'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { settings, updateSettings } = useAppContext();
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);
  const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(settings);
  const invalidOperatingHours = Object.values(draft.operatingHours).some((hours) =>
    hours.enabled && timeToMinutes(hours.start) >= timeToMinutes(hours.end),
  );
  const updateDraft = (updates: Partial<typeof draft>) => {
    setDraft((current) => ({ ...current, ...updates }));
    setSaved(false);
  };
  const updateOperatingHours = (day: string, updates: Partial<(typeof draft.operatingHours)[string]>) => {
    setDraft((current) => ({
      ...current,
      operatingHours: {
        ...current.operatingHours,
        [day]: { ...current.operatingHours[day], ...updates },
      },
    }));
    setSaved(false);
  };
  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (invalidOperatingHours) return;
    updateSettings(draft);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Clinic settings</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Practice profile</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px]">
        <form id="clinic-settings-form" onSubmit={saveSettings} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
          <div className="space-y-5">
            <div>
              <label htmlFor="settings-practice-name" className="mb-2 block text-sm font-semibold text-slate-700">Practice name</label>
              <input id="settings-practice-name" required value={draft.practiceName} onChange={(event) => updateDraft({ practiceName: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
            </div>

            <div>
              <label htmlFor="settings-address" className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
              <input id="settings-address" required value={draft.address} onChange={(event) => updateDraft({ address: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
            </div>

            <div>
              <label htmlFor="settings-public-brand" className="mb-2 block text-sm font-semibold text-slate-700">Public search brand</label>
              <input id="settings-public-brand" required value={draft.publicSearchBrand} onChange={(event) => updateDraft({ publicSearchBrand: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="settings-phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
                <input id="settings-phone" type="tel" pattern="\+?[0-9]{7,15}" title="Enter 7 to 15 digits, optionally prefixed by +." required value={draft.phone} onChange={(event) => updateDraft({ phone: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
              </div>
              <div>
                <label htmlFor="settings-email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input id="settings-email" type="email" required value={draft.email} onChange={(event) => updateDraft({ email: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
              </div>
            </div>

            <section aria-labelledby="settings-hours-title" className="border-t border-slate-200 pt-5">
              <h2 id="settings-hours-title" className="mb-4 text-lg font-bold text-slate-900">Operating hours</h2>
              <div className="space-y-3">
                {Object.entries(draft.operatingHours).map(([day, hours]) => {
                  const dayId = day.toLowerCase();
                  const invalidDay = hours.enabled && timeToMinutes(hours.start) >= timeToMinutes(hours.end);
                  return (
                    <div key={day} className="grid items-center gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-[minmax(110px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)]">
                      <label htmlFor={`settings-${dayId}-enabled`} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input id={`settings-${dayId}-enabled`} type="checkbox" checked={hours.enabled} onChange={(event) => updateOperatingHours(day, { enabled: event.target.checked })} />
                        {day}
                      </label>
                      <div>
                        <label htmlFor={`settings-${dayId}-start`} className="mb-1 block text-xs text-slate-500">Opens</label>
                        <input id={`settings-${dayId}-start`} type="time" required={hours.enabled} disabled={!hours.enabled} aria-invalid={invalidDay} value={timeToInputValue(hours.start)} onChange={(event) => updateOperatingHours(day, { start: inputValueToTime(event.target.value) })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm disabled:bg-slate-100" />
                      </div>
                      <div>
                        <label htmlFor={`settings-${dayId}-end`} className="mb-1 block text-xs text-slate-500">Closes</label>
                        <input id={`settings-${dayId}-end`} type="time" required={hours.enabled} disabled={!hours.enabled} aria-invalid={invalidDay} value={timeToInputValue(hours.end)} onChange={(event) => updateOperatingHours(day, { end: inputValueToTime(event.target.value) })} className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm disabled:bg-slate-100" />
                      </div>
                    </div>
                  );
                })}
              </div>
              {invalidOperatingHours ? <p role="alert" className="mt-3 text-sm font-medium text-red-700">Opening time must be earlier than closing time.</p> : null}
            </section>
          </div>
        </form>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900"><ShieldCheck className="h-5 w-5 text-sky-600" /> Practice compliance</div>
          <div className="mt-4 space-y-3 rounded-2xl bg-sky-50 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Demo data notice</div>
            <p>Records are stored in this browser. This demo does not provide production authentication or compliance controls.</p>
          </div>
        </div>
      </div>

      {saved ? <p role="status" className="text-right text-sm font-medium text-emerald-700">Practice settings saved.</p> : null}
      {hasUnsavedChanges ? (
        <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-2xl border border-sky-200 bg-white p-4 shadow-lg">
          <span className="text-sm font-semibold text-slate-700">Unsaved changes</span>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setDraft(settings); setSaved(false); }} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Reset</button>
            <button type="submit" form="clinic-settings-form" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">Save changes</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
