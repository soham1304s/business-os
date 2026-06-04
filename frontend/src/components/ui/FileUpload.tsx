import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { API_URL } from '../../config';
import { useAuthStore } from '../../store/authStore';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export function FileUpload({ onUploadSuccess, label = "Upload File" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuthStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUploadSuccess(data.url);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
        ) : (
          <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors mb-2" />
        )}
        <span className="text-sm font-medium text-slate-600">
          {isUploading ? 'Uploading securely...' : label}
        </span>
        <span className="text-xs text-slate-400 mt-1">
          Powered by Cloudinary
        </span>
      </button>

      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
          <X className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
}
