import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/**
 * Minimalistic To-Do Manager - React
 * Features: Add, edit, delete, view, complete tasks
 * Theme: Light, minimal, single-column
 * Colors: primary (#1976d2), accent (#ff9800), secondary (#424242)
 */

// PUBLIC_INTERFACE
function App() {
  // MAIN STATE: List of todo items
  const [todos, setTodos] = useState(() => {
    // Optionally persist in localStorage for browser refresh robustness
    const saved = window.localStorage.getItem("todo-items");
    return saved ? JSON.parse(saved) : [];
  });
  // Input state for the new todo
  const [input, setInput] = useState('');
  // Track which todo is being edited; null if none
  const [editId, setEditId] = useState(null);
  // Temporary storage for editing todo text
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);

  // Persist todos in localStorage (simulate persistence)
  useEffect(() => {
    window.localStorage.setItem("todo-items", JSON.stringify(todos));
  }, [todos]);

  // PUBLIC_INTERFACE
  function handleAddTodo(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        completed: false
      }
    ]);
    setInput('');
    inputRef.current?.blur();
  }

  // PUBLIC_INTERFACE
  function handleDeleteTodo(id) {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }

  // PUBLIC_INTERFACE
  function handleToggleComplete(id) {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // PUBLIC_INTERFACE
  function startEditTodo(id, text) {
    setEditId(id);
    setEditText(text);
  }

  // PUBLIC_INTERFACE
  function handleEditChange(e) {
    setEditText(e.target.value);
  }

  // PUBLIC_INTERFACE
  function handleEditSubmit(e, id) {
    e.preventDefault();
    const text = editText.trim();
    if (!text) return;
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text } : todo
      )
    );
    setEditId(null);
    setEditText('');
  }

  // PUBLIC_INTERFACE
  function handleCancelEdit() {
    setEditId(null);
    setEditText('');
  }

  // Minimalistic, single-column layout
  return (
    <div className="todo-app-bg">
      <header className="todo-header">
        <h1 style={{
          letterSpacing: "0.03em",
          fontWeight: 700,
          fontSize: "2.05rem",
          marginBottom: 0,
          marginTop: 0
        }}>
          <span aria-hidden="true" className="header-icon" style={{display:'inline-flex', alignItems:'center'}}>
            {/* SVG clipboard icon */}
            <svg width="30" height="28" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 26 28" style={{marginRight:6}}>
              <rect x="5" y="5" width="16" height="20" rx="4" fill="#fff" fillOpacity="0.21" stroke="#fff" strokeWidth="1.2"/>
              <rect x="2.5" y="2.8" width="21" height="23" rx="4.7" fill="#fff" stroke="#1976d2" strokeWidth="2"/>
              <rect x="7.7" y="0.7" width="8.6" height="4.6" rx="2.3" fill="#ff9800" stroke="#1976d2" strokeWidth="1.2"/>
            </svg>
          </span> 
          Daily Tasks
        </h1>
      </header>
      <main className="todo-main">
        {/* Add Task Input */}
        <form 
          className="todo-add-form" 
          onSubmit={handleAddTodo} 
          autoComplete="off"
          role="form"
          aria-label="Add a new task form"
        >
          <input
            ref={inputRef}
            type="text"
            className="todo-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a new task..."
            aria-label="Add a new task"
            aria-required="true"
            maxLength={100}
            autoComplete="off"
            onKeyDown={e => {
              if (e.key === "Enter" && !input.trim()) e.preventDefault();
            }}
          />
          <button
            className="btn-primary btn-add"
            type="submit"
            title="Add task"
            aria-label="Add task"
            disabled={!input.trim()}
            tabIndex={0}
          >
            {/* SVG plus icon */}
            <svg width="25" height="25" aria-hidden="true" tabIndex={-1} style={{display:'block',margin:'0 auto'}} fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" fill="#fff" opacity="0.07"/>
              <path d="M10 6V14M14 10H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            <span className="sr-only" style={{display:'none'}}>Add</span>
          </button>
        </form>
        {/* Task List */}
        <ul className="todo-list" aria-live="polite">
          {todos.length === 0 && (
            <li className="todo-empty">
              <span className="empty-icon" aria-hidden="true">
                {/* Sad face SVG icon */}
                <svg width="32" height="32" fill="none" aria-hidden="true" tabIndex={-1} focusable="false" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="13.5" stroke="#1976d2" strokeWidth="2" fill="#f4f8fd"/>
                  <ellipse cx="11.25" cy="15.8" rx="1.18" ry="1.4" fill="#1976d2"/>
                  <ellipse cx="20.85" cy="15.8" rx="1.18" ry="1.4" fill="#1976d2"/>
                  <path d="M13.2 21.5c.7-.8 2.9-.8 3.6 0" stroke="#b2b6ba" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              Your to-do list is empty.<br />
              <span style={{fontSize:'0.93em', opacity:0.74}}>
                Start by typing a new task above!
              </span>
            </li>
          )}
          {todos.map(todo =>
            <li 
              key={todo.id} 
              className={`todo-item${todo.completed ? ' completed' : ''}`}
              tabIndex={-1}
              aria-label={todo.completed ? `Task "${todo.text}", completed.` : `Task "${todo.text}"`}
              style={{
                animation: todo.completed
                  ? "taskCompleteFade 0.5s cubic-bezier(.46,.8,.18,1.08)"
                  : "todoAppear 0.43s cubic-bezier(.14,.86,.43,.98)"
              }}
            >
              <span className="todo-check">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                  aria-label={`Mark task "${todo.text}" as ${todo.completed ? 'not completed' : 'completed'}`}
                  tabIndex={0}
                  style={{
                    transition: 'box-shadow 0.13s, border-color 0.16s'
                  }}
                />
                {/* Custom checked icon */}
                {todo.completed && (
                  <span aria-hidden="true" style={{
                    marginLeft: '-22px',
                    pointerEvents:'none',
                    width: '21px',
                    height: '21px',
                    position: 'absolute',
                    zIndex:2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Checkmark SVG */}
                    <svg width="19" height="17" viewBox="0 0 19 17" aria-hidden="true" style={{display:'block'}} fill="none">
                      <polyline points="2.8 8.9 7.5 14.2 16.2 3.2" stroke="#1976d2" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </span>
              {editId === todo.id ? (
                <form 
                  className="todo-edit-form"
                  onSubmit={e => handleEditSubmit(e, todo.id)}
                  aria-label="Edit todo"
                >
                  <input
                    className="todo-edit-input"
                    value={editText}
                    onChange={handleEditChange}
                    onKeyDown={e => {
                      if (e.key==='Escape') handleCancelEdit();
                      if (e.key==='Enter' && !editText.trim()) e.preventDefault();
                    }}
                    aria-label="Edit task"
                    maxLength={100}
                    autoFocus
                  />
                  <button type="submit" className="btn-primary btn-save" title="Save changes" aria-label="Save" disabled={!editText.trim()}>
                    {/* Save SVG icon */}
                    <svg width="17" height="17" fill="none" viewBox="0 0 17 17">
                      <rect x="3" y="3" width="11" height="11" rx="2.5" fill="#fff" opacity="0.09"/>
                      <polyline points="5 9 8 12 12 6"
                        stroke="#fff" strokeWidth="1.7"
                        fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="3" y="3" width="11" height="11" rx="2.5" stroke="#fff" strokeWidth="1.3" />
                    </svg>
                  </button>
                  <button type="button" className="btn-secondary btn-cancel" onClick={handleCancelEdit} title="Cancel edit" aria-label="Cancel">
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      <circle cx="8" cy="8" r="7.4" fill="#fff" opacity="0.16"/>
                      <line x1="5.3" y1="5.3" x2="10.7" y2="10.7" stroke="#424242" strokeWidth="1.7" strokeLinecap="round"/>
                      <line x1="10.7" y1="5.3" x2="5.3" y2="10.7" stroke="#424242" strokeWidth="1.7" strokeLinecap="round"/>
                      <circle cx="8" cy="8" r="7.2" stroke="#424242" strokeWidth="1.2" fill="none"/>
                    </svg>
                  </button>
                </form>
              ) : (
                <>
                  <span 
                    className="todo-text" 
                    aria-label={todo.text}
                    tabIndex={0}
                  >
                    {todo.text}
                  </span>
                  <span className="todo-actions">
                    <button
                      className="btn-accent btn-edit"
                      aria-label={`Edit task "${todo.text}"`}
                      title="Edit"
                      onClick={() => startEditTodo(todo.id, todo.text)}
                      tabIndex={0}
                    >
                      {/* SVG pencil icon */}
                      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false" style={{display:'block',marginRight:2}} fill="none">
                        <rect x="3.5" y="13.3" width="8" height="1.7" rx="0.8" fill="#ff9800" fillOpacity="0.14"/>
                        <path d="M12.28 4.3l1.42 1.42a.9.9 0 010 1.28L7.1 13.3c-.1.1-.2.17-.33.19l-3.2.53c-.26.04-.5-.18-.46-.46l.53-3.2a.38.38 0 01.1-.2l6.59-6.58a.9.9 0 011.28 0z"
                          stroke="#ff9800" strokeWidth="1.13" fill="#fff8e1"/>
                      </svg>
                    </button>
                    <button
                      className="btn-secondary btn-delete"
                      aria-label={`Delete task "${todo.text}"`}
                      title="Delete"
                      onClick={() => handleDeleteTodo(todo.id)}
                      tabIndex={0}
                    >
                      {/* SVG trash can icon */}
                      <svg width="18" height="17" viewBox="0 0 18 17" aria-hidden="true" focusable="false" fill="none">
                        <rect x="4.2" y="4.3" width="9.5" height="9.4" rx="2" fill="#424242" opacity="0.09"/>
                        <rect x="4.6" y="5.7" width="8.7" height="6.8" rx="1.4" stroke="#424242" strokeWidth="1.1" fill="#fff"/>
                        <rect x="7.2" y="3" width="3.8" height="1.6" rx="0.7" fill="#ff9800" stroke="#424242" strokeWidth="0.6"/>
                        <path d="M7 7.8v2.7m4-2.7v2.7" stroke="#1976d2" strokeWidth="1.1" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </span>
                </>
              )}
            </li>
          )}
        </ul>
      </main>
      <footer className="todo-footer">
        <small>
          Minimalistic To-Do | <span style={{color:"var(--primary)"}}>React</span> | Light theme
        </small>
      </footer>
    </div>
  );
}

export default App;
