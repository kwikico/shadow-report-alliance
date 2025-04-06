
/**
 * Strips EXIF metadata from image files to protect user privacy
 */
export const stripExifData = async (file: File): Promise<File> => {
  // Only process image files
  if (!file.type.startsWith('image/')) {
    return file;
  }
  
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Canvas context not available');
      return file; // Return original if canvas not supported
    }
    
    // Create an image element to load the file
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    // Wait for the image to load
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image onto canvas (this strips the metadata)
    ctx.drawImage(img, 0, 0);
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          console.error('Canvas to Blob conversion failed');
          URL.revokeObjectURL(img.src); // Clean up object URL
          throw new Error('Failed to process image');
        }
      }, file.type);
    });
    
    // Clean up object URL
    URL.revokeObjectURL(img.src);
    
    // Create a new file from the blob
    return new File([blob], file.name, { type: file.type, lastModified: new Date().getTime() });
  } catch (error) {
    console.error('Error stripping EXIF data:', error);
    return file; // Return original file if processing fails
  }
};

/**
 * Generates a random pseudonym for anonymous users
 */
export const generatePseudonym = (): string => {
  const adjectives = [
    'Silent', 'Hidden', 'Vigilant', 'Observant', 'Steadfast',
    'Resolute', 'Watchful', 'Truthful', 'Diligent', 'Fearless'
  ];
  
  const nouns = [
    'Guardian', 'Witness', 'Sentinel', 'Observer', 'Protector',
    'Advocate', 'Voice', 'Agent', 'Defender', 'Whistleblower'
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}${randomNoun}`;
};

/**
 * Basic encryption helper (demonstration only - not for production use)
 * In a real app, you would use a proper encryption library
 */
export const encryptText = (text: string, key: string): string => {
  // This is a placeholder for demonstration
  // In production, use a proper end-to-end encryption library
  return `${text}_encrypted`;
};

/**
 * Basic decryption helper (demonstration only - not for production use)
 * In a real app, you would use a proper encryption library
 */
export const decryptText = (encryptedText: string, key: string): string => {
  // This is a placeholder for demonstration
  // In production, use a proper end-to-end encryption library
  return encryptedText.replace('_encrypted', '');
};
