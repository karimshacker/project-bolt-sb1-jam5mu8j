import { Person } from '../types';

export const parseCSV = (csvText: string): Person[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return {
      firstName: values[0] || '',
      lastName: values[1] || '',
      idNumber: values[2] || '',
      affiliation: values[3] || '',
      dateOfBirth: values[4] || '',
      uniqueId: values[5] || '',
      createdAt: values[6] || ''
    };
  });
};