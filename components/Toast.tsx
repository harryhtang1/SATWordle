"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: number;
  text: string;
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: number) => void;
}

export default function Toast({ messages, onRemove }: ToastProps) {
  return (
    <div className="fixed top-[72px] left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {messages.map((msg) => (
        <ToastItem key={msg.id} message={msg} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ message, onRemove }: { message: ToastMessage; onRemove: (id: number) => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide   = setTimeout(() => setVisible(false), 1400);
    const remove = setTimeout(() => onRemove(message.id), 1700);
    return () => { clearTimeout(hide); clearTimeout(remove); };
  }, [message.id, onRemove]);

  return (
    <div
      className={`px-4 py-2 rounded-lg bg-[#1a1a1b] text-white font-bold text-sm shadow-md transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {message.text}
    </div>
  );
}
