import React, { useCallback, useEffect, useState } from "react";
import api from "../axiosClient";
import { Todo } from "../type";

export default function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTodos() {
    try {
      setIsloading(true);
      const results = await api.get(`/api/todos`);
      return results.data;
    } catch (error) {
      throw error;
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    const loadTodo = async () => {
      try {
        const data = await fetchTodos();
        if (isMounted) {
          setTodos(data);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to load data.");
          console.error("Failed to fetch data", error);
        }
      }
    };

    loadTodo();

    return () => {
      isMounted = false;
    };
  }, []);

  const submit = useCallback(
    async (formData: FormData) => {
      const todo = formData.get("todo");
      if (typeof todo === "string" && todo.trim() !== "") {
        try {
          setIsloading(true);
          const res = await api.post(`/api/todos`, { content: todo.trim() });
          setTodos((prev) => [...prev, res.data]);
          setIsloading(false);
        } catch (error) {
          setError("Failed to submit todo");
          console.error("Failed to submit todo");
        }
      } else {
        alert("empty item is invalid");
      }
    },
    [setIsloading, setTodos, setError]
  );

  const complete = useCallback(
    async (id: string) => {
      const prevTodos = todos;
      try {
        await api.delete(`/api/todos/${id}`);
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      } catch (error) {
        setError("Failed to complete todo");
        setTodos(prevTodos);
      }
    },
    [setTodos, setError, todos]
  );

  const update = useCallback(
    async (id: string, newContent: string) => {
      const prevTodos = todos;
      //optimisitically operation
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, content: newContent } : todo
        )
      );
      setEditingId(null);
      try {
        await api.put(`/api/todos/${id}`, { content: newContent });
      } catch (error) {
        setError("Failed to update todo");
        setTodos(prevTodos);
      }
    },
    [setTodos, setEditingId, todos]
  );

  return {
    submit,
    complete,
    update,
    isLoading,
    editingId,
    setEditingId,
    error,
    todos,
  };
}
