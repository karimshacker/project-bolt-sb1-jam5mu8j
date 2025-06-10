import { useState, useEffect } from 'react';
import { Person } from '../types';
import { parseCSV } from '../utils/csvParser';

export const useCSVData = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCSVData = async () => {
      try {
        const response = await fetch('/assets/data.csv');
        if (!response.ok) {
          throw new Error('Failed to load CSV data');
        }
        const csvText = await response.text();
        const parsedPeople = parseCSV(csvText);
        setPeople(parsedPeople);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadCSVData();
  }, []);

  const findPersonByUniqueId = (uniqueId: string): Person | undefined => {
    return people.find(person => person.uniqueId === uniqueId);
  };

  return { people, loading, error, findPersonByUniqueId };
};