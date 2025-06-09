// frontend/src/components/ConnectionTest.tsx
import { useState, useEffect } from "react";

type ConnectionStatus = "checking" | "success" | "error";

interface StatusState {
  api: ConnectionStatus;
  database: ConnectionStatus;
  prompts: ConnectionStatus;
}

const ConnectionTest = () => {
  const [status, setStatus] = useState<StatusState>({
    api: "checking",
    database: "checking",
    prompts: "checking",
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async (): Promise<void> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    // Test 1: Health check
    try {
      console.log("🔍 Testing health endpoint...");
      const response = await fetch(`${apiUrl}/api/health`);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Health check passed:", data);
        setStatus((prev) => ({ ...prev, api: "success" }));
      } else {
        setStatus((prev) => ({ ...prev, api: "error" }));
      }
    } catch (error) {
      console.error("❌ Health check failed:", error);
      setStatus((prev) => ({ ...prev, api: "error" }));
    }

    // Test 2: Verificar que puede obtener prompts públicos
    try {
      console.log("🔍 Testing public prompts endpoint...");
      const response = await fetch(`${apiUrl}/api/public/prompts`);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Public prompts received:", data);
        setStatus((prev) => ({ ...prev, prompts: "success" }));
      } else {
        console.error("❌ Public prompts error:", response.status);
        setStatus((prev) => ({ ...prev, prompts: "error" }));
      }
    } catch (error) {
      setStatus((prev) => ({ ...prev, prompts: "error" }));
      console.error("❌ Error getting public prompts:", error);
    }
  };

  const getStatusIcon = (status: ConnectionStatus): string => {
    switch (status) {
      case "checking":
        return "🔄";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "❓";
    }
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg m-5 bg-white shadow-sm">
      <h3 className="text-xl font-bold mb-3">Estado de Conexiones</h3>
      <div className="space-y-2">
        <p className="flex items-center gap-2">
          <span className="text-xl">{getStatusIcon(status.api)}</span>
          <span className="font-medium">API Health:</span>
          <span
            className={
              status.api === "success"
                ? "text-green-600"
                : status.api === "error"
                ? "text-red-600"
                : "text-gray-500"
            }
          >
            {status.api}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <span className="text-xl">{getStatusIcon(status.prompts)}</span>
          <span className="font-medium">Public Prompts:</span>
          <span
            className={
              status.prompts === "success"
                ? "text-green-600"
                : status.prompts === "error"
                ? "text-red-600"
                : "text-gray-500"
            }
          >
            {status.prompts}
          </span>
        </p>
      </div>
      <button
        onClick={runTests}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Reintentar Tests
      </button>
    </div>
  );
};

export default ConnectionTest;
