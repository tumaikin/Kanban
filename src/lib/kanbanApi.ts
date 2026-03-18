import type { BoardRecord, Task } from '../types/task';
import { supabase } from './supabase';

interface BoardRow {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner_id: string | null;
}

interface TaskRow {
  id: string;
  board_id: string;
  title: string;
  description: string;
  priority: Task['priority'];
  tags: string[] | null;
  due_date: string;
  estimate: string;
  status: Task['status'];
  created_at: string;
  updated_at: string;
  position: number;
  owner_id: string | null;
}

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase не настроен.');
  }

  return supabase;
};

const mapTaskRow = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  priority: row.priority,
  tags: row.tags ?? [],
  dueDate: row.due_date,
  estimate: row.estimate,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapBoardRow = (row: BoardRow, tasks: Task[]): BoardRecord => ({
  id: row.id,
  name: row.name,
  tasks,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const fetchBoardsWithTasks = async (): Promise<BoardRecord[]> => {
  const client = ensureSupabase();

  const [{ data: boards, error: boardsError }, { data: tasks, error: tasksError }] = await Promise.all([
    client.from('boards').select('*').order('updated_at', { ascending: false }),
    client.from('tasks').select('*').order('position', { ascending: true }),
  ]);

  if (boardsError) {
    throw boardsError;
  }

  if (tasksError) {
    throw tasksError;
  }

  const tasksByBoardId = new Map<string, Task[]>();
  for (const taskRow of (tasks ?? []) as TaskRow[]) {
    const boardTasks = tasksByBoardId.get(taskRow.board_id) ?? [];
    boardTasks.push(mapTaskRow(taskRow));
    tasksByBoardId.set(taskRow.board_id, boardTasks);
  }

  return ((boards ?? []) as BoardRow[]).map((boardRow) => mapBoardRow(boardRow, tasksByBoardId.get(boardRow.id) ?? []));
};

export const createBoardRecord = async (name: string): Promise<BoardRecord> => {
  const client = ensureSupabase();
  const timestamp = new Date().toISOString();
  const { data, error } = await client
    .from('boards')
    .insert({ name, created_at: timestamp, updated_at: timestamp })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapBoardRow(data as BoardRow, []);
};

export const deleteBoardRecord = async (boardId: string) => {
  const client = ensureSupabase();
  const { error } = await client.from('boards').delete().eq('id', boardId);
  if (error) {
    throw error;
  }
};

export const replaceBoardTasks = async (boardId: string, tasks: Task[]) => {
  const client = ensureSupabase();

  const { error: deleteError } = await client.from('tasks').delete().eq('board_id', boardId);
  if (deleteError) {
    throw deleteError;
  }

  if (tasks.length === 0) {
    const { error: boardError } = await client
      .from('boards')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', boardId);

    if (boardError) {
      throw boardError;
    }

    return;
  }

  const rows = tasks.map((task, index) => ({
    id: task.id,
    board_id: boardId,
    title: task.title,
    description: task.description,
    priority: task.priority,
    tags: task.tags,
    due_date: task.dueDate,
    estimate: task.estimate,
    status: task.status,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    position: index,
  }));

  const { error: insertError } = await client.from('tasks').insert(rows);
  if (insertError) {
    throw insertError;
  }

  const { error: boardError } = await client
    .from('boards')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', boardId);

  if (boardError) {
    throw boardError;
  }
};
