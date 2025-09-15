'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPieces([]);
      return;
    }

    // Создаем конфетти один раз
    setPieces(Array.from({ length: 100 }, (_, i) => i));

    // Завершаем через 4 секунды
    const timeout = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timeout);
  }, [isActive, onComplete]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map((id) => (
        <div
          key={id}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)]
          }}
        />
      ))}
    </div>
  );
}
