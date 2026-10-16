import type { Appointment, Patient, PracticeSettings, WaitlistPatient } from '../types';

export const chairs = [
  { id: 'chair-1', name: 'Chair #1', specialty: 'Hygiene', room: 'Op Room A', color: 'bg-blue-500' },
  { id: 'chair-2', name: 'Chair #2', specialty: 'Ortho & Pediatric', room: 'Op Room B', color: 'bg-indigo-500' },
  { id: 'chair-3', name: 'Chair #3', specialty: 'Surgical', room: 'Op Suite C', color: 'bg-amber-500' },
] as const;

const pad = (value: number) => String(value).padStart(2, '0');
export const localDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const dateParts = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};
const dateKey = localDateKey();

export const appointments: Appointment[] = [
  { id: 'apt-1', patient: 'Clara Montes', treatment: 'Deep Scaling & Polish', doctor: 'Dr. Paolo Reyes', chairId: 'chair-1', status: 'completed', time: '08:30 AM', duration: 60, date: dateKey, room: 'Op Room A', chairLabel: 'Chair #1', specialty: 'Hygiene' },
  { id: 'apt-2', patient: 'Leo Valenzuela', treatment: 'Bracket Replacement', doctor: 'Dr. Sarah Jenkins', chairId: 'chair-2', status: 'completed', time: '08:45 AM', duration: 45, date: dateKey, room: 'Op Room B', chairLabel: 'Chair #2', specialty: 'Ortho & Pediatric' },
  { id: 'apt-3', patient: 'Mikaela Chen', treatment: 'Full Periodontal Therapy', doctor: 'Dr. Paolo Reyes', chairId: 'chair-1', status: 'in-chair', time: '09:30 AM', duration: 60, date: dateKey, room: 'Op Room A', chairLabel: 'Chair #1', specialty: 'Hygiene' },
  { id: 'apt-4', patient: 'Gabriel Romero', treatment: 'Orthodontic Adjustment', doctor: 'Dr. Sarah Jenkins', chairId: 'chair-2', status: 'checked-in', time: '09:45 AM', duration: 30, date: dateKey, room: 'Op Room B', chairLabel: 'Chair #2', specialty: 'Ortho & Pediatric' },
  { id: 'apt-5', patient: 'Antonio Santos', treatment: 'Surgical Extraction #18 & #31', doctor: 'Dr. Paolo Reyes', chairId: 'chair-3', status: 'checked-in', time: '09:30 AM', duration: 60, date: dateKey, room: 'Op Suite C', chairLabel: 'Chair #3', specialty: 'Surgical' },
  { id: 'apt-6', patient: 'Patricia Tan', treatment: 'Dental Prophylaxis & Sealant', doctor: 'Dr. Paolo Reyes', chairId: 'chair-1', status: 'confirmed', time: '11:00 AM', duration: 45, date: dateKey, room: 'Op Room A', chairLabel: 'Chair #1', specialty: 'Hygiene' },
  { id: 'apt-7', patient: 'Kendra Ocampo', treatment: 'Pediatric Pulpotomy Review', doctor: 'Dr. Sarah Jenkins', chairId: 'chair-2', status: 'confirmed', time: '11:00 AM', duration: 40, date: dateKey, room: 'Op Room B', chairLabel: 'Chair #2', specialty: 'Ortho & Pediatric' },
  { id: 'apt-8', patient: 'Arthur Pendelton', treatment: 'Root Canal Therapy (Session 2)', doctor: 'Dr. Paolo Reyes', chairId: 'chair-1', status: 'confirmed', time: '01:00 PM', duration: 60, date: dateKey, room: 'Op Room A', chairLabel: 'Chair #1', specialty: 'Hygiene' },
  { id: 'apt-9', patient: 'Hannah Lim', treatment: 'Composite Aesthetic Bonding', doctor: 'Dr. Sarah Jenkins', chairId: 'chair-1', status: 'confirmed', time: '02:30 PM', duration: 45, date: dateKey, room: 'Op Room A', chairLabel: 'Chair #1', specialty: 'Hygiene' },
  { id: 'apt-10', patient: 'Dominic Cruz', treatment: 'Teeth Whitening & Zoom', doctor: 'Dr. Paolo Reyes', chairId: 'chair-1', status: 'confirmed', time: '04:00 PM', duration: 60, date: dateKey, room: 'Op Room A', chairLabel: 'Chair #1', specialty: 'Hygiene' },
  { id: 'apt-11', patient: 'Bea Alcantara', treatment: 'Invisalign Review', doctor: 'Dr. Sarah Jenkins', chairId: 'chair-2', status: 'confirmed', time: '01:00 PM', duration: 30, date: dateKey, room: 'Op Room B', chairLabel: 'Chair #2', specialty: 'Ortho & Pediatric' },
  { id: 'apt-12', patient: 'Ramon Dizon', treatment: 'Titanium Implant Placement', doctor: 'Dr. Paolo Reyes', chairId: 'chair-3', status: 'confirmed', time: '01:00 PM', duration: 90, date: dateKey, room: 'Op Suite C', chairLabel: 'Chair #3', specialty: 'Surgical' },
  { id: 'apt-13', patient: 'Chloe Villanueva', treatment: 'Pediatric Consultation & Fluoride', doctor: 'Dr. Sarah Jenkins', chairId: 'chair-2', status: 'buffer', time: '04:00 PM', duration: 30, date: dateKey, room: 'Op Room B', chairLabel: 'Chair #2', specialty: 'Ortho & Pediatric' },
  { id: 'apt-14', patient: 'Open Slot', treatment: 'Orthodontic consultation', doctor: 'Unassigned', chairId: 'chair-2', status: 'open', time: '09:45 AM', duration: 30, date: dateKey, room: 'Op Room B', chairLabel: 'Chair #2', specialty: 'Ortho & Pediatric' },
];

