'use client';

import { useState, useRef } from 'react';
import Button from './Button';

interface ImageUploadProps {
  currentImage?: string; // base64 or URL
  onImageChange: (base64: string | null) => void;
  label?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  label = 'Upload Image',
  maxSizeMB = 10,
  className = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be less than ${maxSizeMB}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-text-primary">
          {label}
        </label>
      )}
      
      <div className="space-y-3">
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-danger/80 transition-colors"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <Button 
            type="button" 
            size="sm" 
            variant="outline"
            onClick={handleUploadClick}
          >
            {preview ? 'Change Image' : 'Upload Image'}
          </Button>
          {preview && (
            <Button type="button" size="sm" variant="danger" onClick={handleRemove}>
              Remove
            </Button>
          )}
        </div>
        
        {error && (
          <div className="text-sm text-danger">{error}</div>
        )}
        
        <p className="text-xs text-text-secondary">
          Max size: {maxSizeMB}MB. Supported: JPG, PNG, GIF, WebP
        </p>
      </div>
    </div>
  );
}
