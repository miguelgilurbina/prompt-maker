"use client";
// src/app/test/page.tsx
import ConnectionTest from "@/components/tests/ConnectionTest";
import Link from "next/link";

export default function TestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Página de Pruebas - Prompt Maker
      </h1>

      <div className="grid gap-6">
        <ConnectionTest />

        <div className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-3">
            Enlaces Rápidos para Pruebas
          </h3>
          <div className="flex gap-4">
            <Link
              href="/explore"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ir a Explore Page
            </Link>
            <Link
              href="/api/health"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              target="_blank"
            >
              Ver Health Check API
            </Link>
          </div>
        </div>

        <div className="p-5 border border-gray-300 rounded-lg bg-white shadow-sm">
          <h3 className="text-xl font-bold mb-3">Checklist de Verificación</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Backend corriendo en puerto 5000</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Frontend corriendo en puerto 3000</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>MongoDB Atlas conectado</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Variables de entorno configuradas</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>CORS habilitado en backend</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
