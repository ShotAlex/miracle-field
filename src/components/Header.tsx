'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [description, setDescription] = useState('Выберите участника случайным образом');
  const [isEditing, setIsEditing] = useState(false);

  // Загружаем сохранённый текст из localStorage
  useEffect(() => {
    const savedDescription = localStorage.getItem('miracle-field-description');
    if (savedDescription) {
      setDescription(savedDescription);
    }
  }, []);

  // Сохраняем в localStorage при изменении
  const handleSave = (newDescription: string) => {
    setDescription(newDescription);
    localStorage.setItem('miracle-field-description', newDescription);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave(e.currentTarget.value);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleSave(e.currentTarget.value);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1>🎡 Поле Чудес</h1>
          {isEditing ? (
            <input
              type="text"
              className="header-description-input"
              defaultValue={description}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
              placeholder="Введите описание..."
            />
          ) : (
            <p 
              className="header-description"
              onClick={() => setIsEditing(true)}
              title="Нажмите для редактирования"
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
