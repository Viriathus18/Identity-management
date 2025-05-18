import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function LoginRegister() {
  const [step, setStep] = useState("login");
  const [mode, setMode] = useState("login");
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [fingerprintScanned, setFingerprintScanned] = useState(false);
  const [fingerprintScanLoading, setFingerprintScanLoading] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);
  const [faceScanLoading, setFaceScanLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        setStep("fingerprint");
      } else {
        alert("Login failed: " + data.msg);
      }
    } catch (err) {
      alert("Error connecting to server.");
      console.error(err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID,
          password,
          fingerprint: "mock-fingerprint",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please log in.");
        setMode("login");
        setUserID("");
        setPassword("");
      } else {
        alert("Registration failed: " + data.msg);
      }
    } catch (err) {
      alert("Error connecting to server.");
      console.error(err);
    }
  };

  const handleFingerprintScan = () => {
    setFingerprintScanLoading(true);
    setTimeout(() => {
      setFingerprintScanned(true);
      setTimeout(() => {
        setStep("face");
        setFingerprintScanLoading(false);
        setFingerprintScanned(false);
      }, 1500);
    }, 2000);
  };

  const handleFaceScan = async () => {
    setFaceScanLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/scan-face", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setFaceScanned(true);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        alert("Face scan failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error scanning face:", error);
      alert("Error connecting to face scan server.");
    } finally {
      setFaceScanLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-[#ebdbb2] p-4 font-sans bg-[#1d2021]">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-[#282828] p-8 rounded-2xl shadow-lg"
            >
              <div className="text-center mb-6">
                <img
                  src="logo.webp"
                  alt="3D Logo"
                  className="mx-auto mb-4 w-14 h-14 rounded-2xl shadow-lg border border-[#3c3836]"
                />
                <div className="text-3xl font-bold">
                  {mode === "login" ? "Secure Login" : "Register"}
                </div>
                <p className="text-[#a89984] text-sm mt-2">
                  {mode === "login" ? (
                    <>
                      Don’t have an account yet?{" "}
                      <span
                        className="text-[#fabd2f] cursor-pointer"
                        onClick={() => setMode("signup")}
                      >
                        Sign up
                      </span>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <span
                        className="text-[#fabd2f] cursor-pointer"
                        onClick={() => setMode("login")}
                      >
                        Login
                      </span>
                    </>
                  )}
                </p>
              </div>

              <form
                onSubmit={mode === "login" ? handleLogin : handleSignup}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Username"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                  className="w-full p-3 bg-[#3c3836] text-[#ebdbb2] placeholder-[#a89984] rounded-lg focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-[#3c3836] text-[#ebdbb2] placeholder-[#a89984] rounded-lg focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#fabd2f] hover:bg-[#fe8019] text-[#1d2021] py-3 rounded-lg font-semibold"
                >
                  {mode === "login" ? "Login" : "Register"}
                </button>
              </form>

              {mode === "login" && (
                <>
                  <div className="my-6 text-center text-[#a89984]">OR</div>
                  <div className="flex justify-between gap-2">
                    <button className="flex-1 bg-[#3c3836] text-[#ebdbb2] p-3 rounded-lg"></button>
                    <button className="flex-1 bg-[#3c3836] text-[#ebdbb2] p-3 rounded-lg">G</button>
                    <button className="flex-1 bg-[#3c3836] text-[#ebdbb2] p-3 rounded-lg">X</button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === "fingerprint" && (
            <motion.div
              key="fingerprint"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-[#282828] p-8 rounded-2xl shadow-lg text-center"
            >
              <h2 className="text-2xl font-bold mb-6">Scan your Fingerprint</h2>
              <div className="text-[#a89984] mb-4">
                {fingerprintScanned
                  ? "Fingerprint scanned!"
                  : "Place your finger on the scanner"}
              </div>

              {fingerprintScanned ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-4"
                >
                  <svg
                    className="w-full h-full text-[#b8bb26]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              ) : (
                <img
                  src="fingerprint.gif"
                  alt="Fingerprint Scan"
                  className="w-24 h-24 mx-auto mb-4 animate-pulse"
                />
              )}

              <button
                onClick={handleFingerprintScan}
                className="mt-4 w-full bg-[#d3869b] hover:bg-[#b16286] text-[#1d2021] py-3 rounded-lg font-semibold"
                disabled={fingerprintScanLoading || fingerprintScanned}
              >
                {fingerprintScanLoading
                  ? "Scanning..."
                  : fingerprintScanned
                    ? "Scanned"
                    : "Scan Fingerprint"}
              </button>
            </motion.div>
          )}

          {step === "face" && (
            <motion.div
              key="face"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-[#282828] p-8 rounded-2xl shadow-lg text-center"
            >
              <h2 className="text-2xl font-bold mb-6">Scan your Face</h2>
              <div className="text-[#a89984] mb-4">
                {faceScanned ? "Face scanned successfully!" : "Looking for your face..."}
              </div>

              {!faceScanned ? (
                <img
                  src="face-scan.gif"
                  alt="Face Scan"
                  className="w-24 h-24 mx-auto mb-4 animate-pulse"
                />
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#b8bb26]"
                >
                  <span className="text-[#1d2021] text-4xl font-bold">✓</span>
                </motion.div>
              )}

              <button
                onClick={handleFaceScan}
                className="mt-4 w-full bg-[#b8bb26] hover:bg-[#98971a] text-[#1d2021] py-3 rounded-lg font-semibold"
                disabled={faceScanLoading || faceScanned}
              >
                {faceScanLoading
                  ? "Scanning Face..."
                  : faceScanned
                    ? "Face Scanned"
                    : "Scan your Face"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
