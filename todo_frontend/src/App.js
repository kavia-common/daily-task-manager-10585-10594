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
        <h1>
          <span role="img" aria-label="List" className="header-icon">📝</span> 
          Daily Tasks
        </h1>
      </header>
      <main className="todo-main">
        {/* Add Task Input */}
        <form className="todo-add-form" onSubmit={handleAddTodo} autoComplete="off">
          <input
            ref={inputRef}
            type="text"
            className="todo-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a new task..."
            aria-label="Add a new task"
            maxLength={100}
          />
          <button
            className="btn-primary btn-add"
            type="submit"
            title="Add task"
            aria-label="Add task"
            disabled={!input.trim()}
          >
            +
          </button>
        </form>
        {/* Task List */}
        <ul className="todo-list">
          {todos.length === 0 && (
            <li className="todo-empty">Your to-do list is empty.</li>
          )}
          {todos.map(todo =>
            <li key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
              <span className="todo-check">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                  aria-label={`Mark task "${todo.text}" as ${todo.completed ? 'not completed' : 'completed'}`}
                />
              </span>
              {editId === todo.id ? (
                <form className="todo-edit-form" onSubmit={e => handleEditSubmit(e, todo.id)}>
                  <input
                    className="todo-edit-input"
                    value={editText}
                    onChange={handleEditChange}
                    onKeyDown={e => e.key==='Escape' && handleCancelEdit()}
                    aria-label="Edit task"
                    maxLength={100}
                    autoFocus
                  />
                  <button type="submit" className="btn-primary btn-save" title="Save changes" aria-label="Save">
                    Save
                  </button>
                  <button type="button" className="btn-secondary btn-cancel" onClick={handleCancelEdit} title="Cancel edit" aria-label="Cancel">
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span className="todo-text" aria-label={todo.text}>
                    {todo.text}
                  </span>
                  <span className="todo-actions">
                    <button
                      className="btn-accent btn-edit"
                      aria-label={`Edit task "${todo.text}"`}
                      title="Edit"
                      onClick={() => startEditTodo(todo.id, todo.text)}
                      tabIndex={0}
                    >✏️</button>
                    <button
                      className="btn-secondary btn-delete"
                      aria-label={`Delete task "${todo.text}"`}
                      title="Delete"
                      onClick={() => handleDeleteTodo(todo.id)}
                      tabIndex={0}
                    >🗑️</button>
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
