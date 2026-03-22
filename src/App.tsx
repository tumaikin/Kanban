import { useEffect, useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Board } from './components/Board';
import { BoardSelector } from './components/BoardSelector';
import { BoardSettingsModal } from './components/BoardSettingsModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { SupabaseSetup } from './components/SupabaseSetup';
import { TaskModal } from './components/TaskModal';
import { BOARD_COLUMNS } from './data/columns';
import { useAuth } from './hooks/useAuth';
import { useKanbanBoard } from './hooks/useKanbanBoard';
import { getUniqueTags } from './utils/task';

const App = () => {
  const auth = useAuth();
  const {
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
    initialFormValues,
  } = useKanbanBoard(auth.user?.id ?? null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBoardSettingsOpen, setIsBoardSettingsOpen] = useState(false);
  const canReorderTasks =
    filters.sortBy === 'manual' &&
    !filters.search.trim() &&
    filters.priority === 'all' &&
    filters.status === 'all' &&
    filters.tag === 'all';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (!isSupabaseConfigured || !auth.isAuthConfigured) {
    return <SupabaseSetup />;
  }

  if (auth.isLoading && !auth.user) {
    return null;
  }

  if (!auth.user) {
    return (
      <AuthScreen
        isLoading={auth.isLoading}
        error={auth.error}
        info={auth.info}
        onSignIn={auth.signIn}
        onSignUp={auth.signUp}
      />
    );
  }

  if (!currentBoard) {
    return (
      <>
        <BoardSelector
          boards={boards}
          userEmail={auth.user.email ?? 'Без email'}
          isLoading={isLoading}
          isSaving={isSaving || auth.isLoading}
          error={error}
          onOpenBoard={openBoard}
          onCreateBoard={createBoard}
          onDeleteBoard={requestDeleteBoard}
          onSignOut={auth.signOut}
        />
        <ConfirmDialog
          open={isConfirmOpen}
          title="Удалить доску?"
          description={boardToDelete ? `Доска «${boardToDelete.name}» будет удалена без возможности восстановления.` : ''}
          confirmLabel="Удалить"
          onCancel={closeConfirm}
          onConfirm={deleteBoard}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen px-3 py-3 md:px-4 md:py-4 xl:px-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3">
        {error && (
          <button
            type="button"
            onClick={() => setError(null)}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200"
          >
            {error}
          </button>
        )}

        <Header
          boardName={currentBoard.name}
          totalTasks={tasks.length}
          userEmail={auth.user.email ?? 'Без email'}
          onBack={closeBoard}
          onSignOut={auth.signOut}
          onOpenFilters={() => setIsFilterOpen(true)}
          onCreateTask={() => openCreateModal()}
          onOpenBoardSettings={() => setIsBoardSettingsOpen(true)}
        />

        {!canReorderTasks && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
            Для ручной перестановки задач отключи фильтры и выбери сортировку «Ручной порядок».
          </div>
        )}

        <Board
          columns={BOARD_COLUMNS}
          allTasksByStatus={allTasksByStatus}
          tasksByStatus={tasksByStatus}
          canReorderTasks={canReorderTasks}
          onCreateTask={openCreateModal}
          onEditTask={openEditModal}
          onDeleteTask={deleteTask}
          onMoveTask={moveTask}
        />
      </div>

      <FilterBar
        open={isFilterOpen}
        filters={filters}
        tags={getUniqueTags(tasks)}
        onChange={setFilters}
        onReset={resetFilters}
        onClose={() => setIsFilterOpen(false)}
      />

      <TaskModal
        open={isModalOpen}
        initialValues={initialFormValues}
        availableTags={getUniqueTags(tasks)}
        mode={taskBeingEdited?.id ? 'edit' : 'create'}
        onClose={closeModal}
        onSubmit={saveTask}
      />

      <BoardSettingsModal
        open={isBoardSettingsOpen}
        boardName={currentBoard.name}
        theme={theme}
        onClose={() => setIsBoardSettingsOpen(false)}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onClearAll={() => {
          setIsBoardSettingsOpen(false);
          requestClearAllTasks();
        }}
      />

      <ConfirmDialog
        open={isConfirmOpen && !boardToDelete}
        title="Очистить задачи?"
        description="Все задачи на этой доске будут удалены."
        confirmLabel="Очистить"
        onCancel={closeConfirm}
        onConfirm={clearAllTasks}
      />
    </div>
  );
};

export default App;
