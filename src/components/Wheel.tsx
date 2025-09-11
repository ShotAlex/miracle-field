'use client';

import { useState } from 'react';

interface Person {
  id: string;
  name: string;
  isSelected: boolean;
}

interface WheelProps {
  people: Person[];
  onPersonSelected: (personId: string) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  onSpinStart?: () => void;
  selectedPersonId?: string | null;
}

export default function Wheel({ people, onPersonSelected, isSpinning, setIsSpinning, onSpinStart, selectedPersonId }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [highlightedSector, setHighlightedSector] = useState(-1);
  const [isFineTuning, setIsFineTuning] = useState(false);

  // Используем всех людей для секторов, но только доступных для выбора
  const totalSectors = people.length;
  const availablePeople = people.filter(person => !person.isSelected);
  const sectorAngle = totalSectors > 0 ? 360 / totalSectors : 0;

  const spin = () => {
    if (people.length < 2 || availablePeople.length === 0 || isSpinning) return;
    
    // Сообщаем родительскому компоненту о начале вращения (для сброса подсветки)
    onSpinStart?.();
    
    setIsSpinning(true);
    
    // Случайный поворот от 3 до 6 полных оборотов плюс случайный угол остановки
    const minSpins = 3;
    const maxSpins = 6;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    
    // Случайный финальный угол (0-360 градусов)
    const randomFinalAngle = Math.random() * 360;
    
    // Общий поворот
    const totalRotation = spins * 360 + randomFinalAngle;
    
    // Применяем поворот с плавной анимацией
    let finalRotationValue = 0;
    setRotation(prev => {
      finalRotationValue = prev + totalRotation;
      return finalRotationValue;
    });
    
    // Анимация подсветки секторов во время вращения
    let interval: NodeJS.Timeout;
    if (people.length > 0) {
      interval = setInterval(() => {
        setHighlightedSector(prev => (prev + 1) % totalSectors);
      }, 100);
    }
    
    // Остановка через 4 секунды
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      
      // Определяем, какой сектор находится под стрелкой wheel-pointer
      // Стрелка указывает строго вверх (12 часов, позиция -90° в SVG координатах)
      
      // Получаем финальный угол поворота барабана
      let finalAngle = finalRotationValue % 360;
      if (finalAngle < 0) finalAngle += 360;
      
      // Логика:
      // - Сектора рисуются начиная с -90° (сектор 0 изначально под стрелкой)
      // - После поворота на finalAngle, каждый сектор сместился на эту величину
      // - Нужно найти, какой сектор теперь находится в позиции -90° (под стрелкой)
      
      // Какой сектор сейчас в позиции -90°?
      // Это сектор, который изначально был в позиции (-90° - finalAngle)
      // Приводим к положительному углу и находим соответствующий сектор
      let targetAngle = (-90 - finalAngle + 360) % 360;
      
      // Переводим угол в индекс сектора (сектора начинаются с -90°, т.е. нужно добавить 90°)
      let normalizedAngle = (targetAngle + 90) % 360;
      const sectorIndex = Math.floor(normalizedAngle / sectorAngle) % totalSectors;
      
      // Отладочная информация (можно убрать потом)
      console.log('Расчет сектора под стрелкой wheel-pointer (СВЕРХУ):', {
        finalRotationValue,
        finalAngle,
        targetAngle,
        normalizedAngle,
        sectorAngle,
        sectorIndex,
        totalSectors,
        selectedPersonName: people[sectorIndex]?.name
      });
      
      // Находим соответствующего участника под стрелкой
      const selectedPerson = people[sectorIndex];
      
      // Подсвечиваем сектор под стрелкой
      setHighlightedSector(sectorIndex);
      
      console.log('🔍 ПОЛНАЯ ПРОВЕРКА участника под стрелкой:', {
        selectedPerson: selectedPerson?.name,
        isSelected: selectedPerson?.isSelected,
        sectorIndex,
        shouldLookForAnother: !selectedPerson || selectedPerson.isSelected,
        allPeople: people.map((p, i) => ({ index: i, name: p.name, isSelected: p.isSelected }))
      });
      
      // Если участник под стрелкой уже выбран, ищем первого доступного
      let finalSelectedPerson: Person | undefined = selectedPerson;
      let needsSpinToAvailable = false;
      
      if (!selectedPerson || selectedPerson.isSelected) {
        console.log('🚨 УЧАСТНИК ПОД СТРЕЛКОЙ УЖЕ ВЫБРАН! Ищем доступного...');
        console.log('Причина:', {
          noSelectedPerson: !selectedPerson,
          isAlreadySelected: selectedPerson?.isSelected,
          personDetails: selectedPerson
        });
        needsSpinToAvailable = true;
        
        // Найдем первого доступного участника, двигаясь против часовой стрелки
        let targetIndex = -1;
        
        // Проходим по кругу назад (против часовой) от текущей позиции
        console.log(`🔍 НАЧИНАЕМ ПОИСК с индекса ${sectorIndex}, всего участников: ${people.length}`);
        for (let i = 1; i < people.length; i++) {
          const checkIndex = (sectorIndex - i + people.length) % people.length;
          const checkPerson = people[checkIndex];
          console.log(`Шаг ${i}: Проверяем индекс ${checkIndex}: ${checkPerson?.name}, выбран: ${checkPerson?.isSelected}`);
          
          if (checkPerson && !checkPerson.isSelected) {
            targetIndex = checkIndex;
            finalSelectedPerson = checkPerson;
            console.log(`✅ НАЙДЕН ПЕРВЫЙ ДОСТУПНЫЙ: ${finalSelectedPerson.name} (индекс ${targetIndex})`);
            console.log(`Пройдено шагов назад: ${i}, это ${i} сектор(ов) против часовой стрелки`);
            break;
          }
        }
        
        if (targetIndex === -1) {
          console.log('❌ НЕ НАЙДЕНО ДОСТУПНЫХ УЧАСТНИКОВ');
        }
      }
      
      // Принимаем решение что делать дальше
      console.log('🎯 ПРИНИМАЕМ РЕШЕНИЕ:', {
        needsSpinToAvailable,
        hasFinalSelectedPerson: !!finalSelectedPerson,
        finalPersonName: finalSelectedPerson?.name,
        finalPersonIsSelected: finalSelectedPerson?.isSelected,
        willSpin: needsSpinToAvailable && finalSelectedPerson && !finalSelectedPerson.isSelected
      });
      
      if (needsSpinToAvailable && finalSelectedPerson && !finalSelectedPerson.isSelected) {
        console.log('🔄 НАЧИНАЕМ ДОКРУТКУ к доступному участнику:', finalSelectedPerson.name);
        
        // Докручиваем до доступного участника
        setTimeout(() => {
          const targetIndex = people.findIndex(p => p.id === finalSelectedPerson.id);
          
          console.log('Данные для докрутки:', {
            currentIndex: sectorIndex,
            targetIndex,
            currentSectorAngle: sectorIndex * sectorAngle,
            targetSectorAngle: targetIndex * sectorAngle
          });
          
          // Правильная логика: вычисляем точное количество секторов до найденного доступного
          // targetIndex уже найден в цикле поиска, это ДЕЙСТВИТЕЛЬНО первый доступный
          
          // Считаем сколько шагов назад (против часовой) от текущего сектора до целевого
          let stepsBack;
          if (targetIndex < sectorIndex) {
            stepsBack = sectorIndex - targetIndex;
          } else {
            // Если целевой "впереди" по индексу, значит мы идем через конец массива
            stepsBack = sectorIndex + (people.length - targetIndex);
          }
          
          // Переводим в градусы (положительное число = движение по часовой стрелке)
          const rotationNeeded = stepsBack * sectorAngle;
          
          console.log('🔧 ДОКРУТКА:', {
            currentIndex: sectorIndex,
            targetIndex,
            stepsBack,
            rotationNeeded,
            targetPersonName: finalSelectedPerson?.name
          });
          
          // Включаем режим fine-tuning
          setIsFineTuning(true);
          
          // Плавно докручиваем барабан
          setRotation(prev => {
            console.log('🎲 Поворачиваем барабан на', rotationNeeded, 'градусов');
            return prev + rotationNeeded;
          });
          
          // Обновляем подсветку на целевой сектор
          setHighlightedSector(targetIndex);
          
          // Ждем окончания докрутки и выбираем участника
          setTimeout(() => {
            console.log('✅ ДОКРУТКА ЗАВЕРШЕНА, выбираем:', finalSelectedPerson.name);
            setIsFineTuning(false);
            setHighlightedSector(-1);
            onPersonSelected(finalSelectedPerson.id);
          }, 1500);
        }, 1000);
        
      } else if (finalSelectedPerson && !finalSelectedPerson.isSelected) {
        // Участник под стрелкой доступен, выбираем его
        console.log('✅ Участник под стрелкой доступен, выбираем сразу:', finalSelectedPerson.name);
        setTimeout(() => {
          setHighlightedSector(-1);
          onPersonSelected(finalSelectedPerson.id);
        }, 1000);
        
      } else {
        // Нет доступных участников
        console.log('❌ НЕТ ДОСТУПНЫХ УЧАСТНИКОВ');
        setTimeout(() => {
          setHighlightedSector(-1);
        }, 1000);
      }
    }, 4000);
  };

  const getSectorColor = (index: number) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="wheel-container">
      <div className="wheel-wrapper">
        <div className="wheel-pointer">▼</div>
        <svg
          className={`wheel ${isSpinning ? 'spinning' : ''} ${isFineTuning ? 'fine-tuning' : ''}`}
          width="400"
          height="400"
          viewBox="0 0 300 300"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {totalSectors === 0 ? (
            // Пустой барабан
            <g>
              <circle
                cx="150"
                cy="150"
                r="140"
                fill="#f3f4f6"
                stroke="#d1d5db"
                strokeWidth="2"
              />
              <text
                x="150"
                y="150"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#6b7280"
                fontSize="16"
                fontWeight="bold"
              >
                Добавьте участников
              </text>
            </g>
          ) : (
            Array.from({ length: totalSectors }, (_, index) => {
            // Начинаем с -90 градусов, чтобы первый сектор был сверху (под стрелочкой)
            const startAngle = ((index * sectorAngle) - 90) * (Math.PI / 180);
            const endAngle = (((index + 1) * sectorAngle) - 90) * (Math.PI / 180);
            
            const x1 = 150 + 140 * Math.cos(startAngle);
            const y1 = 150 + 140 * Math.sin(startAngle);
            const x2 = 150 + 140 * Math.cos(endAngle);
            const y2 = 150 + 140 * Math.sin(endAngle);
            
            const largeArcFlag = sectorAngle > 180 ? 1 : 0;
            
            const pathData = [
              `M 150 150`,
              `L ${x1} ${y1}`,
              `A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');

            const person = people[index];
            const isHighlighted = highlightedSector === index && isSpinning;
            
            // Определяем цвет сектора
            let fillColor;
            if (isHighlighted) {
              fillColor = '#FFD700'; // Золотой при подсветке
            } else if (person?.isSelected) {
              fillColor = '#9ca3af'; // Серый для выбранных
            } else {
              fillColor = getSectorColor(index);
            }
            
            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={fillColor}
                  stroke="#fff"
                  strokeWidth="2"
                  className={isHighlighted ? 'highlighted-sector' : ''}
                  opacity={person?.isSelected ? 0.5 : 1}
                />
                {person && (
                  <text
                    x={150 + 80 * Math.cos((startAngle + endAngle) / 2)}
                    y={150 + 80 * Math.sin((startAngle + endAngle) / 2)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={person.isSelected ? "#666" : "#333"}
                    fontSize="12"
                    fontWeight="bold"
                    transform={`rotate(${(startAngle + endAngle) / 2 * 180 / Math.PI + 90}, ${150 + 80 * Math.cos((startAngle + endAngle) / 2)}, ${150 + 80 * Math.sin((startAngle + endAngle) / 2)})`}
                  >
                    {person.name.length > 8 ? person.name.substring(0, 6) + '...' : person.name}
                  </text>
                )}
              </g>
            );
          })
          )}
          
          {/* Центральный круг */}
          <circle
            cx="150"
            cy="150"
            r="30"
            fill="#333"
            stroke="#fff"
            strokeWidth="3"
          />
        </svg>
      </div>
      
      <button
        onClick={spin}
        disabled={people.length < 2 || availablePeople.length === 0 || isSpinning || isFineTuning}
        className={`spin-button ${isSpinning || isFineTuning ? 'spinning' : ''}`}
      >
        {isSpinning 
          ? 'Крутится...' 
          : isFineTuning
            ? 'Докручиваю...'
            : people.length < 2 
              ? 'Добавьте минимум 2 участника' 
              : availablePeople.length === 0 
                ? 'Все участники выбраны!' 
                : 'КРУТИТЬ!'
        }
      </button>
      
      {availablePeople.length > 0 && (
        <div className="available-count">
          Доступно участников: {availablePeople.length}
        </div>
      )}
      
      {selectedPersonId && (
        <div className="selected-person">
          Выбран: <strong>{people.find(p => p.id === selectedPersonId)?.name}</strong>
        </div>
      )}
    </div>
  );
}
