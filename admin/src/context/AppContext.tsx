import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { appointments as seedAppointments, chairs, initialSettings, localDateKey, patientSeedData, waitlist as seedWaitlist } from '../data/mockData';
import type { Appointment, AuthUser, LedgerEntry, Patient, PracticeSettings, TreatmentStep, WaitlistPatient } from '../types';

type AppContextValue = {
  isLoggedIn: boolean;
  user: AuthUser;
  appointments: Appointment[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedChair: string;
  setSelectedChair: (chair: string) => void;
  viewMode: 'day' | 'week';
  setViewMode: (mode: 'day' | 'week') => void;
  settings: PracticeSettings;
  updateSettings: (settings: PracticeSettings) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => { ok: boolean; message?: string };
  changeAppointmentStatus: (appointmentId: string, nextStatus: Appointment['status']) => void;
  waitlist: WaitlistPatient[];
  addWaitlistPatient: (patient: Omit<WaitlistPatient, 'id' | 'status'>) => void;
  removeWaitlistPatient: (id: string) => void;
  patients: Patient[];
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  addPatient: (patient: Partial<Patient>) => Patient;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  removePatients: (patientIds: string[]) => void;
  recordPayment: (patientId: string, amount: number, description: string) => boolean;
  toggleTreatmentStep: (patientId: string, stepId: string) => void;
  updatePatientNotes: (patientId: string, notes: string) => void;
  login: (username: string, password: string, rememberMe: boolean) => boolean;
  logout: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const defaultUser: AuthUser = {
  username: 'admin',
  role: 'Chief Orthodontist',
  name: 'Dr. Sarah Jenkins',
};

const formatDate = (date: Date) => localDateKey(date);

const timeToMinutes = (time: string) => {
  const [timeValue, modifier] = time.split(' ');
  const [hours, minutes] = timeValue.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return modifier === 'PM' && hours !== 12 ? totalMinutes + 12 * 60 : totalMinutes;
};

const readStoredValue = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('molarcoaster-auth') === 'true' || sessionStorage.getItem('molarcoaster-auth') === 'true';
  });

  const [user, setUser] = useState<AuthUser>(defaultUser);
  const [appointments, setAppointments] = useState<Appointment[]>(() => readStoredValue('molarcoaster-appointments', seedAppointments));
  const [selectedDate, setSelectedDate] = useState<string>(() => localDateKey());
  const [selectedChair, setSelectedChair] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [settings, setSettings] = useState<PracticeSettings>(() => readStoredValue('molarcoaster-settings', initialSettings));
  const [waitlist, setWaitlist] = useState<WaitlistPatient[]>(() => readStoredValue('molarcoaster-waitlist', seedWaitlist));
  const [patients, setPatients] = useState<Patient[]>(() => readStoredValue('molarcoaster-patients', patientSeedData));
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(() => readStoredValue('molarcoaster-selected-patient', patientSeedData[0]?.id ?? null));

  useEffect(() => {
    localStorage.setItem('molarcoaster-appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('molarcoaster-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('molarcoaster-waitlist', JSON.stringify(waitlist));
  }, [waitlist]);

  useEffect(() => {
    localStorage.setItem('molarcoaster-patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    if (selectedPatientId) {
      localStorage.setItem('molarcoaster-selected-patient', JSON.stringify(selectedPatientId));
    }
  }, [selectedPatientId]);

  const login = (username: string, password: string, rememberMe: boolean) => {
    if (!username.trim() || !password.trim()) return false;
    const nextUser: AuthUser = {
      username: username.trim(),
      role: 'Chief Orthodontist',
      name: 'Dr. Sarah Jenkins',
    };
    setUser(nextUser);
    setIsLoggedIn(true);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('molarcoaster-auth', 'true');
    (rememberMe ? sessionStorage : localStorage).removeItem('molarcoaster-auth');
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('molarcoaster-auth');
    sessionStorage.removeItem('molarcoaster-auth');
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    if (!appointment.patient || !appointment.treatment || !appointment.doctor) {
      return { ok: false, message: 'Please complete all patient details.' };
    }

    const start = timeToMinutes(appointment.time);
    const end = start + appointment.duration;

    const conflict = appointments.some((item) => {
      if (item.date !== appointment.date || item.chairId !== appointment.chairId) return false;
      const itemStart = timeToMinutes(item.time);
      const itemEnd = itemStart + item.duration;
      return start < itemEnd && itemStart < end;
    });

    if (conflict) {
      return { ok: false, message: 'This chair already has a booking during that time.' };
    }

    const nextId = `apt-${Date.now()}`;
    setAppointments((current) => [{ ...appointment, id: nextId }, ...current]);
    return { ok: true };
  };

  const changeAppointmentStatus = (appointmentId: string, nextStatus: Appointment['status']) => {
    const appointment = appointments.find((record) => record.id === appointmentId);
    setAppointments((current) => current.map((appt) => (appt.id === appointmentId ? { ...appt, status: nextStatus } : appt)));
    if (appointment && (nextStatus === 'in-chair' || appointment.status === 'in-chair')) {
      const patientStatus = nextStatus === 'in-chair' ? 'In Chair' : 'Active';
      setPatients((current) => current.map((patient) =>
        `${patient.firstName} ${patient.lastName}` === appointment.patient ? { ...patient, status: patientStatus } : patient,
      ));
    }
  };

  const updateSettings = (nextSettings: PracticeSettings) => {
    setSettings(nextSettings);
  };

  const addWaitlistPatient = (patient: Omit<WaitlistPatient, 'id' | 'status'>) => {
    setWaitlist((current) => [...current, { ...patient, id: `wl-${Date.now()}`, status: 'waiting' }]);
  };

  const removeWaitlistPatient = (id: string) => {
    setWaitlist((current) => current.filter((patient) => patient.id !== id));
  };

  const addPatient = (patient: Partial<Patient>) => {
    const nextId = `P-${globalThis.crypto.randomUUID()}`;
    const nextPatient: Patient = {
      id: nextId,
      firstName: patient.firstName ?? 'New',
      lastName: patient.lastName ?? 'Patient',
      dob: patient.dob ?? '2000-01-01',
      gender: patient.gender ?? 'Female',
      phone: patient.phone ?? '+63 917 555 0000',
      email: patient.email ?? 'new.patient@email.com',
      primaryPractitioner: patient.primaryPractitioner ?? 'Dr. Sarah Jenkins',
      status: patient.status ?? 'Active',
      lastApptDate: patient.lastApptDate ?? '2026-09-11',
      lastApptTreatment: patient.lastApptTreatment ?? 'General exam',
      nextApptDate: patient.nextApptDate ?? '2026-09-18',
      nextApptTreatment: patient.nextApptTreatment ?? 'Follow-up',
      treatmentArea: patient.treatmentArea ?? 'Hygiene',
      balance: patient.balance ?? 0,
      notes: patient.notes ?? '',
      treatmentSteps: patient.treatmentSteps ?? [
        { id: 'step-1', label: 'Clinical Exam', status: 'Not Started' },
        { id: 'step-2', label: 'X-Rays & Imaging', status: 'Not Started' },
        { id: 'step-3', label: 'Treatment Plan', status: 'Not Started' },
        { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
        { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
      ],
      ledger: patient.ledger ?? [],
    };
    setPatients((current) => [nextPatient, ...current]);
    setSelectedPatientId(nextPatient.id);
    return nextPatient;
  };

  const updatePatient = (patientId: string, updates: Partial<Patient>) => {
    setPatients((current) => current.map((patient) => (patient.id === patientId ? { ...patient, ...updates } : patient)));
  };

  const removePatients = (patientIds: string[]) => {
    const removedIds = new Set(patientIds);
    setPatients((current) => current.filter((patient) => !removedIds.has(patient.id)));
    setSelectedPatientId((current) => current && removedIds.has(current) ? null : current);
  };

  const recordPayment = (patientId: string, amount: number, description: string) => {
    const patient = patients.find((record) => record.id === patientId);
    if (!patient || !Number.isFinite(amount) || amount <= 0 || amount > patient.balance) return false;

    setPatients((current) =>
      current.map((patient) => {
        if (patient.id !== patientId) return patient;

        const nextLedger: LedgerEntry[] = [
          ...patient.ledger,
          { id: `ledger-${Date.now()}`, date: localDateKey(), description, amount: -amount, type: 'payment' },
        ];

        return {
          ...patient,
          balance: Math.max(0, patient.balance - amount),
          ledger: nextLedger,
        };
      }),
    );
    return true;
  };

  const toggleTreatmentStep = (patientId: string, stepId: string) => {
    setPatients((current) =>
      current.map((patient) => {
        if (patient.id !== patientId) return patient;
        const nextTreatmentSteps: TreatmentStep[] = patient.treatmentSteps.map((step) => {
          if (step.id !== stepId) return step;
          const nextStatus: TreatmentStep['status'] = step.status === 'Done' ? 'In Progress' : 'Done';
          return { ...step, status: nextStatus };
        });
        return { ...patient, treatmentSteps: nextTreatmentSteps };
      }),
    );
  };

  const updatePatientNotes = (patientId: string, notes: string) => {
    updatePatient(patientId, { notes });
  };

  const value = useMemo<AppContextValue>(
    () => ({
      isLoggedIn,
      user,
      appointments,
      selectedDate,
      setSelectedDate,
      selectedChair,
      setSelectedChair,
      viewMode,
      setViewMode,
      settings,
      updateSettings,
      addAppointment,
      changeAppointmentStatus,
      waitlist,
      addWaitlistPatient,
      removeWaitlistPatient,
      patients,
      selectedPatientId,
      setSelectedPatientId,
      addPatient,
      updatePatient,
      removePatients,
      recordPayment,
      toggleTreatmentStep,
      updatePatientNotes,
      login,
      logout,
    }),
    [appointments, isLoggedIn, patients, selectedChair, selectedDate, selectedPatientId, settings, user, viewMode, waitlist],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext must be used inside AppProvider');
  return ctx;
};

export const dateLabel = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const shiftDate = (baseDate: string, offset: number) => {
  const [year, month, day] = baseDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + offset, 12));
  return formatDate(date);
};

export const chairsById = Object.fromEntries(chairs.map((chair) => [chair.id, chair]));
