import { useEffect } from "react";
import { CheckIcon } from "./icons";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up flex items-center gap-2.5 px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-full shadow-lg"
    >
      <CheckIcon className="w-4 h-4 text-green-400 shrink-0" />
      {message}
    </div>
  );
}
