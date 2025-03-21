export function Card({ children, className }) {
    return <div className={`bg-white p-4 rounded-lg shadow ${className}`}>{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div className="p-2">{children}</div>;
  }
  