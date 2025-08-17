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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setUploadedUrl(data.secure_url);
        onUpload?.(data.secure_url);
        toast.success('Document uploaded successfully!');
      } else {
        toast.error('Upload failed.');
      }
    } catch (err) {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-800/70 border border-slate-600/50 rounded-xl p-6 shadow-xl mt-6">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-400" /> Upload Documents
      </h3>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} className="w-full md:w-auto" />
        <Button onClick={handleUpload} disabled={!file || uploading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {uploadedUrl && (
        <div className="mt-4">
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Uploaded Document</a>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
