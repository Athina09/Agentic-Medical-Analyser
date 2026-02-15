import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HeroPage from "@/pages/HeroPage";
import DiagnosisPage from "@/pages/DiagnosisPage";
import ChatPage from "@/pages/ChatPage";
import ExplainPage from "@/pages/ExplainPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HeroPage />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/explain" element={<ExplainPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
