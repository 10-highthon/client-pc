import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter, Route, Routes } from "react-router";
import Pip from "./pages/pip/page";
import Chat from "./pages/chat/page";
import Background from "./pages/background/page";
import Main from "./pages/main/page";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/pip" element={<Pip />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/background" element={<Background />} />
    </Routes>
  </HashRouter>
);
