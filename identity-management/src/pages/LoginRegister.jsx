import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [fingerprintScanned, setFingerprintScanned] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);
  const [faceScanLoading, setFaceScanLoading] = useState(false);
  const navigate = useNavigate();

  const handleFingerprintScan = () => {
    alert("Fingerprint scanned successfully!");
    setFingerprintScanned(true);
  };

  const handleFaceScan = async () => {
    setFaceScanLoading(true);
    try {
      const response = await fetch('http://localhost:5000/scan-face', {
        method: 'POST',
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Face scanned successfully!");
        setFaceScanned(true);
      } else {
        alert('Face scan failed: ' + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error('Error scanning face:', error);
      alert('Error connecting to face scan server.');
    } finally {
      setFaceScanLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fingerprintScanned || !faceScanned) {
      alert("Please scan both your fingerprint and face first.");
      return;
    }

    const formType = isLogin ? "Login" : "Register";
    alert(`${formType} Successful!\nUserID: ${userID}`);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="UserID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            className="w-full p-2 border rounded-xl"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-xl"
            required
          />
          <button
            type="button"
            onClick={handleFingerprintScan}
            className="w-full bg-blue-500 text-white p-2 rounded-xl"
          >
            {fingerprintScanned ? "Fingerprint Scanned" : "Scan Fingerprint"}
          </button>

          {/* New Scan Face Button */}
          <button
            type="button"
            onClick={handleFaceScan}
            className={`w-full ${faceScanned ? 'bg-green-500' : 'bg-purple-500'} text-white p-2 rounded-xl`}
            disabled={faceScanLoading}
          >
            {faceScanLoading
              ? "Scanning Face..."
              : faceScanned
              ? "Face Scanned"
              : "Scan your Face"}
          </button>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-xl"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 underline"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