export const waitlist: WaitlistPatient[] = [
  { id: 'wl-1', name: 'Rafael Gomez', treatment: 'Crown Recementation', priority: 1, status: 'waiting' },
  { id: 'wl-2', name: 'Evelyn Mercado', treatment: 'Emergency Broken Wire', priority: 2, status: 'waiting' },
];

export const initialSettings: PracticeSettings = {
  practiceName: 'MolarCoaster Dental Clinic',
  publicSearchBrand: 'MolarCoaster Dental Clinic',
  address: '180C H. N. M. H. ...',
  phone: '+639123456789',
  email: 'admin@molarcoaster.com',
  operatingHours: {
    Monday: { enabled: true, start: '08:30 AM', end: '06:00 PM' },
    Tuesday: { enabled: true, start: '08:30 AM', end: '06:00 PM' },
    Wednesday: { enabled: true, start: '08:30 AM', end: '06:00 PM' },
    Thursday: { enabled: true, start: '08:30 AM', end: '06:00 PM' },
    Friday: { enabled: true, start: '08:30 AM', end: '06:00 PM' },
    Saturday: { enabled: true, start: '08:30 AM', end: '06:00 PM' },
    Sunday: { enabled: false, start: '08:30 AM', end: '06:00 PM' },
  },
};

export const quickSearchOptions = ['Recent', 'Mikaela Chen', 'Dr. Sarah Jenkins'];

