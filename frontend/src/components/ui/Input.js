export function Input({ placeholder, className, ...props }) {
    return (
      <input
        className={`border p-2 rounded-lg w-full ${className}`}
        placeholder={placeholder}
        {...props}
      />
    );
  }
  