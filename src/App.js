import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./views/HomePage/";
import CadastroPage from "./views/CadastroPage/";
import LoginPage from "./views/LoginPage/";
import PaymentPage from "./views/PaymentPage/";
import Dashboard from "./views/Eventos/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pagamento" element={<PaymentPage />} />
        <Route path="/dash" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
