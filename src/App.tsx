import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { QRScanner } from './components/QRScanner';
import { ScanButton } from './components/ScanButton';
import { VerifiedPerson } from './components/VerifiedPerson';
import { NotVerifiedPerson } from './components/NotVerifiedPerson';
import { useCSVData } from './hooks/useCSVData';
import { Person } from './types';

type AppState = 'idle' | 'scanning' | 'verified' | 'not-verified';

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [scannedPerson, setScannedPerson] = useState<Person | null>(null);
  const [scannedId, setScannedId] = useState<string>('');
  const { findPersonByUniqueId, loading, error } = useCSVData();

  const handleStartScanning = () => {
    setState('scanning');
  };

  const handleScanResult = (result: string) => {
    const person = findPersonByUniqueId(result.trim());
    setScannedId(result.trim());
    
    if (person) {
      setScannedPerson(person);
      setState('verified');
    } else {
      setState('not-verified');
    }
  };

  const handleContinueScanning = () => {
    setScannedPerson(null);
    setScannedId('');
    setState('idle');
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {state === 'idle' && (
        <ScanButton onClick={handleStartScanning} />
      )}
      
      {state === 'scanning' && (
        <QRScanner 
          onScan={handleScanResult}
          isActive={true}
        />
      )}
      
      {state === 'verified' && scannedPerson && (
        <VerifiedPerson 
          person={scannedPerson}
          onContinueScanning={handleContinueScanning}
        />
      )}
      
      {state === 'not-verified' && (
        <NotVerifiedPerson 
          scannedId={scannedId}
          onContinueScanning={handleContinueScanning}
        />
      )}
    </Layout>
  );
}

export default App;