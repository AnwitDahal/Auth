import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import FloatingShape from "./components/FloatingShape";
import { Route, Routes } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import EmailVerificationPage from "./Pages/EmailVerificationPage";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-sky-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-blue-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-blue-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-blue-500"
        size="w-32 h-32"
        top="40%"
        left="10%"
        delay={2}
      />

      <Routes>
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
      </Routes>
    </div>
  );
}

export default App;