const patientSeedDataSource: Patient[] = [
  { id: 'P-1001', firstName: 'Mikaela', lastName: 'Chen', dob: '1997-05-14', gender: 'Female', phone: '+63 917 555 0123', email: 'mikaela.chen@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'In Chair', lastApptDate: '2026-09-11', lastApptTreatment: 'Full Periodontal Therapy', nextApptDate: '2026-09-15', nextApptTreatment: 'Debridement Follow-up', treatmentArea: 'Periodontal', balance: 2590, notes: 'Severe gum sensitivity and follow-up after scaling.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'In Progress' },
  ], ledger: [
    { id: 'l-1', date: '2026-09-02', description: 'Initial gum therapy', amount: 1500, type: 'charge' },
    { id: 'l-2', date: '2026-09-06', description: 'Partial payment', amount: -500, type: 'payment' },
  ] },
  { id: 'P-1002', firstName: 'Patricia', lastName: 'Tan', dob: '1988-04-18', gender: 'Female', phone: '+63 917 555 0134', email: 'patricia.tan@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-09-11', lastApptTreatment: 'Dental Prophylaxis & Sealant', nextApptDate: '2026-10-02', nextApptTreatment: 'Checkup', treatmentArea: 'Hygiene', balance: 0, notes: 'Prefers early morning appointments.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Routine cleaning', amount: 2200, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Payment received', amount: -2200, type: 'payment' }] },
  { id: 'P-1003', firstName: 'Hannah', lastName: 'Lim', dob: '1991-07-24', gender: 'Female', phone: '+63 917 555 0145', email: 'hannah.lim@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Hygiene Due', lastApptDate: '2026-09-11', lastApptTreatment: 'Composite Aesthetic Bonding', nextApptDate: '2026-09-22', nextApptTreatment: 'Teeth Whitening', treatmentArea: 'Restorative', balance: 0, notes: 'Happy with enamel polish and whitening package.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'In Progress' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Bonding procedure', amount: 12000, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Paid', amount: -12000, type: 'payment' }] },
  { id: 'P-1004', firstName: 'Arthur', lastName: 'Pendelton', dob: '1974-12-03', gender: 'Male', phone: '+63 917 555 0167', email: 'arthur.pendelton@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Inactive', lastApptDate: '2026-09-11', lastApptTreatment: 'Root Canal Therapy (Session 2)', nextApptDate: '2026-11-18', nextApptTreatment: 'Crown review', treatmentArea: 'Restorative', balance: 0, notes: 'Would like reminders via SMS.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Endodontic treatment', amount: 25000, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Payment posted', amount: -25000, type: 'payment' }] },
  { id: 'P-1005', firstName: 'Kendra', lastName: 'Ocampo', dob: '2011-04-12', gender: 'Female', phone: '+63 917 555 0188', email: 'kendra.ocampo@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-09-11', lastApptTreatment: 'Pediatric Pulpotomy Review', nextApptDate: '2026-09-20', nextApptTreatment: 'Checkup', treatmentArea: 'Pediatric', balance: 0, notes: 'Parent responsible for follow-up calls.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'In Progress' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Pediatric review', amount: 2800, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Paid in full', amount: -2800, type: 'payment' }] },
  { id: 'P-1006', firstName: 'Dominic', lastName: 'Cruz', dob: '1989-11-09', gender: 'Male', phone: '+63 917 555 0201', email: 'dominic.cruz@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Active', lastApptDate: '2026-09-11', lastApptTreatment: 'Teeth Whitening & Zoom', nextApptDate: '2026-09-25', nextApptTreatment: 'Shade check', treatmentArea: 'Restorative', balance: 2000, notes: 'Balance pending due to treatment package.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-04', description: 'Whitening package', amount: 12000, type: 'charge' }, { id: 'l-2', date: '2026-09-07', description: 'Partial payment', amount: -10000, type: 'payment' }] },
  { id: 'P-1007', firstName: 'Bea', lastName: 'Alcantara', dob: '1996-02-10', gender: 'Female', phone: '+63 917 555 0212', email: 'bea.alcantara@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'In Chair', lastApptDate: '2026-09-11', lastApptTreatment: 'Invisalign Review', nextApptDate: '2026-09-12', nextApptTreatment: 'Aligner tray change', treatmentArea: 'Orthodontic', balance: 0, notes: 'Progress is tracking well.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'In Progress' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Aligner consultation', amount: 3500, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Paid', amount: -3500, type: 'payment' }] },
  { id: 'P-1008', firstName: 'Leo', lastName: 'Valenzuela', dob: '1982-03-21', gender: 'Male', phone: '+63 917 555 0223', email: 'leo.valenzuela@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Hygiene Due', lastApptDate: '2026-09-11', lastApptTreatment: 'Bracket Replacement', nextApptDate: '2026-09-24', nextApptTreatment: 'Teeth cleaning', treatmentArea: 'Orthodontic', balance: 0, notes: 'Needs tray planning and cleaning reminder.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'In Progress' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-10', description: 'Orthodontic adjustment', amount: 5000, type: 'charge' }, { id: 'l-2', date: '2026-09-10', description: 'Paid', amount: -5000, type: 'payment' }] },
  { id: 'P-1009', firstName: 'Clara', lastName: 'Montes', dob: '1979-08-19', gender: 'Female', phone: '+63 917 555 0234', email: 'clara.montes@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Complete', lastApptDate: '2026-09-11', lastApptTreatment: 'Deep Scaling & Polish', nextApptDate: '2026-10-19', nextApptTreatment: 'Maintenance', treatmentArea: 'Hygiene', balance: 0, notes: 'No current issues and on maintenance schedule.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Done' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Maintenance cleaning', amount: 1800, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Paid', amount: -1800, type: 'payment' }] },
  { id: 'P-1010', firstName: 'Gabriel', lastName: 'Romero', dob: '2001-06-22', gender: 'Male', phone: '+63 917 555 0245', email: 'gabriel.romero@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-09-11', lastApptTreatment: 'Orthodontic Adjustment', nextApptDate: '2026-09-18', nextApptTreatment: 'Progress check', treatmentArea: 'Orthodontic', balance: 0, notes: 'Good progress, no issues.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'In Progress' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Orthodontic review', amount: 3200, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Paid', amount: -3200, type: 'payment' }] },
  { id: 'P-1011', firstName: 'Antonio', lastName: 'Santos', dob: '1978-11-02', gender: 'Male', phone: '+63 917 555 0256', email: 'antonio.santos@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'In Chair', lastApptDate: '2026-09-11', lastApptTreatment: 'Surgical Extraction #18 & #31', nextApptDate: '2026-09-17', nextApptTreatment: 'Suture review', treatmentArea: 'Surgical', balance: 0, notes: 'Needs post-op instructions and check-in after extraction.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'In Progress' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Surgical procedure', amount: 18500, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Payment', amount: -18500, type: 'payment' }] },
  { id: 'P-1012', firstName: 'Ramon', lastName: 'Dizon', dob: '1985-10-15', gender: 'Male', phone: '+63 917 555 0267', email: 'ramon.dizon@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Complete', lastApptDate: '2026-09-11', lastApptTreatment: 'Titanium Implant Placement', nextApptDate: '2026-10-05', nextApptTreatment: 'Crown fitting', treatmentArea: 'Surgical', balance: 0, notes: 'Implant site stable and recovery is good.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Done' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Implant placement', amount: 40000, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Paid in full', amount: -40000, type: 'payment' }] },
  { id: 'P-1013', firstName: 'Chloe', lastName: 'Villanueva', dob: '2018-02-14', gender: 'Female', phone: '+63 917 555 0278', email: 'chloe.villanueva@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-09-11', lastApptTreatment: 'Pediatric Consultation & Fluoride', nextApptDate: '2026-09-25', nextApptTreatment: 'Routine checkup', treatmentArea: 'Pediatric', balance: 0, notes: 'Parent requests reminders for fluoride maintenance.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'In Progress' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Not Started' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-11', description: 'Pediatric checkup', amount: 1500, type: 'charge' }, { id: 'l-2', date: '2026-09-11', description: 'Paid', amount: -1500, type: 'payment' }] },
  { id: 'P-1014', firstName: 'Rafael', lastName: 'Gomez', dob: '1987-06-27', gender: 'Male', phone: '+63 917 555 0289', email: 'rafael.gomez@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Active', lastApptDate: '2026-06-20', lastApptTreatment: 'Crown Replacement', nextApptDate: '2026-09-13', nextApptTreatment: 'Crown re-cementation', treatmentArea: 'Restorative', balance: 0, notes: 'Priority waitlist due to chair availability.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-06-20', description: 'Crown replacement', amount: 18000, type: 'charge' }, { id: 'l-2', date: '2026-06-25', description: 'Paid', amount: -18000, type: 'payment' }] },
  { id: 'P-1015', firstName: 'Evelyn', lastName: 'Mercado', dob: '1983-09-08', gender: 'Female', phone: '+63 917 555 0291', email: 'evelyn.mercado@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-08-26', lastApptTreatment: 'Emergency Broken Wire', nextApptDate: '2026-09-13', nextApptTreatment: 'Orthodontic emergency review', treatmentArea: 'Orthodontic', balance: 0, notes: 'Needs same-day review when available.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'In Progress' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Not Started' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-08-26', description: 'Wire emergency', amount: 3500, type: 'charge' }, { id: 'l-2', date: '2026-08-28', description: 'Paid', amount: -3500, type: 'payment' }] },
  { id: 'P-1016', firstName: 'Nina', lastName: 'Marquez', dob: '1992-07-30', gender: 'Female', phone: '+63 917 555 0302', email: 'nina.marquez@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-08-15', lastApptTreatment: 'Smile makeover consultation', nextApptDate: '2026-09-18', nextApptTreatment: 'Veneer planning', treatmentArea: 'Restorative', balance: 15000, notes: 'Follow-up required for veneer consultation.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'In Progress' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-08-15', description: 'Smile makeover consultation', amount: 15000, type: 'charge' }, { id: 'l-2', date: '2026-08-22', description: 'Deposit', amount: -3000, type: 'payment' }] },
  { id: 'P-1017', firstName: 'Noel', lastName: 'Valdez', dob: '1958-12-09', gender: 'Male', phone: '+63 917 555 0313', email: 'noel.valdez@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Inactive', lastApptDate: '2026-07-30', lastApptTreatment: 'Denture adjustment', nextApptDate: '2026-10-14', nextApptTreatment: 'Denture relining', treatmentArea: 'Restorative', balance: 0, notes: 'Reunion call required.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Done' },
  ], ledger: [{ id: 'l-1', date: '2026-07-30', description: 'Denture adjustment', amount: 6500, type: 'charge' }, { id: 'l-2', date: '2026-07-30', description: 'Pay in full', amount: -6500, type: 'payment' }] },
  { id: 'P-1018', firstName: 'Alyssa', lastName: 'Ramos', dob: '2007-03-17', gender: 'Female', phone: '+63 917 555 0324', email: 'alyssa.ramos@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-08-22', lastApptTreatment: 'Orthodontic consult', nextApptDate: '2026-09-21', nextApptTreatment: 'Molar band adjustment', treatmentArea: 'Orthodontic', balance: 5000, notes: 'Needs continued monitoring.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'In Progress' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-08-18', description: 'Consultation', amount: 4500, type: 'charge' }, { id: 'l-2', date: '2026-08-20', description: 'Partial payment', amount: -1500, type: 'payment' }] },
  { id: 'P-1019', firstName: 'Marlon', lastName: 'Bautista', dob: '1980-01-04', gender: 'Male', phone: '+63 917 555 0335', email: 'marlon.bautista@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Complete', lastApptDate: '2026-08-12', lastApptTreatment: 'Implant review', nextApptDate: '2026-10-09', nextApptTreatment: 'Prosthetic review', treatmentArea: 'Surgical', balance: 0, notes: 'Implant site healed well.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Done' },
  ], ledger: [{ id: 'l-1', date: '2026-08-12', description: 'Implant review', amount: 16000, type: 'charge' }, { id: 'l-2', date: '2026-08-12', description: 'Paid', amount: -16000, type: 'payment' }] },
  { id: 'P-1020', firstName: 'Miguel', lastName: 'Santos', dob: '1998-09-16', gender: 'Male', phone: '+63 917 555 0346', email: 'miguel.santos@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Active', lastApptDate: '2026-09-03', lastApptTreatment: 'Wisdom tooth consult', nextApptDate: '2026-09-14', nextApptTreatment: 'Extraction follow-up', treatmentArea: 'Surgical', balance: 5000, notes: 'Recovery is on track.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'In Progress' },
  ], ledger: [{ id: 'l-1', date: '2026-09-03', description: 'Consultation', amount: 4500, type: 'charge' }, { id: 'l-2', date: '2026-09-06', description: 'Partial payment', amount: -1000, type: 'payment' }] },
  { id: 'P-1021', firstName: 'Leah', lastName: 'Vega', dob: '1990-05-11', gender: 'Female', phone: '+63 917 555 0357', email: 'leah.vega@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-08-28', lastApptTreatment: 'Smile design review', nextApptDate: '2026-09-17', nextApptTreatment: 'Procedure planning', treatmentArea: 'Restorative', balance: 8200, notes: 'Interested in veneer timeline options.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'In Progress' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-08-28', description: 'Smile design review', amount: 9200, type: 'charge' }, { id: 'l-2', date: '2026-08-30', description: 'Down payment', amount: -1000, type: 'payment' }] },
  { id: 'P-1022', firstName: 'Andre', lastName: 'Uy', dob: '1986-03-06', gender: 'Male', phone: '+63 917 555 0368', email: 'andre.uy@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Complete', lastApptDate: '2026-08-04', lastApptTreatment: 'Braces removal', nextApptDate: '2026-09-30', nextApptTreatment: 'Retention review', treatmentArea: 'Orthodontic', balance: 0, notes: 'Clear retainer maintenance instructions given.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Done' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Done' },
  ], ledger: [{ id: 'l-1', date: '2026-08-04', description: 'Braces removal', amount: 15000, type: 'charge' }, { id: 'l-2', date: '2026-08-04', description: 'Paid', amount: -15000, type: 'payment' }] },
  { id: 'P-1023', firstName: 'Janelle', lastName: 'Pineda', dob: '2005-12-21', gender: 'Female', phone: '+63 917 555 0379', email: 'janelle.pineda@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-09-08', lastApptTreatment: 'Orthodontic check-in', nextApptDate: '2026-09-22', nextApptTreatment: 'Appliance adjustment', treatmentArea: 'Orthodontic', balance: 0, notes: 'Follows up with school schedule.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'In Progress' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-08', description: 'Check-in', amount: 2600, type: 'charge' }, { id: 'l-2', date: '2026-09-08', description: 'Paid', amount: -2600, type: 'payment' }] },
  { id: 'P-1024', firstName: 'Rina', lastName: 'Gonzales', dob: '1998-04-30', gender: 'Female', phone: '+63 917 555 0390', email: 'rina.gonzales@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Inactive', lastApptDate: '2026-07-11', lastApptTreatment: 'Clean and polish', nextApptDate: '2026-09-18', nextApptTreatment: 'Hygiene follow-up', treatmentArea: 'Hygiene', balance: 0, notes: 'No notes available.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Not Started' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Not Started' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-07-11', description: 'Clean and polish', amount: 1800, type: 'charge' }, { id: 'l-2', date: '2026-07-11', description: 'Paid', amount: -1800, type: 'payment' }] },
  { id: 'P-1025', firstName: 'Lorenzo', lastName: 'Castro', dob: '1969-11-19', gender: 'Male', phone: '+63 917 555 0401', email: 'lorenzo.castro@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Active', lastApptDate: '2026-09-04', lastApptTreatment: 'Tooth extraction', nextApptDate: '2026-09-20', nextApptTreatment: 'Gum care review', treatmentArea: 'Surgical', balance: 6400, notes: 'Recovery support and savings plan requested.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'In Progress' },
  ], ledger: [{ id: 'l-1', date: '2026-09-04', description: 'Extraction', amount: 12000, type: 'charge' }, { id: 'l-2', date: '2026-09-06', description: 'Partial payment', amount: -5600, type: 'payment' }] },
  { id: 'P-1026', firstName: 'Sophia', lastName: 'Reyes', dob: '1995-08-01', gender: 'Female', phone: '+63 917 555 0412', email: 'sophia.reyes@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-09-10', lastApptTreatment: 'Adjustment and polish', nextApptDate: '2026-09-16', nextApptTreatment: 'Retention check', treatmentArea: 'Orthodontic', balance: 0, notes: 'Wears retainer nightly.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'In Progress' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Done' },
  ], ledger: [{ id: 'l-1', date: '2026-09-10', description: 'Adjustment', amount: 3700, type: 'charge' }, { id: 'l-2', date: '2026-09-10', description: 'Paid', amount: -3700, type: 'payment' }] },
  { id: 'P-1027', firstName: 'David', lastName: 'Bautista', dob: '1981-06-17', gender: 'Male', phone: '+63 917 555 0423', email: 'david.bautista@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Complete', lastApptDate: '2026-08-20', lastApptTreatment: 'Emergency exam', nextApptDate: '2026-09-29', nextApptTreatment: 'Follow-up', treatmentArea: 'Periodontal', balance: 0, notes: 'Maintaining monthly periodontal checkups.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Done' },
  ], ledger: [{ id: 'l-1', date: '2026-08-20', description: 'Emergency exam', amount: 8500, type: 'charge' }, { id: 'l-2', date: '2026-08-20', description: 'Paid', amount: -8500, type: 'payment' }] },
  { id: 'P-1028', firstName: 'Carmen', lastName: 'Dela Cruz', dob: '1976-02-05', gender: 'Female', phone: '+63 917 555 0434', email: 'carmen.delacruz@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Hygiene Due', lastApptDate: '2026-08-18', lastApptTreatment: 'Routine cleaning', nextApptDate: '2026-09-20', nextApptTreatment: 'Cleaning and polish', treatmentArea: 'Hygiene', balance: 0, notes: 'Needs reminder for cleaning before dental exam.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Not Started' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Not Started' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-08-18', description: 'Cleaning', amount: 1600, type: 'charge' }, { id: 'l-2', date: '2026-08-18', description: 'Paid', amount: -1600, type: 'payment' }] },
  { id: 'P-1029', firstName: 'Theo', lastName: 'Mendoza', dob: '2015-01-22', gender: 'Male', phone: '+63 917 555 0445', email: 'theo.mendoza@email.com', primaryPractitioner: 'Dr. Sarah Jenkins', status: 'Active', lastApptDate: '2026-09-05', lastApptTreatment: 'Pediatric exam', nextApptDate: '2026-09-19', nextApptTreatment: 'Checkup', treatmentArea: 'Pediatric', balance: 0, notes: 'Child-friendly care routine preferred.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'In Progress' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ], ledger: [{ id: 'l-1', date: '2026-09-05', description: 'Pediatric exam', amount: 2000, type: 'charge' }, { id: 'l-2', date: '2026-09-05', description: 'Paid', amount: -2000, type: 'payment' }] },
  { id: 'P-1030', firstName: 'Paula', lastName: 'Guevarra', dob: '1984-05-09', gender: 'Female', phone: '+63 917 555 0456', email: 'paula.guevarra@email.com', primaryPractitioner: 'Dr. Paolo Reyes', status: 'Active', lastApptDate: '2026-09-02', lastApptTreatment: 'General exam', nextApptDate: '2026-09-18', nextApptTreatment: 'Oral hygiene review', treatmentArea: 'Periodontal', balance: 0, notes: 'Stable but monitoring gum inflammation.', treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Done' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Done' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Done' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'In Progress' },
  ], ledger: [{ id: 'l-1', date: '2026-09-02', description: 'General exam', amount: 1600, type: 'charge' }, { id: 'l-2', date: '2026-09-02', description: 'Paid', amount: -1600, type: 'payment' }] },
];

