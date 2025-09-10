'use client';

import { useState } from 'react';

interface Person {
  id: string;
  name: string;
  isSelected: boolean;
}

interface NamesListProps {
  people: Person[];
  onDeleteName: (id: string) => void;
  onEditName: (id: string, newName: string) => void;
  selectedPersonId: string | null;
  justSelectedId: string | null;
}

export default function NamesList({ people, onDeleteName, onEditName, selectedPersonId, justSelectedId }: NamesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleEditSave = (id: string) => {
    if (editValue.trim()) {
      onEditName(id, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="names-list">
      <h3>Участники ({people.length})</h3>
      <div className="names-list__items">
        {people.map((person) => (
          <div
            key={person.id}
            className={`names-list__item ${
              person.isSelected ? 'selected' : ''
            } ${selectedPersonId === person.id ? 'highlighted' : ''} ${
              justSelectedId === person.id ? 'just-selected' : ''
            }`}
          >
            {editingId === person.id ? (
              <div className="names-list__edit">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="names-list__edit-input"
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave(person.id)}
                  className="names-list__edit-button save"
                >
                  ✓
                </button>
                <button
                  onClick={handleEditCancel}
                  className="names-list__edit-button cancel"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="names-list__content">
                <span className="names-list__name">{person.name}</span>
                <div className="names-list__actions">
                  <button
                    onClick={() => handleEditStart(person.id, person.name)}
                    className="names-list__action-button edit"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDeleteName(person.id)}
                    className="names-list__action-button delete"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {people.length === 0 && (
          <div className="names-list__empty">
            Добавьте участников для начала игры
          </div>
        )}
      </div>
    </div>
  );
}
