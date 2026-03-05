import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Layout from './components/Layout/Layout';
import ChapterView from './components/Chapter/ChapterView';

function ChapterViewRoute() {
  const { id } = useParams<{ id: string }>();
  const chapterId = id ? parseInt(id, 10) : 1;
  return <ChapterView chapterId={chapterId} />;
}

function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ChapterView chapterId="home" />} />
        <Route path="/chapter/:id" element={<ChapterViewRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ProgressProvider>
  );
}
