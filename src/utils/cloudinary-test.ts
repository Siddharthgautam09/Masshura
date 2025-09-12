// Cloudinary Configuration Test Utility
// Use this to test your Cloudinary setup

export const testCloudinaryConfig = async () => {
  const CLOUDINARY_CLOUD_NAME = "domqsb9le";
  const CLOUDINARY_UPLOAD_PRESET = "supplier_document_uploads";
  
  console.log('Testing Cloudinary Configuration...');
  console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME);
  console.log('Upload Preset:', CLOUDINARY_UPLOAD_PRESET);
  
  try {
    // Test if the upload preset exists and is accessible
    const testUploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
    console.log('Upload URL:', testUploadUrl);
    
    // Create a minimal test upload (this will fail without a file, but will test the preset)
    const testFormData = new FormData();
    testFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(testUploadUrl, {
      method: 'POST',
      body: testFormData
    });
    
    const result = await response.json();
    console.log('Cloudinary Response:', result);
    
    if (response.status === 400 && result.error?.message?.includes('upload_preset')) {
      console.error('❌ Upload preset not found or not configured for unsigned uploads');
      return {
        success: false,
        error: 'Upload preset configuration issue',
        details: result.error
      };
    }
    
    if (response.status === 401) {
      console.error('❌ Authentication error - check your upload preset settings');
      return {
        success: false,
        error: 'Authentication error',
        details: result.error
      };
    }
    
    // If we get here with a 400 error about missing file, that's actually good!
    // It means the preset is accessible but we just didn't provide a file
    if (response.status === 400 && result.error?.message?.includes('file')) {
      console.log('✅ Upload preset is accessible (no file provided, but that\'s expected)');
      return {
        success: true,
        message: 'Upload preset is correctly configured'
      };
    }
    
    return {
      success: response.ok,
      status: response.status,
      details: result
    };
    
  } catch (error) {
    console.error('❌ Network error:', error);
    return {
      success: false,
      error: 'Network error',
      details: error
    };
  }
};

// Function to test file URL accessibility
export const testFileAccess = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`File URL test for ${url}:`, {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    return {
      accessible: response.ok,
      status: response.status,
      error: response.ok ? null : `HTTP ${response.status}`
    };
  } catch (error) {
    console.error(`File access error for ${url}:`, error);
    return {
      accessible: false,
      error: 'Network error or CORS issue'
    };
  }
};

// Run this in your browser console to test
if (typeof window !== 'undefined') {
  (window as any).testCloudinary = testCloudinaryConfig;
  (window as any).testFileAccess = testFileAccess;
  console.log('Test functions loaded! Run testCloudinary() or testFileAccess(url) in console');
}
