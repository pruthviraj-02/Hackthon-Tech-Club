import React, { useState } from 'react';
import { Plus, Trash2, Check, Filter, ListTodo, AlertCircle, Sparkles } from 'lucide-react';
import { Task, Priority } from '../types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string, priority: Priority) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setInputError('Enter a task before forging.');
      return;
    }
    if (newTitle.trim().length < 2) {
      setInputError('Task must be at least 2 characters.');
      return;
    }

    onAddTask(newTitle.trim(), priority);
    setNewTitle('');
    setInputError(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    // Priority filter
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) {
      return false;
    }
    // Status filter
    if (statusFilter === 'pending' && t.completed) return false;
    if (statusFilter === 'completed' && !t.completed) return false;
    return true;
  });

  const counts = {
    all: tasks.length,
    high: tasks.filter((t) => t.priority === 'High').length,
    med: tasks.filter((t) => t.priority === 'Med').length,
    low: tasks.filter((t) => t.priority === 'Low').length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  const getPriorityStyle = (p: Priority) => {
    switch (p) {
      case 'High':
        return 'bg-[#FF6B6B] text-[#111111]';
      case 'Med':
        return 'bg-[#FFE066] text-[#111111]';
      case 'Low':
        return 'bg-[#4ECDC4] text-[#111111]';
    }
  };

  return (
    <div className="bg-white border-[3px] border-[#111111] shadow-brutal p-5 sm:p-6 flex flex-col h-full">
      {/* Task List Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b-[3px] border-[#111111]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FFE066] border-2 border-[#111111] shadow-brutal-sm flex items-center justify-center font-bold">
            <ListTodo className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-heading font-black text-lg text-[#111111]">
              ACTION FORGE
            </h2>
            <span className="text-[11px] font-bold text-[#111111]/70">
              {counts.pending} pending · {counts.completed} completed
            </span>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-[#FFFDF5] border-2 border-[#111111] shadow-brutal-sm text-xs font-bold">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2 py-0.5 uppercase cursor-pointer ${
              statusFilter === 'all' ? 'bg-[#111111] text-white' : 'text-[#111111]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-2 py-0.5 uppercase cursor-pointer ${
              statusFilter === 'pending' ? 'bg-[#111111] text-white' : 'text-[#111111]'
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-2 py-0.5 uppercase cursor-pointer ${
              statusFilter === 'completed' ? 'bg-[#111111] text-white' : 'text-[#111111]'
            }`}
          >
            Done
          </button>
        </div>
      </div>

      {/* Task Entry Form */}
      <form onSubmit={handleAdd} className="mb-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="What mission will you forge right now?"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FFFDF5] border-[3px] border-[#111111] text-[#111111] font-medium placeholder:text-[#111111]/40 focus:outline-none focus:bg-white shadow-brutal-sm"
            />
          </div>

          {/* Priority selector */}
          <div className="flex items-center gap-1">
            {(['High', 'Med', 'Low'] as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-3 py-2.5 text-xs font-black uppercase border-[3px] border-[#111111] shadow-brutal-sm transition-all cursor-pointer ${
                  priority === p
                    ? `${getPriorityStyle(p)} ring-2 ring-[#111111]`
                    : 'bg-white text-[#111111]/70 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}

            {/* Add Button */}
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#4ECDC4] hover:bg-[#4ECDC4] text-[#111111] font-black uppercase text-xs btn-brutal flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {inputError && (
          <p className="text-xs font-black text-[#FF6B6B] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{inputError}</span>
          </p>
        )}
      </form>

      {/* Priority Filter Bar */}
      <div className="flex items-center gap-1.5 pb-3 mb-3 border-b-2 border-[#111111] overflow-x-auto text-xs">
        <span className="font-black text-[#111111] uppercase tracking-wider text-[11px] mr-1 shrink-0">
          Priority:
        </span>
        <button
          type="button"
          onClick={() => setPriorityFilter('All')}
          className={`px-2.5 py-1 text-xs font-bold border-2 border-[#111111] shadow-brutal-sm transition-all cursor-pointer shrink-0 ${
            priorityFilter === 'All'
              ? 'bg-[#111111] text-white'
              : 'bg-white text-[#111111] hover:bg-slate-100'
          }`}
        >
          All ({counts.all})
        </button>
        <button
          type="button"
          onClick={() => setPriorityFilter('High')}
          className={`px-2.5 py-1 text-xs font-bold border-2 border-[#111111] shadow-brutal-sm transition-all cursor-pointer shrink-0 ${
            priorityFilter === 'High'
              ? 'bg-[#FF6B6B] text-[#111111]'
              : 'bg-white text-[#111111] hover:bg-slate-100'
          }`}
        >
          High ({counts.high})
        </button>
        <button
          type="button"
          onClick={() => setPriorityFilter('Med')}
          className={`px-2.5 py-1 text-xs font-bold border-2 border-[#111111] shadow-brutal-sm transition-all cursor-pointer shrink-0 ${
            priorityFilter === 'Med'
              ? 'bg-[#FFE066] text-[#111111]'
              : 'bg-white text-[#111111] hover:bg-slate-100'
          }`}
        >
          Med ({counts.med})
        </button>
        <button
          type="button"
          onClick={() => setPriorityFilter('Low')}
          className={`px-2.5 py-1 text-xs font-bold border-2 border-[#111111] shadow-brutal-sm transition-all cursor-pointer shrink-0 ${
            priorityFilter === 'Low'
              ? 'bg-[#4ECDC4] text-[#111111]'
              : 'bg-white text-[#111111] hover:bg-slate-100'
          }`}
        >
          Low ({counts.low})
        </button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[380px] pr-1">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFDF5] border-[3px] border-dashed border-[#111111]/40">
            <p className="font-heading font-black text-sm text-[#111111]">
              NO TASKS IN THIS QUEUE
            </p>
            <p className="text-xs font-bold text-[#111111]/60 mt-1">
              Add a new mission above or change your filter selection.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 border-[3px] border-[#111111] shadow-brutal-sm flex items-center justify-between gap-3 transition-all ${
                task.completed
                  ? 'bg-[#FFFDF5] opacity-75'
                  : 'bg-white hover:bg-[#FFFDF5]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Completion Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  title={task.completed ? 'Mark pending' : 'Complete task (+25 XP)'}
                  className={`w-6 h-6 border-[3px] border-[#111111] shadow-brutal-sm flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer ${
                    task.completed ? 'bg-[#4ECDC4] text-[#111111]' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Priority Tag */}
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase border-2 border-[#111111] shadow-brutal-sm shrink-0 ${getPriorityStyle(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>

                {/* Task Title */}
                <span
                  className={`text-sm font-bold text-[#111111] truncate ${
                    task.completed ? 'line-through text-[#111111]/50' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                title="Delete task"
                className="p-1.5 text-[#111111] hover:bg-[#FF6B6B] border-2 border-transparent hover:border-[#111111] hover:shadow-brutal-sm transition-all shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Bottom Hint */}
      <div className="pt-3 mt-auto border-t-2 border-[#111111] flex items-center justify-between text-[11px] font-bold text-[#111111]/70">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B6B]" />
          <span>Completing a task grants +25 XP</span>
        </span>
        <span className="font-mono-nums">{filteredTasks.length} shown</span>
      </div>
    </div>
  );
};
