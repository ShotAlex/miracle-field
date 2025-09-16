'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  isActive: boolean;
  onComplete: () => void;
}

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
}

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPieces([]);
      return;
    }

    // Создаем конфетти только при активации
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const newPieces: ConfettiPiece[] = [];

    for (let i = 0; i < 100; i++) {
      newPieces.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1000,
        size: Math.random() * 6 + 4,
      });
    }

    setPieces(newPieces);

    // Через 4 секунды завершаем анимацию
    const timer = setTimeout(() => {
      setPieces([]);
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}