export const patientSeedData: Patient[] = patientSeedDataSource.map((patient) =>
  patient.id === 'P-1007' || patient.id === 'P-1011' ? { ...patient, status: 'Active' } : patient,
);

export const statusChipClass: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  'In Chair': 'bg-blue-100 text-blue-700',
  'Hygiene Due': 'bg-sky-100 text-sky-700',
  Inactive: 'bg-slate-200 text-slate-600',
  Complete: 'bg-teal-100 text-teal-700',
};

export const balanceChipClass: Record<string, string> = {
  Overdue: 'bg-red-100 text-red-600',
  Paid: 'bg-emerald-100 text-emerald-700',
  '—': 'bg-slate-100 text-slate-600',
};

export const patientTemplate = (overrides: Partial<Patient> = {}): Patient => ({
  id: 'P-1000',
  firstName: 'New',
  lastName: 'Patient',
  dob: '2000-01-01',
  gender: 'Female',
  phone: '+63 917 555 0000',
  email: 'new.patient@email.com',
  primaryPractitioner: 'Dr. Sarah Jenkins',
  status: 'Active',
  lastApptDate: '2026-09-11',
  lastApptTreatment: 'General exam',
  nextApptDate: '2026-09-18',
  nextApptTreatment: 'Follow up',
  treatmentArea: 'Hygiene',
  balance: 0,
  notes: '',
  treatmentSteps: [
    { id: 'step-1', label: 'Clinical Exam', status: 'Not Started' },
    { id: 'step-2', label: 'X-Rays & Imaging', status: 'Not Started' },
    { id: 'step-3', label: 'Treatment Plan', status: 'Not Started' },
    { id: 'step-4', label: 'Orthodontic Treatment', status: 'Not Started' },
    { id: 'step-5', label: 'Retention & Follow-up', status: 'Not Started' },
  ],
  ledger: [],
  ...overrides,
});

export const formatCurrency = (value: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value);

export const getPatientAge = (dob: string) => {
  const [birthYear, birthMonth, birthDay] = dob.split('-').map(Number);
  const today = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date()).map((part) => [part.type, Number(part.value)]));
  let age = today.year - birthYear;
  if (today.month < birthMonth || (today.month === birthMonth && today.day < birthDay)) age -= 1;
  return age;
};

export const getTreatmentProgress = (steps: { status: string }[]) => {
  const done = steps.filter((step) => step.status === 'Done').length;
  return Math.round((done / steps.length) * 100);
};

export const normalizePhone = (value: string) => value.replace(/\D/g, '');

export const toShortDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};
