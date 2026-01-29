import { useState } from 'react';
import { uploadImage } from '@/lib/image-upload';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const WARN_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
    const [uploading, setUploading] = useState(false);
    const [sizeWarning, setSizeWarning] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setSizeWarning('');

        // Validate file sizes
        for (const file of Array.from(files)) {
            if (file.size > MAX_FILE_SIZE) {
                setSizeWarning(`File "${file.name}" is too large (max 5MB). Please compress it before uploading.`);
                return;
            }
            if (file.size > WARN_FILE_SIZE) {
                setSizeWarning(`File "${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)}MB. Consider compressing for better performance.`);
            }
        }

        setUploading(true);
        const newUrls: string[] = [];

        for (const file of Array.from(files)) {
            const url = await uploadImage(file);
            if (url) {
                newUrls.push(url);
            }
        }

        onChange([...images, ...newUrls]);
        setUploading(false);
    };

    const handleRemove = (index: number) => {
        onChange(images.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Size Warning */}
            {sizeWarning && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm mb-3">
                    ⚠️ {sizeWarning}
                </div>
            )}

            {/* Upload Button */}
            <div>
                <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                    disabled={uploading}
                />
                <label
                    htmlFor="image-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${uploading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {uploading ? 'Uploading...' : (
                        <>
                            <Upload size={18} />
                            Upload Images
                        </>
                    )}
                </label>
            </div>
        </div>
    );
};
