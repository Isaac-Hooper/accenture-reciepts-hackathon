import { useState, useRef } from "react";
import { uploadReceipt } from "../services/api";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null); // null | 'uploading' | 'success' | 'error'
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f && (f.type.startsWith("image/") || f.type === "application/pdf")) {
      setFile(f);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    try {
      await uploadReceipt(file);
      setStatus("success");
      setFile(null);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-purple-400 mb-2">
        Upload a Receipt
      </h1>
      <p className="text-neutral-400 mb-6">
        Upload a receipt image or PDF to get started.
      </p>

      {/* Drop zone - Re-styled to Black & Purple */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all bg-black ${
          dragOver
            ? "border-purple-400 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            : "border-purple-600 hover:border-purple-400"
        }`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <div className="text-5xl mb-3 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">📄</div>
        {file ? (
          <p className="text-purple-300 font-medium">{file.name}</p>
        ) : (
          <>
            <p className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
              Drag & drop or click to select
            </p>
            <p className="text-purple-500/70 text-sm mt-1">Supports JPG, PNG, PDF</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* Adjusted Upload Button to fit the new scheme */}
      <button
        onClick={handleUpload}
        disabled={!file || status === "uploading"}
        className="mt-4 w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-900/20"
      >
        {status === "uploading" ? "Uploading..." : "Upload Receipt"}
      </button>

      {status === "success" && (
        <p className="mt-3 text-purple-400 text-center font-medium">
          ✅ Receipt uploaded successfully!
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-red-400 text-center font-medium">
          ❌ Upload failed — is the backend running?
        </p>
      )}
    </div>
  );
}