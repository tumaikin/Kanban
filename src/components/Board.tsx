import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { ColumnDefinition } from '../types/board';
import type { Task, TaskStatus } from '../types/task';
import { Column } from './Column';
import { TaskCard } from './TaskCard';

interface BoardProps {
  columns: ColumnDefinition[];
  allTasksByStatus: Record<TaskStatus, Task[]>;
  tasksByStatus: Record<TaskStatus, Task[]>;
  canReorderTasks: boolean;
  onCreateTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, destinationStatus: TaskStatus, destinationIndex: number) => void;
}

const findTaskLocation = (tasksByStatus: Record<TaskStatus, Task[]>, taskId: string) => {
  const entry = (Object.entries(tasksByStatus) as Array<[TaskStatus, Task[]]>).find(([, tasks]) =>
    tasks.some((task) => task.id === taskId),
  );

  if (!entry) {
    return null;
  }

  const [status, tasks] = entry;
  return {
    status,
    index: tasks.findIndex((task) => task.id === taskId),
  };
};

export const Board = ({
  columns,
  allTasksByStatus,
  tasksByStatus,
  canReorderTasks,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: BoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
      return;
    }

    const source = findTaskLocation(tasksByStatus, String(active.id));
    if (!source) {
      return;
    }

    const overTask = over.data.current?.task as Task | undefined;
    const overColumn = over.data.current?.status as TaskStatus | undefined;

    if (overTask) {
      const destination = findTaskLocation(tasksByStatus, overTask.id);
      if (!destination) {
        return;
      }

      if (!canReorderTasks) {
        if (source.status !== destination.status) {
          onMoveTask(String(active.id), destination.status, allTasksByStatus[destination.status].length);
        }
        return;
      }

      const destinationIndex = source.status === destination.status && source.index < destination.index
        ? destination.index - 1
        : destination.index;

      onMoveTask(String(active.id), destination.status, destinationIndex);
      return;
    }

    if (overColumn) {
      const destinationIndex = canReorderTasks ? tasksByStatus[overColumn].length : allTasksByStatus[overColumn].length;
      onMoveTask(String(active.id), overColumn, destinationIndex);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id]}
            onCreateTask={onCreateTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onEdit={() => undefined} onDelete={() => undefined} dragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
