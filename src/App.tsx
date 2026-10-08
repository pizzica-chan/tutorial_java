import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { TrackPage } from "./pages/TrackPage";
import { LessonPage } from "./pages/LessonPage";
import { LabPage } from "./pages/LabPage";
import { CheatSheetPage } from "./pages/CheatSheetPage";
import { DevtoolsPage } from "./pages/DevtoolsPage";
import { GlossaryPage } from "./pages/GlossaryPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const movedLessons = [
  { from: "java-map/arch", id: "arch" },
  { from: "troubleshoot/linux-basics", id: "linux-basics" },
  { from: "troubleshoot/http-server-log", id: "http-server-log" },
  { from: "troubleshoot/net-check", id: "net-check" },
  { from: "troubleshoot/middleware-check", id: "middleware-check" },
];

function MovedLesson({ id }: { id: string }) {
  const { search, hash } = useLocation();
  return <Navigate replace to={`/tracks/server-network/${id}${search}${hash}`} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        {movedLessons.map(({ from, id }) => (
          <Route key={from} path={`/tracks/${from}`} element={<MovedLesson id={id} />} />
        ))}
        <Route path="/tracks/:trackId" element={<TrackPage />} />
        <Route path="/tracks/:trackId/:lessonId" element={<LessonPage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/cheatsheet" element={<CheatSheetPage />} />
        <Route path="/devtools" element={<DevtoolsPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
