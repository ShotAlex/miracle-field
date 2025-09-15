'use client';

import { useState, useEffect } from 'react';

interface EffectsControlProps {
  onConfettiToggle: (enabled: boolean) => void;
  onEffectsToggle: (enabled: boolean) => void;
}

export default function EffectsControl({ onConfettiToggle, onEffectsToggle }: EffectsControlProps) {
  const [confettiEnabled, setConfettiEnabled] = useState(true);
  const [effectsEnabled, setEffectsEnabled] = useState(true);

  // Загружаем настройки из localStorage
  useEffect(() => {
    const savedConfetti = localStorage.getItem('effects-confetti');
    const savedEffects = localStorage.getItem('effects-animations');
    
    if (savedConfetti !== null) {
      const enabled = savedConfetti === 'true';
      setConfettiEnabled(enabled);
      onConfettiToggle(enabled);
    }
    
    if (savedEffects !== null) {
      const enabled = savedEffects === 'true';
      setEffectsEnabled(enabled);
      onEffectsToggle(enabled);
    }
  }, [onConfettiToggle, onEffectsToggle]);

  const handleConfettiToggle = () => {
    const newState = !confettiEnabled;
    setConfettiEnabled(newState);
    localStorage.setItem('effects-confetti', newState.toString());
    onConfettiToggle(newState);
  };

  const handleEffectsToggle = () => {
    const newState = !effectsEnabled;
    setEffectsEnabled(newState);
    localStorage.setItem('effects-animations', newState.toString());
    onEffectsToggle(newState);
  };

  return (
    <div className="effects-control">
      <button
        onClick={handleConfettiToggle}
        className={`effects-button ${confettiEnabled ? 'enabled' : 'disabled'}`}
        title={confettiEnabled ? 'Отключить конфетти' : 'Включить конфетти'}
      >
        🎊
      </button>
      
      <button
        onClick={handleEffectsToggle}
        className={`effects-button ${effectsEnabled ? 'enabled' : 'disabled'}`}
        title={effectsEnabled ? 'Отключить эффекты' : 'Включить эффекты'}
      >
        ✨
      </button>
    </div>
  );
}
