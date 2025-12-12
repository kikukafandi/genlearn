'use client';

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  className = ''
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-geist mb-2 text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-5 py-3 border-2 rounded-xl focus:ring-4 focus:ring-teal-200 focus:border-teal-500 outline-none transition-all duration-300 shadow-sm bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
      />
    </div>
  );
}
