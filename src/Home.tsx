import List from "./List";
import Form from "./Form";
import useTodos from "./hooks/useTodos";

export default function () {
  const {
    todos,
    submit,
    complete,
    update,
    editingId,
    setEditingId,
    error,
    isLoading,
  } = useTodos();
  return (
    <>
      <div>Todo App</div>
      <List
        todos={todos}
        complete={complete}
        update={update}
        editingId={editingId}
        setEditingId={setEditingId}
      />
      <Form onSubmit={submit} isLoading={isLoading} error={error} />
    </>
  );
}
