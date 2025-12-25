
import React from 'react';

interface FilePickerProps {
  label: string;
  accept: string;
  icon: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  description: string;
}

export const FilePicker: React.FC<FilePickerProps> = ({ 
  label, accept, icon, onFileSelect, selectedFile, description 
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="relative group">
        <input
          type="file"
          accept={accept}
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={`p-6 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center
          ${selectedFile ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}
        `}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
            ${selectedFile ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}
          `}>
            <i className={`fas ${icon} text-xl`}></i>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              {selectedFile ? selectedFile.name : `Select ${label}`}
            </p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
