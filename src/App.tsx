import { DataProvider, useData } from './contexts/DataContext';
import { Layout } from './components/layout/Layout';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AllTransactions } from './components/dashboard/AllTransactions';
import { Dashboard } from './components/dashboard/Dashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SplashScreen } from './components/common/SplashScreen';

function AppContent() {
  const { loading } = useData();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<AllTransactions />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;
