export type AppointmentStatus =
  | 'completed'
  | 'in-chair'
  | 'checked-in'
  | 'confirmed'
  | 'open'
  | 'buffer'
  | 'blocked';

export type ChairId = 'chair-1' | 'chair-2' | 'chair-3';

export type PatientStatus = 'Active' | 'In Chair' | 'Hygiene Due' | 'Inactive' | 'Complete';
export type TreatmentStatus = 'Not Started' | 'In Progress' | 'Done';
export type BalanceStatus = 'Overdue' | 'Paid' | '—';
export type TreatmentArea = 'Periodontal' | 'Orthodontic' | 'Surgical' | 'Pediatric' | 'Hygiene' | 'Restorative';
export type Gender = 'Female' | 'Male' | 'Non-binary';

export interface Appointment {
  id: string;
  patient: string;
  treatment: string;
  doctor: string;
  chairId: ChairId;
  status: AppointmentStatus;
  time: string;
  duration: number;
  date: string;
  room: string;
  chairLabel: string;
  specialty: string;
}

export interface WaitlistPatient {
  id: string;
  name: string;
  treatment: string;
  priority: number;
  status: 'waiting';
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'charge' | 'payment';
}

export interface TreatmentStep {
  id: string;
  label: string;
  status: TreatmentStatus;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
  phone: string;
  email: string;
  primaryPractitioner: 'Dr. Sarah Jenkins' | 'Dr. Paolo Reyes';
  status: PatientStatus;
  lastApptDate: string;
  lastApptTreatment: string;
  nextApptDate: string;
  nextApptTreatment: string;
  treatmentArea: TreatmentArea;
  balance: number;
  notes: string;
  treatmentSteps: TreatmentStep[];
  ledger: LedgerEntry[];
}

export interface PracticeSettings {
  practiceName: string;
  publicSearchBrand: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: Record<string, { enabled: boolean; start: string; end: string }>;
}

export interface AuthUser {
  username: string;
  role: string;
  name: string;
}
