import { useState } from "react";
import "./App.css";
import { Todo } from "./type";

interface ListProps {
  todos: Todo[];
  complete: (id: string) => Promise<void>;
  update: (id: string, newContent: string) => Promise<void>;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}

export default function List({
  todos,
  complete,
  update,
  editingId,
  setEditingId,
}: ListProps) {
  const [editingContent, setEditingContent] = useState("");
  const handleEditingContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingContent(e.target.value);
  };
  const handleDoubleClick = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingContent(todo.content);
  };

  if (todos.length === 0) {
    return (
      <div className="empty-message" style={{ padding: "20px", color: "#888" }}>
        There is no todos
      </div>
    );
  }

  return (
    <>
      {todos.map((todo) => (
        <div key={todo.id} className="todoList">
          <button onClick={() => complete(todo.id)}>complete</button>
          <input
            type="text"
            value={todo.id === editingId ? editingContent : todo.content}
            readOnly={todo.id !== editingId}
            onDoubleClick={() => handleDoubleClick(todo)}
            onChange={handleEditingContent}
          />
          {todo.id === editingId && (
            <button onClick={() => update(editingId, editingContent)}>
              save
            </button>
          )}
        </div>
      ))}
    </>
  );
}
