import { afterEach, describe, expect, it, vi } from 'vitest';
import { appointments, getPatientAge, localDateKey, normalizePhone, patientSeedData, toShortDate } from './mockData';

afterEach(() => vi.useRealTimers());

describe('date and phone helpers', () => {
  it('calculates ages against today using local calendar dates', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-15T18:30:00.000Z'));

    expect(getPatientAge('1985-10-15')).toBe(41);
    expect(getPatientAge('1985-10-17')).toBe(40);
    expect(localDateKey()).toBe('2026-10-16');
    expect(toShortDate('2026-10-16')).toBe('Oct 16, 2026');
  });

  it('normalizes phone searches independently of punctuation', () => {
    expect(normalizePhone('+63 917-555-0123')).toBe('639175550123');
  });

  it('keeps patient IDs unique and In Chair status consistent with the schedule', () => {
    const ids = patientSeedData.map((patient) => patient.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const patient of patientSeedData.filter((record) => record.status === 'In Chair')) {
      const appointment = appointments.find((record) => record.patient === `${patient.firstName} ${patient.lastName}`);
      expect(appointment?.status).toBe('in-chair');
    }
  });
});