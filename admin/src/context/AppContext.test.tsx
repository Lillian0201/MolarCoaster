import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { appointments } from '../data/mockData';
import { AppProvider, useAppContext } from './AppContext';

function ContextProbe() {
  const context = useAppContext();
  const patient = context.patients[0];
  const [createdIds, setCreatedIds] = useState<string[]>([]);

  return (
    <div>
      <output data-testid="patient-balance">{patient.balance}</output>
      <output data-testid="patient-notes">{patient.notes}</output>
      <output data-testid="gabriel-status">{context.patients.find((record) => record.id === 'P-1010')?.status}</output>
      <output data-testid="ledger-count">{patient.ledger.length}</output>
      <output data-testid="created-ids">{createdIds.join(',')}</output>
      <button onClick={() => context.recordPayment(patient.id, 500, 'QA payment')}>Record payment</button>
      <button onClick={() => context.recordPayment(patient.id, 99999, 'Overpayment attempt')}>Record overpayment</button>
      <button onClick={() => context.updatePatientNotes(patient.id, '<img src=x onerror=alert(1)> & notes')}>Update notes</button>
      <button onClick={() => context.toggleTreatmentStep(patient.id, patient.treatmentSteps[0].id)}>Toggle step</button>
      <button onClick={() => context.changeAppointmentStatus('apt-4', 'in-chair')}>Start Gabriel appointment</button>
      <button onClick={() => context.changeAppointmentStatus('apt-4', 'completed')}>Complete Gabriel appointment</button>
      <button onClick={() => {
        const first = context.addPatient({ firstName: 'Rapid', lastName: 'One' });
        const second = context.addPatient({ firstName: 'Rapid', lastName: 'Two' });
        setCreatedIds([first.id, second.id]);
      }}>Create patients quickly</button>
      <button onClick={() => context.addAppointment({
        patient: 'Conflict test',
        treatment: 'Exam',
        doctor: 'Dr. Sarah Jenkins',
        chairId: 'chair-1',
        status: 'confirmed',
        time: '09:45 AM',
        duration: 30,
        date: appointments[0].date,
        room: 'Op Room A',
        chairLabel: 'Chair #1',
        specialty: 'Hygiene',
      })}>Add overlapping appointment</button>
    </div>
  );
}

function renderContext() {
  return render(<AppProvider><ContextProbe /></AppProvider>);
}

describe('AppContext behavior', () => {
  it('rejects appointments that overlap on the same chair and date', async () => {
    const user = userEvent.setup();
    renderContext();
    await user.click(screen.getByRole('button', { name: 'Add overlapping appointment' }));
    expect(screen.queryByText('Conflict test')).not.toBeInTheDocument();
  });

  it('records payment and persists notes as text-safe data', async () => {
    const user = userEvent.setup();
    renderContext();
    await user.click(screen.getByRole('button', { name: 'Record payment' }));
    await user.click(screen.getByRole('button', { name: 'Update notes' }));
    expect(screen.getByTestId('patient-balance')).toHaveTextContent('2090');
    expect(screen.getByTestId('patient-notes')).toHaveTextContent('<img src=x onerror=alert(1)> & notes');
  });

  it('rejects overpayments without changing the ledger or balance', async () => {
    const user = userEvent.setup();
    renderContext();
    await user.click(screen.getByRole('button', { name: 'Record overpayment' }));
    expect(screen.getByTestId('patient-balance')).toHaveTextContent('2590');
    expect(screen.getByTestId('ledger-count')).toHaveTextContent('2');
  });

  it('generates distinct IDs for patients created in the same event', async () => {
    const user = userEvent.setup();
    renderContext();
    await user.click(screen.getByRole('button', { name: 'Create patients quickly' }));
    const ids = screen.getByTestId('created-ids').textContent?.split(',') ?? [];
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('toggles treatment steps without replacing other patient state', async () => {
    const user = userEvent.setup();
    renderContext();
    await user.click(screen.getByRole('button', { name: 'Toggle step' }));
    expect(screen.getByTestId('patient-balance')).toHaveTextContent('2590');
  });

  it('synchronizes In Chair status between appointments and patient records', async () => {
    const user = userEvent.setup();
    renderContext();
    await user.click(screen.getByRole('button', { name: 'Start Gabriel appointment' }));
    expect(screen.getByTestId('gabriel-status')).toHaveTextContent('In Chair');
    await user.click(screen.getByRole('button', { name: 'Complete Gabriel appointment' }));
    expect(screen.getByTestId('gabriel-status')).toHaveTextContent('Active');
  });
});
