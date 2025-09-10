'use client';

import { useState } from 'react';

interface NameInputProps {
  onAddName: (name: string) => void;
}

export default function NameInput({ onAddName }: NameInputProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddName(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="name-input">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Введите имя участника"
        className="name-input__field"
      />
      <button type="submit" className="name-input__button">
        Добавить
      </button>
    </form>
  );
}
