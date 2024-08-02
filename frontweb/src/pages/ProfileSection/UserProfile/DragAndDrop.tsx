// src/pages/ProfileSection/UserProfile/DragAndDrop.tsx

import React, { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  columnSpan: number;
}

/* eslint-disable react/prop-types */
const SortableItem: React.FC<SortableItemProps> = React.memo(({ id, children, columnSpan }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${columnSpan}`,
    opacity: isDragging ? 0.7 : undefined,
    zIndex: isDragging ? 1000 : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={`Drag and drop item for ${id}`}
    >
      {children}
    </div>
  );
});

// Ajoutez une ligne pour le nom d'affichage
SortableItem.displayName = 'SortableItem';

interface DragAndDropProps {
  items: string[];
  cardSpans: Record<string, number>;
  columnCount: number;
  renderComponent: (id: string) => JSX.Element | null;
  setCardOrder: React.Dispatch<React.SetStateAction<string[]>>;
  handleCardSpanChange: (cardId: string, span: number) => void;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  items,
  cardSpans,
  columnCount,
  renderComponent,
  setCardOrder,
  handleCardSpanChange
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setCardOrder((items) => {
          const oldIndex = items.indexOf(active.id as string);
          const newIndex = items.indexOf(over.id as string);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    [setCardOrder]
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div
          className="userProfile-grid"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {items.map((cardId) => {
            const component = renderComponent(cardId);
            if (!component) return null;

            return (
              <SortableItem key={cardId} id={cardId} columnSpan={cardSpans[cardId]}>
                <div className={`userProfile-card`}>
                  <div className="drag-handle" aria-label="Drag handle">
                    ☰
                  </div>
                  <div className="userProfile-card-body">{component}</div>
                  <div className="card-span-control">
                    <label htmlFor={`${cardId}-span`}>Span:</label>
                    <select
                      id={`${cardId}-span`}
                      value={cardSpans[cardId] || 1}
                      onChange={(e) => handleCardSpanChange(cardId, Number(e.target.value))}
                    >
                      {Array.from({ length: columnCount }, (_, i) => i + 1).map((num) => (
                        <option
                          key={num}
                          value={num}
                        >{`${num} Column${num > 1 ? 's' : ''}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DragAndDrop;
