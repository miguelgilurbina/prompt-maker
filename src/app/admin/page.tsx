// src/app/admin/page.tsx (página temporal para testing)
"use client";

import { useState } from "react";
import { createAnonymousPrompt } from "@/lib/services/api";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createAnonymousPrompt({
        title,
        content,
        description: "Prompt de prueba",
        tags: ["test", "mvp"],
        isPublic: true,
      });

      console.log("✅ Prompt creado:", result);
      alert("Prompt creado exitosamente!");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error al crear prompt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Crear Prompt de Prueba</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Contenido:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Prompt"}
        </button>
      </form>
    </div>
  );
}
