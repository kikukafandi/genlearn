'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { FaFileUpload, FaClipboard, FaTimes } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';

export default function CvParserModal({ isOpen, onClose, onDataExtracted }) {
  const { theme } = useTheme();
  const [inputType, setInputType] = useState('text'); // 'text' or 'file'
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        setCvFile(file);
        setError('');
      } else {
        setError('Format file tidak didukung. Gunakan .txt');
        setCvFile(null);
      }
    }
  };

  const handleParseCv = async () => {
    setError('');

    if (inputType === 'text' && !cvText.trim()) {
      setError('Silakan masukkan teks CV');
      return;
    }

    if (inputType === 'file' && !cvFile) {
      setError('Silakan pilih file CV');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('inputType', inputType);

      if (inputType === 'file') {
        formData.append('cvFile', cvFile);
      } else {
        formData.append('cvInput', cvText);
      }

      const res = await fetch('/api/ai/cv-parser', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Call the callback with extracted data
        onDataExtracted(data.data);
        handleClose();
      } else {
        setError(data.error || 'Gagal mem-parse CV. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('CV Parser error:', err);
      setError('Terjadi kesalahan saat memproses CV. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCvText('');
    setCvFile(null);
    setError('');
    setInputType('text');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl mx-4 rounded-3xl border-2 shadow-2xl p-6 md:p-8 ${
          theme === 'dark'
            ? 'bg-gray-800 border-purple-500'
            : 'bg-white border-blue-300'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 ${
            theme === 'dark' ? 'hover:bg-gray-700' : ''
          }`}
        >
          <FaTimes className="text-xl text-gray-500" />
        </button>

        <h2 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Parse CV untuk DNA Skill
        </h2>
        <p className={`mb-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Upload CV atau copy-paste teks CV Anda. AI akan menganalisis dan mengekstrak skill, pengalaman, dan minat Anda.
        </p>

        {/* Input Type Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setInputType('text')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              inputType === 'text'
                ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaClipboard /> Paste Teks
          </button>
          <button
            onClick={() => setInputType('file')}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              inputType === 'file'
                ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FaFileUpload /> Upload File
          </button>
        </div>

        {/* Content Area */}
        {inputType === 'text' ? (
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Paste CV Anda di bawah ini:
            </label>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Contoh: John Doe, Senior Software Engineer at TechCorp, skilled in JavaScript, React, Node.js..."
              className={`w-full h-48 p-4 rounded-xl border-2 font-mono text-sm resize-none focus:outline-none transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700 border-purple-500 text-white placeholder-gray-500 focus:border-purple-400'
                  : 'bg-gray-50 border-blue-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }`}
            />
            <p className={`text-xs mt-2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              Minimal 100 karakter. Semakin detail CV Anda, semakin akurat hasil parsing.
            </p>
          </div>
        ) : (
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Upload File CV (.txt):
            </label>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700 border-purple-500 text-white file:bg-purple-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer'
                  : 'bg-gray-50 border-blue-300 text-gray-900 file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer'
              }`}
            />
            {cvFile && (
              <p className={`text-sm mt-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                ✓ File dipilih: {cvFile.name}
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 rounded-xl">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            onClick={handleParseCv}
            className="flex-1 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <FaClipboard /> Parse CV
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
