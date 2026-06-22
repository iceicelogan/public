import React, { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import Header from '../layout/Header';
import { NotesList, TodoItem } from '../../types';
import { genId } from '../../utils/helpers';

type View = 'home' | 'upload' | 'list';

export default function NotesPage() {
  const { notesLists, apiKey, saveNotesList, updateTodoItem, reorderTodoItems, deleteNotesList, setApiKey } = useStore();
  const [view, setView] = useState<View>('home');
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeList = notesLists.find((l) => l.id === activeListId) ?? null;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setMediaType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleExtract() {
    if (!imageBase64) return;
    const key = localApiKey.trim();
    if (!key) {
      setError('Enter your Anthropic API key first.');
      return;
    }
    setApiKey(key);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/extract-todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mediaType, apiKey: key }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed');
      const items: TodoItem[] = (data.items as string[]).map((text) => ({
        id: genId(),
        text,
        completed: false,
      }));
      const list: NotesList = {
        id: genId(),
        createdAt: new Date().toISOString(),
        imageDataUrl: imagePreview ?? undefined,
        items,
      };
      saveNotesList(list);
      setActiveListId(list.id);
      setView('list');
      setImagePreview(null);
      setImageBase64(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function moveItem(listId: string, items: TodoItem[], fromIdx: number, toIdx: number) {
    const next = [...items];
    const [item] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, item);
    reorderTodoItems(listId, next);
  }

  function startEdit(item: TodoItem) {
    setEditingKey(item.id);
    setEditingText(item.text);
  }

  function commitEdit(listId: string, itemId: string) {
    if (editingText.trim()) {
      updateTodoItem(listId, itemId, { text: editingText.trim() });
    }
    setEditingKey(null);
  }

  function addItem(list: NotesList) {
    if (!newItemText.trim()) return;
    const updated = [...list.items, { id: genId(), text: newItemText.trim(), completed: false }];
    reorderTodoItems(list.id, updated);
    setNewItemText('');
  }

  function deleteItem(list: NotesList, itemId: string) {
    reorderTodoItems(list.id, list.items.filter((i) => i.id !== itemId));
  }

  // ── Views ──────────────────────────────────────────────────────────────────

  if (view === 'upload') {
    return (
      <div className="flex flex-col h-full">
        <Header title="Scan Notes" />
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {/* API key */}
          <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wide">Anthropic API Key</label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="bg-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-500"
            />
          </div>

          {/* Image upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-600 rounded-xl h-52 text-slate-400 hover:border-orange-500 hover:text-orange-400 transition-colors"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="h-full w-full object-contain rounded-xl" />
            ) : (
              <>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                <span className="text-sm font-medium">Tap to choose photo or take a picture</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={handleExtract}
            disabled={!imageBase64 || loading}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-orange-500 text-white disabled:opacity-40 active:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Extracting tasks…
              </>
            ) : (
              'Extract To-Dos'
            )}
          </button>

          <button
            onClick={() => { setView('home'); setImagePreview(null); setImageBase64(null); setError(null); }}
            className="text-slate-400 text-sm text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (view === 'list' && activeList) {
    const incomplete = activeList.items.filter((i) => !i.completed);
    const complete = activeList.items.filter((i) => i.completed);

    return (
      <div className="flex flex-col h-full">
        <Header title="To-Do List" />
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

          {/* Source image thumbnail */}
          {activeList.imageDataUrl && (
            <div className="rounded-xl overflow-hidden h-28 bg-slate-800">
              <img src={activeList.imageDataUrl} alt="source notes" className="h-full w-full object-cover" />
            </div>
          )}

          {/* Incomplete items */}
          {incomplete.map((item, idx) => {
            const absIdx = activeList.items.indexOf(item);
            return (
              <div key={item.id} className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3">
                <button
                  onClick={() => updateTodoItem(activeList.id, item.id, { completed: true })}
                  className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-500 hover:border-orange-400 transition-colors"
                />
                {editingKey === item.id ? (
                  <input
                    autoFocus
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => commitEdit(activeList.id, item.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(activeList.id, item.id); }}
                    className="flex-1 bg-slate-700 rounded-lg px-2 py-1 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <span
                    className="flex-1 text-sm text-slate-100 cursor-pointer"
                    onDoubleClick={() => startEdit(item)}
                  >
                    {item.text}
                  </span>
                )}
                <div className="flex flex-col gap-0.5">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveItem(activeList.id, activeList.items, absIdx, absIdx - 1)}
                    className="text-slate-500 hover:text-slate-300 disabled:opacity-20 leading-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    disabled={idx === incomplete.length - 1}
                    onClick={() => moveItem(activeList.id, activeList.items, absIdx, absIdx + 1)}
                    className="text-slate-500 hover:text-slate-300 disabled:opacity-20 leading-none"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <button onClick={() => deleteItem(activeList, item.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}

          {/* Add item */}
          <div className="flex gap-2">
            <input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addItem(activeList); }}
              placeholder="Add a task…"
              className="flex-1 bg-slate-800 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-500"
            />
            <button
              onClick={() => addItem(activeList)}
              className="bg-orange-500 text-white rounded-xl px-4 font-semibold text-sm active:bg-orange-600"
            >
              Add
            </button>
          </div>

          {/* Completed items */}
          {complete.length > 0 && (
            <>
              <p className="text-xs text-slate-500 uppercase tracking-wide mt-2">Completed ({complete.length})</p>
              {complete.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-3 opacity-60">
                  <button
                    onClick={() => updateTodoItem(activeList.id, item.id, { completed: false })}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <span className="flex-1 text-sm text-slate-400 line-through">{item.text}</span>
                  <button onClick={() => deleteItem(activeList, item.id)} className="text-slate-700 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}

          <button onClick={() => setView('home')} className="text-slate-400 text-sm text-center mt-2">
            ← Back to all lists
          </button>
        </div>
      </div>
    );
  }

  // ── Home: list of saved note sessions ─────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <Header title="Notes → To-Dos" />
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <button
          onClick={() => setView('upload')}
          className="w-full py-4 rounded-xl font-semibold text-sm bg-orange-500 text-white active:bg-orange-600 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Scan Handwritten Notes
        </button>

        {notesLists.length === 0 && (
          <p className="text-slate-500 text-sm text-center mt-8">
            Take a photo of your handwritten notes and Claude will turn them into a checklist.
          </p>
        )}

        {notesLists.map((list) => {
          const done = list.items.filter((i) => i.completed).length;
          const total = list.items.length;
          const date = new Date(list.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
          return (
            <button
              key={list.id}
              onClick={() => { setActiveListId(list.id); setView('list'); }}
              className="w-full bg-slate-800 rounded-xl p-4 flex gap-3 items-center text-left active:bg-slate-700"
            >
              {list.imageDataUrl && (
                <img src={list.imageDataUrl} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 text-sm font-medium truncate">
                  {list.items[0]?.text ?? 'Empty list'}
                  {total > 1 ? ` +${total - 1} more` : ''}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">{date}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{done}/{total}</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); if (confirm('Delete this list?')) deleteNotesList(list.id); }}
                className="text-slate-600 hover:text-red-400 flex-shrink-0 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}
