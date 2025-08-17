import React, { useState, useRef } from 'react';
import { FileText, X, CheckCircle, AlertCircle, Upload, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  onUpload?: (url: string) => void;
}

const CLOUDINARY_UPLOAD_PRESET = 'masshura_docs';
const CLOUDINARY_CLOUD_NAME = 'domqsb9le';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FORMATS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt', 'rtf'];

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload }) => {
  type Slot = {
    file: File | null;
    uploading: boolean;
    uploadedUrl: string | null;
    id: number;
    isReplacing: boolean;
    uploadProgress: number;
    error: string | null;
    originalFileName: string | null;
  };
  
  const [slots, setSlots] = useState<Slot[]>([
    { 
      file: null, 
      uploading: false, 
      uploadedUrl: null, 
      id: Date.now(), 
      isReplacing: false,
      uploadProgress: 0,
      error: null,
      originalFileName: null
    }
  ]);
  
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
    
    // Check file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_FORMATS.includes(fileExtension)) {
      return `File format not supported. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`;
    }
    
    return null;
  };

  const handleFileChange = (slotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validationError = validateFile(selectedFile);
      
      if (validationError) {
        toast.error(validationError);
        e.target.value = ''; // Clear the input
        return;
      }

      setSlots(prev => prev.map(slot => 
        slot.id === slotId ? { 
          ...slot, 
          file: selectedFile, 
          error: null,
          uploadProgress: 0,
          isReplacing: !!slot.uploadedUrl // Set replacing mode if there's already an uploaded file
        } : slot
      ));
    }
  };

  const handleUpload = async (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, uploading: true, uploadProgress: 0, error: null } : slot
    ));

    const formData = new FormData();
    formData.append('file', slot.file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Add Cloudinary transformation parameters
    formData.append('quality', 'auto');
    formData.append('fetch_format', 'auto');
    
    // Add tags for better organization
    formData.append('tags', 'masshura,document,upload');
    
    // Add context for metadata
    formData.append('context', `original_name=${slot.file.name}|upload_time=${new Date().toISOString()}`);

    try {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setSlots(prev => prev.map(s => 
            s.id === slotId ? { ...s, uploadProgress: progress } : s
          ));
        }
      });

      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error occurred'));
        xhr.ontimeout = () => reject(new Error('Upload timeout'));
      });

      xhr.timeout = 60000; // 60 second timeout
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`);
      xhr.send(formData);

      const data = await uploadPromise;
      
      console.log('Cloudinary Response:', data);
      
      if (data.secure_url) {
        setSlots(prev => prev.map(s => s.id === slotId ? { 
          ...s, 
          uploadedUrl: data.secure_url, 
          uploading: false,
          isReplacing: false,
          uploadProgress: 100,
          originalFileName: slot.file?.name || null,
          file: null // Clear file after successful upload
        } : s));
        
        onUpload?.(data.secure_url);
        toast.success(`Document "${slot.file.name}" uploaded successfully!`);
        
        // Add a new slot if this is the last slot and all slots are filled
        setTimeout(() => {
          setSlots(prev => {
            const allUploaded = prev.every(s => s.uploadedUrl);
            if (allUploaded) {
              return [...prev, { 
                file: null, 
                uploading: false, 
                uploadedUrl: null, 
                id: Date.now() + Math.random(),
                isReplacing: false,
                uploadProgress: 0,
                error: null,
                originalFileName: null
              }];
            }
            return prev;
          });
        }, 200);
      } else {
        throw new Error('No secure URL in response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      toast.error(`Upload failed: ${errorMessage}`);
      setSlots(prev => prev.map(s => s.id === slotId ? { 
        ...s, 
        uploading: false, 
        error: errorMessage,
        uploadProgress: 0
      } : s));
    }
  };

  const handleReplace = (slotId: number) => {
    // Trigger file input click to select new file
    if (fileInputRefs.current[slotId]) {
      fileInputRefs.current[slotId]!.click();
    }
  };

  const handleRemove = (slotId: number) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { 
        ...slot, 
        file: null, 
        uploadedUrl: null, 
        uploading: false,
        isReplacing: false,
        uploadProgress: 0,
        error: null,
        originalFileName: null
      } : slot
    ));
    
    // Clear the file input
    if (fileInputRefs.current[slotId]) {
      fileInputRefs.current[slotId]!.value = '';
    }
  };

  const getFileDisplayName = (slot: Slot) => {
    if (slot.file) return slot.file.name;
    if (slot.originalFileName) return slot.originalFileName;
    return 'No file selected';
  };

  const renderProgressBar = (progress: number) => (
    <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
      <div 
        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  return (
    <div className="bg-slate-900/80 border-2 border-blue-700 border-double rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-400" /> Upload Documents
      </h3>
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
        {slots.map((slot) => (
          <div key={slot.id} className="bg-slate-800/50 border border-slate-600 rounded-xl p-6">
            <div className="flex flex-col gap-4">
              {/* File Input Section */}
              <div className="flex items-center gap-4">
                <input
                  ref={el => fileInputRefs.current[slot.id] = el}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.rtf"
                  onChange={e => handleFileChange(slot.id, e)}
                  className="hidden"
                />
                <div 
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRefs.current[slot.id]?.click()}
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span className="truncate">{getFileDisplayName(slot)}</span>
                  </div>
                </div>
                
                {(slot.uploadedUrl || slot.file) && (
                  <Button
                    onClick={() => handleRemove(slot.id)}
                    disabled={slot.uploading}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              {slot.uploading && renderProgressBar(slot.uploadProgress)}

              {/* Error Message */}
              {slot.error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{slot.error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                {/* Upload Button - Only active for new files */}
                <Button
                  onClick={() => handleUpload(slot.id)}
                  disabled={!slot.file || slot.uploading || slot.isReplacing}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold px-8 py-2 rounded-lg shadow-lg text-base transition-all duration-200 disabled:opacity-60"
                >
                  {slot.uploading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Uploading... {slot.uploadProgress}%
                    </div>
                  ) : 'Upload'}
                </Button>

                {/* Resubmit Button - Active when replacing files */}
                <Button
                  onClick={() => slot.isReplacing ? handleUpload(slot.id) : handleReplace(slot.id)}
                  disabled={slot.uploading || (!slot.uploadedUrl && !slot.isReplacing)}
                  className="bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-700 hover:to-orange-500 text-white font-semibold px-8 py-2 rounded-lg shadow-lg text-base transition-all duration-200 disabled:opacity-60"
                >
                  {slot.isReplacing && slot.file ? (
                    slot.uploading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Resubmitting... {slot.uploadProgress}%
                      </div>
                    ) : 'Resubmit'
                  ) : 'Replace'}
                </Button>

                {/* View Link */}
                {slot.uploadedUrl && !slot.isReplacing && (
                  <a
                    href={slot.uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 text-base font-medium px-4 py-2 border border-green-400 rounded-lg hover:border-green-300 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    View
                  </a>
                )}
              </div>

              {/* File Info */}
              {slot.file && (
                <div className="text-sm text-slate-400 text-center">
                  Size: {(slot.file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentUploader;