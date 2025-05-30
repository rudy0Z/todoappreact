import React, { useState, useEffect } from "react";

const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed"
};

const STATUS = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed"
};

function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(STATUS.TODO);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Task cannot be empty.");
      return;
    }
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: trimmed,
        completed: false,
        status
      }
    ]);
    setInput("");
    setStatus(STATUS.TODO);
    setError("");
  };

  const handleRemove = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleToggle = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              status: t.completed ? STATUS.IN_PROGRESS : STATUS.COMPLETED
            }
          : t
      )
    );
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, status: newStatus, completed: newStatus === STATUS.COMPLETED } : t
      )
    );
  };

  const handleFilter = (f) => setFilter(f);
  const handleSort = () => setSortAsc((asc) => !asc);

  const filtered = tasks.filter((t) => {
    if (filter === FILTERS.ACTIVE) return !t.completed;
    if (filter === FILTERS.COMPLETED) return t.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortAsc) return a.text.localeCompare(b.text);
    return b.text.localeCompare(a.text);
  });

  return (
    <div className="todo-container">
      <h2 className="todo-title">To-Do List</h2>
      <form onSubmit={handleAdd} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
          aria-label="Task input"
        />
        <button type="submit" className="todo-add-btn">Add</button>
      </form>
      {error && <div className="todo-error">{error}</div>}
      <div className="todo-controls">
        <button onClick={() => handleFilter(FILTERS.ALL)} disabled={filter===FILTERS.ALL} className={filter===FILTERS.ALL ? "active" : ""}>All</button>
        <button onClick={() => handleFilter(FILTERS.ACTIVE)} disabled={filter===FILTERS.ACTIVE} className={filter===FILTERS.ACTIVE ? "active" : ""}>Active</button>
        <button onClick={() => handleFilter(FILTERS.COMPLETED)} disabled={filter===FILTERS.COMPLETED} className={filter===FILTERS.COMPLETED ? "active" : ""}>Completed</button>
        <button onClick={handleSort}>{sortAsc ? "A-Z" : "Z-A"}</button>
      </div>
      <ul className="todo-list">
        {sorted.length === 0 && <li className="todo-empty">No tasks</li>}
        {sorted.map((t) => (
          <li key={t.id} className={"todo-item" + (t.completed ? " completed" : "") }>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => handleToggle(t.id)}
              aria-label={t.text}
            />
            <span className="todo-text">{t.text}</span>
            <select
              value={t.status || STATUS.TODO}
              onChange={(e) => handleStatusChange(t.id, e.target.value)}
              className="todo-status-select"
              aria-label="Change status"
            >
              <option value={STATUS.TODO}>To Do</option>
              <option value={STATUS.IN_PROGRESS}>In Progress</option>
              <option value={STATUS.COMPLETED}>Completed</option>
            </select>
            <button onClick={() => handleRemove(t.id)} aria-label="Remove task" className="todo-remove-btn">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;