import React, { useState } from 'react';

import dragAndDropIcon from './dragAndDrop.png';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './CustomDragAndDrop.scss';

export interface DraggableItem {
  id: string
  name: string
  icon: string
}

interface SortableItemProps {
  item: DraggableItem
  id: string
}

interface CustomDragAndDropProps {
  items: DraggableItem[]
  saveOnChange: (itemValues: string[]) => void;
}

function SortableItem({ item, id }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} className='Card' style={style} {...attributes} {...listeners}>
      <div className='Index'>{id}</div>
      {item.icon ? <img className='Icon' src={item.icon} alt='icon' /> : item.icon}
      <div className='Name'>{item.name}</div>
      <div className='Image'>
        <img src={dragAndDropIcon} width='20px' height='20px' alt='dragAndDrop' />
      </div>
    </div>
  );
}

function CustomDragAndDrop({ items, saveOnChange }: CustomDragAndDropProps): JSX.Element {
  const [draggableItems, setDraggableItems] = useState(
    items.map((item, index) => {
      return { id: index + 1, ...item };
    })
  );

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over.id) {
      let newItems = draggableItems;
      setDraggableItems((items) => {
        const oldIndex = items.findIndex((item) => active.id === item.id);
        const newIndex = items.findIndex((item) => over.id === item.id);

        newItems = arrayMove(items, oldIndex, newIndex);
        return newItems;
      });
      saveOnChange(newItems.map((el: DraggableItem) => el.name));
    }
  }

  return (
    <div className='CustomDragAndDropWrapper'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={draggableItems} strategy={verticalListSortingStrategy}>
          {draggableItems.map((item) => (
            <SortableItem key={item.id} id={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default CustomDragAndDrop;
