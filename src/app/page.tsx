'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Wheel from '../components/Wheel';
import NamesList from '../components/NamesList';
import NameInput from '../components/NameInput';
import Confetti from '../components/Confetti';

interface Person {
  id: string;
  name: string;
  isSelected: boolean;
}

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [justSelectedId, setJustSelectedId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const savedPeople = localStorage.getItem('miracle-field-people');
    if (savedPeople) {
      try {
        const parsedPeople = JSON.parse(savedPeople);
        setPeople(parsedPeople);
      } catch (error) {
        console.error('Ошибка при загрузке данных из localStorage:', error);
      }
    }
  }, []);

  // Сохранение данных в localStorage при изменении списка людей
  useEffect(() => {
    if (people.length > 0) {
      localStorage.setItem('miracle-field-people', JSON.stringify(people));
    }
  }, [people]);

  const addName = (name: string) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name,
      isSelected: false,
    };
    setPeople(prev => [...prev, newPerson]);
  };

  const deleteName = (id: string) => {
    setPeople(prev => prev.filter(person => person.id !== id));
    if (selectedPersonId === id) {
      setSelectedPersonId(null);
    }
  };

  const editName = (id: string, newName: string) => {
    setPeople(prev =>
      prev.map(person =>
        person.id === id ? { ...person, name: newName } : person
      )
    );
  };

  const handlePersonSelected = (personId: string) => {
    // Сначала показываем зеленую подсветку (только что выбранного)
    setJustSelectedId(personId);
    setSelectedPersonId(personId);
    
    // Запускаем конфетти! 🎊
    setShowConfetti(true);
    
    // Через 2 секунды убираем зеленую подсветку, делаем участника неактивным, но оставляем синюю подсветку
    setTimeout(() => {
      setPeople(prev =>
        prev.map(person =>
          person.id === personId ? { ...person, isSelected: true } : person
        )
      );
      setJustSelectedId(null);
      // НЕ убираем selectedPersonId - оставляем синюю подсветку до следующего запуска
    }, 2000);
  };

  const handleSpinStart = () => {
    // Сбрасываем подсветку при начале нового вращения
    setSelectedPersonId(null);
    setJustSelectedId(null);
  };

  const resetAllSelections = () => {
    setPeople(prev =>
      prev.map(person => ({ ...person, isSelected: false }))
    );
    setSelectedPersonId(null);
    setJustSelectedId(null);
  };

  const clearAllNames = () => {
    if (window.confirm('Вы уверены, что хотите удалить всех участников?')) {
      setPeople([]);
      setSelectedPersonId(null);
      setJustSelectedId(null);
      localStorage.removeItem('miracle-field-people');
    }
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main">
        <div className="container">
          <div className="game-area">
            <div className="wheel-section">
              <Wheel
                people={people}
                onPersonSelected={handlePersonSelected}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                onSpinStart={handleSpinStart}
                selectedPersonId={selectedPersonId}
              />
            </div>
            
            <div className="names-section">
              <div className="names-controls">
                <NameInput onAddName={addName} />
                
                <div className="control-buttons">
                  <button
                    onClick={resetAllSelections}
                    className="control-button reset"
                    disabled={people.every(p => !p.isSelected)}
                  >
                    🔄 Сбросить выборы
                  </button>
                  <button
                    onClick={clearAllNames}
                    className="control-button clear"
                    disabled={people.length === 0}
                  >
                    🗑️ Очистить все
                  </button>
                </div>
              </div>
              
              <NamesList
                people={people}
                onDeleteName={deleteName}
                onEditName={editName}
                selectedPersonId={selectedPersonId}
                justSelectedId={justSelectedId}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <Confetti 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
}
