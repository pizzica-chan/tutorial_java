import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { TrackPage } from "./pages/TrackPage";
import { LessonPage } from "./pages/LessonPage";
import { LabPage } from "./pages/LabPage";
import { GlossaryPage } from "./pages/GlossaryPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tracks/:trackId" element={<TrackPage />} />
        <Route path="/tracks/:trackId/:lessonId" element={<LessonPage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
