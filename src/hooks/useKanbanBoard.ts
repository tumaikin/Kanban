import { useEffect, useMemo, useRef, useState } from 'react';
import type { BoardRecord, FilterState, Task, TaskFormValues, TaskStatus } from '../types/task';
import { createBoardRecord, deleteBoardRecord, fetchBoardsWithTasks, replaceBoardTasks } from '../lib/kanbanApi';
import { isSupabaseConfigured } from '../lib/supabase';
import { DEFAULT_FILTERS, filterAndSortTasks, getErrorMessage, parseTags, toTaskFormValues } from '../utils/task';
import { useLocalStorage } from './useLocalStorage';

const CURRENT_BOARD_STORAGE_KEY = 'kanban-board.current-board-id';
const FILTERS_STORAGE_KEY = 'kanban-board.filters';
const THEME_STORAGE_KEY = 'kanban-theme';

type ThemeMode = 'light' | 'dark';

const updateBoardTimestamp = (board: BoardRecord): BoardRecord => ({
  ...board,
  updatedAt: new Date().toISOString(),
});

export const useKanbanBoard = (userId: string | null) => {
  const [boards, setBoards] = useState<BoardRecord[]>([]);
  const [currentBoardId, setCurrentBoardId] = useLocalStorage<string | null>(CURRENT_BOARD_STORAGE_KEY, null);
  const [filters, setFilters] = useLocalStorage<FilterState>(FILTERS_STORAGE_KEY, DEFAULT_FILTERS);
  const [theme, setTheme] = useLocalStorage<ThemeMode>(THEME_STORAGE_KEY, 'dark');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<BoardRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedBoardSelection = useRef(false);

  const currentBoard = useMemo(
    () => boards.find((board) => board.id === currentBoardId) ?? null,
    [boards, currentBoardId],
  );

  const tasks = currentBoard?.tasks ?? [];
  const allTasksByStatus = useMemo(
    () =>
      tasks.reduce<Record<TaskStatus, Task[]>>(
        (accumulator, task) => {
          accumulator[task.status].push(task);
          return accumulator;
        },
        { backlog: [], 'in-progress': [], review: [], done: [] },
      ),
    [tasks],
  );
  const visibleTasks = useMemo(() => filterAndSortTasks(tasks, filters), [tasks, filters]);

  const tasksByStatus = useMemo(
    () =>
      visibleTasks.reduce<Record<TaskStatus, Task[]>>(
        (accumulator, task) => {
          accumulator[task.status].push(task);
          return accumulator;
        },
        { backlog: [], 'in-progress': [], review: [], done: [] },
      ),
    [visibleTasks],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    if (!userId) {
      setBoards([]);
      setIsLoading(false);
      setTaskBeingEdited(null);
      setIsModalOpen(false);
      setBoardToDelete(null);
      setIsConfirmOpen(false);
      return;
    }

    const loadBoards = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchBoardsWithTasks();
        setBoards(data);

        if (!hasInitializedBoardSelection.current) {
          hasInitializedBoardSelection.current = true;

          if (currentBoardId && data.some((board) => board.id === currentBoardId)) {
            return;
          }

          if (currentBoardId && data.every((board) => board.id !== currentBoardId)) {
            setCurrentBoardId(null);
            return;
          }

          return;
        }

        if (currentBoardId && data.every((board) => board.id !== currentBoardId)) {
          setCurrentBoardId(null);
        }
      } catch (loadError) {
        setError(getErrorMessage(loadError, 'Не удалось загрузить данные из Supabase.'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadBoards();
  }, [currentBoardId, setCurrentBoardId, userId]);

  const replaceCurrentBoardTasksLocal = (updater: (tasks: Task[]) => Task[]) => {
    if (!currentBoard) {
      return [] as Task[];
    }

    let nextTasks: Task[] = [];
    setBoards((current) =>
      current.map((board) => {
        if (board.id !== currentBoard.id) {
          return board;
        }

        nextTasks = updater(board.tasks);
        return updateBoardTimestamp({
          ...board,
          tasks: nextTasks,
        });
      }),
    );

    return nextTasks;
  };

  const refreshBoards = async () => {
    if (!isSupabaseConfigured || !userId) {
      return;
    }

    const data = await fetchBoardsWithTasks();
    setBoards(data);
  };

  const persistCurrentBoardTasks = async (updater: (tasks: Task[]) => Task[]) => {
    if (!currentBoard) {
      return;
    }

    const nextTasks = updater(currentBoard.tasks);
    await replaceBoardTasks(currentBoard.id, nextTasks);
    replaceCurrentBoardTasksLocal(() => nextTasks);
  };

  const openCreateModal = (status?: TaskStatus) => {
    setTaskBeingEdited(
      status
        ? {
            id: '',
            title: '',
            description: '',
            priority: 'medium',
            tags: [],
            dueDate: '',
            estimate: '',
            status,
            createdAt: '',
            updatedAt: '',
          }
        : null,
    );
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setTaskBeingEdited(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTaskBeingEdited(null);
    setIsModalOpen(false);
  };

  const saveTask = async (values: TaskFormValues) => {
    if (!currentBoard || !userId) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (taskBeingEdited?.id) {
        const updatedTask: Task = {
          ...taskBeingEdited,
          title: values.title.trim(),
          description: values.description.trim(),
          priority: values.priority,
          tags: parseTags(values.tags),
          dueDate: values.dueDate,
          estimate: values.estimate.trim(),
          status: values.status,
          updatedAt: new Date().toISOString(),
        };

        await persistCurrentBoardTasks((currentTasks) =>
          currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        );
      } else {
        const timestamp = new Date().toISOString();
        const nextTask: Task = {
          id: crypto.randomUUID(),
          title: values.title.trim(),
          description: values.description.trim(),
          priority: values.priority,
          tags: parseTags(values.tags),
          dueDate: values.dueDate,
          estimate: values.estimate.trim(),
          status: values.status,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        await persistCurrentBoardTasks((currentTasks) => [nextTask, ...currentTasks]);
      }

      closeModal();
    } catch (saveError) {
      setError(getErrorMessage(saveError, 'Не удалось сохранить задачу.'));
      await refreshBoards();
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setIsSaving(true);
    setError(null);

    try {
      await persistCurrentBoardTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, 'Не удалось удалить задачу.'));
      await refreshBoards();
    } finally {
      setIsSaving(false);
    }
  };

  const moveTask = async (taskId: string, destinationStatus: TaskStatus, destinationIndex: number) => {
    if (!currentBoard) {
      return;
    }

    setIsSaving(true);
    setError(null);

    const sourceTask = currentBoard.tasks.find((task) => task.id === taskId);
    if (!sourceTask) {
      setIsSaving(false);
      return;
    }

    const withoutSource = currentBoard.tasks.filter((task) => task.id !== taskId);
    const destinationTasks = withoutSource.filter((task) => task.status === destinationStatus);
    const clampedIndex = Math.min(Math.max(destinationIndex, 0), destinationTasks.length);

    const nextDestinationTasks = [...destinationTasks];
    nextDestinationTasks.splice(clampedIndex, 0, {
      ...sourceTask,
      status: destinationStatus,
      updatedAt: new Date().toISOString(),
    });

    const nextTasks: Task[] = [];
    let destinationPointer = 0;

    for (const task of withoutSource) {
      if (task.status !== destinationStatus) {
        nextTasks.push(task);
        continue;
      }

      nextTasks.push(nextDestinationTasks[destinationPointer]);
      destinationPointer += 1;
    }

    while (destinationPointer < nextDestinationTasks.length) {
      nextTasks.push(nextDestinationTasks[destinationPointer]);
      destinationPointer += 1;
    }

    try {
      replaceCurrentBoardTasksLocal(() => nextTasks);
      await replaceBoardTasks(currentBoard.id, nextTasks);
    } catch (moveError) {
      setError(getErrorMessage(moveError, 'Не удалось переместить задачу.'));
      await refreshBoards();
    } finally {
      setIsSaving(false);
    }
  };

  const requestClearAllTasks = () => {
    setBoardToDelete(null);
    setIsConfirmOpen(true);
  };

  const clearAllTasks = async () => {
    if (!currentBoard) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await replaceBoardTasks(currentBoard.id, []);
      replaceCurrentBoardTasksLocal(() => []);
      setIsConfirmOpen(false);
    } catch (clearError) {
      setError(getErrorMessage(clearError, 'Не удалось очистить задачи.'));
    } finally {
      setIsSaving(false);
    }
  };

  const createBoard = async (name: string) => {
    const title = name.trim();
    if (!title || !userId) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const nextBoard = await createBoardRecord(title);
      setBoards((current) => [nextBoard, ...current]);
      setCurrentBoardId(nextBoard.id);
    } catch (createError) {
      setError(getErrorMessage(createError, 'Не удалось создать доску.'));
    } finally {
      setIsSaving(false);
    }
  };

  const openBoard = (boardId: string) => {
    setCurrentBoardId(boardId);
  };

  const closeBoard = () => {
    setCurrentBoardId(null);
    setTaskBeingEdited(null);
    setIsModalOpen(false);
    resetFilters();
  };

  const requestDeleteBoard = (board: BoardRecord) => {
    setBoardToDelete(board);
    setIsConfirmOpen(true);
  };

  const deleteBoard = async () => {
    if (!boardToDelete) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await deleteBoardRecord(boardToDelete.id);
      setBoards((current) => current.filter((board) => board.id !== boardToDelete.id));
      if (currentBoardId === boardToDelete.id) {
        setCurrentBoardId(null);
      }
      setBoardToDelete(null);
      setIsConfirmOpen(false);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, 'Не удалось удалить доску.'));
    } finally {
      setIsSaving(false);
    }
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setBoardToDelete(null);
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    boards,
    currentBoard,
    tasks,
    allTasksByStatus,
    tasksByStatus,
    filters,
    setFilters,
    resetFilters,
    theme,
    setTheme,
    isModalOpen,
    isConfirmOpen,
    taskBeingEdited,
    boardToDelete,
    isLoading,
    isSaving,
    isSupabaseConfigured,
    error,
    setError,
    openCreateModal,
    openEditModal,
    closeModal,
    saveTask,
    deleteTask,
    moveTask,
    requestClearAllTasks,
    clearAllTasks,
    createBoard,
    openBoard,
    closeBoard,
    requestDeleteBoard,
    deleteBoard,
    closeConfirm,
    initialFormValues: toTaskFormValues(taskBeingEdited ?? undefined),
  };
};
