import { FormEvent, useState } from "react";

interface FormProps {
  // 親から渡される submit 関数の型
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function Form({ onSubmit, isLoading, error }: FormProps) {
  const [todo, setTodo] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
    setTodo("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="todo"
        value={todo}
        placeholder="input Todo"
        onChange={(e) => setTodo(e.target.value)}
      />
      <button type="submit">submit</button>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </form>
  );
}
