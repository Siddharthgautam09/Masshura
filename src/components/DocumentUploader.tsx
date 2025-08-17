import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  onUpload?: (url: string) => void;
}

const CLOUDINARY_UPLOAD_PRESET = 'your_unsigned_preset'; // Replace with your Cloudinary unsigned preset
const CLOUDINARY_CLOUD_NAME = 'your_cloud_name'; // Replace with your Cloudinary cloud name

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload }) => {
  type Slot = {
    file: File | null;
    uploading: boolean;
    uploadedUrl: string | null;
    id: number;
  };
  const [slots, setSlots] = useState<Slot[]>([
    { file: null, uploading: false, uploadedUrl: null, id: Date.now() }
  ]);

  const handleFileChange = (slotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, file: e.target.files![0] } : slot));
    }
  };

  const handleUpload = async (slotId: number) => {
    setSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, uploading: true } : slot));
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.file) {
      toast.error('Please select a file to upload.');
      setSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, uploading: false } : slot));
      return;
    }
    const formData = new FormData();
    formData.append('file', slot.file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, uploadedUrl: data.secure_url, uploading: false } : s));
        onUpload?.(data.secure_url);
        toast.success('Document uploaded successfully!');
        // Add a new slot if this is the last slot
        setTimeout(() => {
          setSlots(prev => {
            if (prev.every(s => s.uploadedUrl)) {
              return [...prev, { file: null, uploading: false, uploadedUrl: null, id: Date.now() + Math.random() }];
            }
            return prev;
          });
        }, 200);
      } else {
        toast.error('Upload failed.');
        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, uploading: false } : s));
      }
    } catch (err) {
      toast.error('Upload failed.');
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, uploading: false } : s));
    }
  };

  return (
      <div className="bg-slate-900/80 border-2 border-blue-700 border-double rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-400" /> Upload Documents
        </h3>
        <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
          {slots.map((slot, idx) => (
            <div key={slot.id} className="flex flex-col md:flex-row gap-4 items-center w-full">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={e => handleFileChange(slot.id, e)}
                disabled={!!slot.uploadedUrl}
                className="w-full md:w-auto bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="flex gap-3 w-full md:w-auto justify-center">
                <Button
                  onClick={() => handleUpload(slot.id)}
                  disabled={!slot.file || slot.uploading || !!slot.uploadedUrl}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold px-8 py-2 rounded-lg shadow-lg text-base transition-all duration-200 disabled:opacity-60"
                  style={{ minWidth: 120 }}
                >
                  {slot.uploading ? 'Uploading...' : slot.uploadedUrl ? 'Uploaded' : 'Upload'}
                </Button>
                <Button
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold px-8 py-2 rounded-lg shadow-lg text-base transition-all duration-200"
                  onClick={() => setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, file: null, uploadedUrl: null, uploading: false } : s))}
                  disabled={slot.uploading}
                >
                  Resubmit
                </Button>
                {slot.uploadedUrl && (
                  <a
                    href={slot.uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-base font-medium ml-4"
                  >
                    View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default DocumentUploader;
