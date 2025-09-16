'use client';

import { useState, useEffect } from 'react';

interface EffectsControlProps {
  confettiEnabled: boolean;
  effectsEnabled: boolean;
  onConfettiToggle: (enabled: boolean) => void;
  onEffectsToggle: (enabled: boolean) => void;
}

export default function EffectsControl({
  confettiEnabled,
  effectsEnabled,
  onConfettiToggle,
  onEffectsToggle,
}: EffectsControlProps) {
  return (
    <div className="effects-control">
      <button
        className={`effects-button ${confettiEnabled ? 'enabled' : 'disabled'}`}
        onClick={() => onConfettiToggle(!confettiEnabled)}
        title={confettiEnabled ? 'Отключить конфетти' : 'Включить конфетти'}
      >
        {confettiEnabled ? '🎊' : '❌'}
      </button>
      
      <button
        className={`effects-button ${effectsEnabled ? 'enabled' : 'disabled'}`}
        onClick={() => onEffectsToggle(!effectsEnabled)}
        title={effectsEnabled ? 'Отключить визуальные эффекты' : 'Включить визуальные эффекты'}
      >
        {effectsEnabled ? '✨' : '👁️'}
      </button>
    </div>
  );
}