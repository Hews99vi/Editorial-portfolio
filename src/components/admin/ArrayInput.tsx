import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { X, Plus } from 'lucide-react';

interface ArrayInputProps {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

export const ArrayInput: React.FC<ArrayInputProps> = ({ label, value, onChange, placeholder = 'Add item...' }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim()) {
            onChange([...value, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="space-y-2">
                {value.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{item}</div>
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
                <div className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        className="flex-1"
                    />
                    <Button type="button" onClick={handleAdd} size="sm">
                        <Plus size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
