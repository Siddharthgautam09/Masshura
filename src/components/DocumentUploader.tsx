
import React, { useState, useRef } from 'react';
import { FileText, X, CheckCircle, AlertCircle, Upload, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  onUpload?: (cloudinaryData: any) => void;
  initialDocuments?: Array<{
    url: string;
    name: string;
    secure_url?: string;
    [key: string]: any;
  }>;
}

const CLOUDINARY_UPLOAD_PRESET = 'masshura_docs';
const CLOUDINARY_CLOUD_NAME = 'domqsb9le';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FORMATS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'txt', 'rtf'];

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload, initialDocuments }) => {
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
  
  const [slots, setSlots] = useState<Slot[]>(() => {
    if (initialDocuments && initialDocuments.length > 0) {
      return initialDocuments.map((doc, idx) => ({
        file: null,
        uploading: false,
        uploadedUrl: doc.secure_url || doc.url,
        id: Date.now() + idx,
        isReplacing: false,
        uploadProgress: 100,
        error: null,
        originalFileName: doc.name || null
      }));
    }
    return [{
      file: null,
      uploading: false,
      uploadedUrl: null,
      id: Date.now(),
      isReplacing: false,
      uploadProgress: 0,
      error: null,
      originalFileName: null
    }];
  });
  // If initialDocuments changes (e.g. after refresh), update slots
  React.useEffect(() => {
    if (initialDocuments && initialDocuments.length > 0) {
      setSlots(initialDocuments.map((doc, idx) => ({
        file: null,
        uploading: false,
        uploadedUrl: doc.secure_url || doc.url,
        id: Date.now() + idx,
        isReplacing: false,
        uploadProgress: 100,
        error: null,
        originalFileName: doc.name || null
      })));
    }
  }, [initialDocuments]);
  
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
        e.target.value = '';
        return;
      }
      setSlots(prev => prev.map(slot =>
        slot.id === slotId ? { ...slot, file: selectedFile, isReplacing: false, error: null } : slot
      ));
    } else {
      toast.error('Please select a file to upload.');
    }
  };

  const handleUpload = async (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.file) {
      toast.error('No file selected for upload.');
      return;
    }
    setSlots(prev => prev.map(s =>
      s.id === slotId ? { ...s, uploading: true, uploadProgress: 0, error: null } : s
    ));

    const formData = new FormData();
    formData.append('file', slot.file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('quality', 'auto');
    formData.append('fetch_format', 'auto');
    formData.append('tags', 'masshura,document,upload');
    formData.append('context', `original_name=${slot.file.name}|upload_time=${new Date().toISOString()}`);

    try {
      const xhr = new XMLHttpRequest();
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
      xhr.timeout = 60000;
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`);
      xhr.send(formData);
      const data = await uploadPromise;
      if (data.secure_url) {
        setSlots(prev => {
          const newSlots = prev.map(s => s.id === slotId ? {
            ...s,
            uploadedUrl: data.secure_url,
            uploading: false,
            isReplacing: false,
            uploadProgress: 100,
            originalFileName: slot.file?.name || null,
            file: null
          } : s);
          // Call onUpload with all uploaded document metadata
          if (onUpload) {
            const uploadedDocs = newSlots
              .filter(s => s.uploadedUrl)
              .map(s => ({
                url: s.uploadedUrl,
                name: s.originalFileName,
                // Add more fields if needed from Cloudinary response
              }));
            onUpload(uploadedDocs);
          }
          return newSlots;
        });
        toast.success(`Document \"${slot.file.name}\" uploaded successfully!`);
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
    setSlots(prev => {
      const newSlots = prev.map(slot =>
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
      );
      // Call onUpload with all uploaded document metadata
      if (onUpload) {
        const uploadedDocs = newSlots
          .filter(s => s.uploadedUrl)
          .map(s => ({
            url: s.uploadedUrl,
            name: s.originalFileName,
            // Add more fields if needed
          }));
        onUpload(uploadedDocs);
      }
      return newSlots;
    });
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
                <div className="flex gap-3 justify-center items-center">
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

                  {/* Resubmit/Replace Button */}
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

                  {/* View Link - always next to Replace */}
                  {slot.uploadedUrl && !slot.isReplacing && (
                    <>
                      <a
                        href={slot.uploadedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 text-base font-medium px-4 py-2 border border-green-400 rounded-lg hover:border-green-300 transition-colors ml-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        View
                      </a>
                      <a
                        href={slot.uploadedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-base font-medium px-4 py-2 border border-blue-400 rounded-lg hover:border-blue-300 transition-colors ml-2"
                        title="Info"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
                        </svg>
                        <span className="sr-only">Info</span>
                      </a>
                    </>
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
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => {
              setSlots(prev => ([
                ...prev,
                {
                  file: null,
                  uploading: false,
                  uploadedUrl: null,
                  id: Date.now() + Math.random(),
                  isReplacing: false,
                  uploadProgress: 0,
                  error: null,
                  originalFileName: null
                }
              ]));
            }}
            title="Add another document"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="sr-only">Add another document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;