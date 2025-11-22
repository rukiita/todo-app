import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import Home from "./Home";
import axios from "axios";

// mock axios and inform compilar that axios has been mocked
jest.mock("axios", () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockDelete = jest.fn();
  const mockPut = jest.fn();
  return {
    create: jest.fn(() => ({
      get: mockGet,
      post: mockPost,
      delete: mockDelete,
      put: mockPut,
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })),
    get: mockGet,
    post: mockPost,
    delete: mockDelete,
    put: mockPut,
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App level State Transition", () => {
  //reset mock before each test
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.delete.mockReset();
  });

  test("empty -> populated ->populated -> empty", async () => {
    //setup
    const user = userEvent.setup();
    mockedAxios.get.mockReturnValue({ data: [] } as any);
    //first post
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: "id-1", content: "make portfolio" },
    } as any);

    //secound post
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: "id-2", content: "training coding test" },
    } as any);
    mockedAxios.delete.mockResolvedValue({ data: {} });
    render(<Home />);

    //first todo submit
    expect(screen.getByText("There is no todos")).toBeInTheDocument();
    expect(screen.queryByText("make portfolio")).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText("input Todo");
    const submit = screen.getByRole("button", { name: /submit/ });
    await user.type(input, "make porfolio");
    await user.click(submit);

    //side effect
    waitFor(() => {
      expect(screen.getByText("There is no todos")).not.toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
    expect(
      await screen.findByDisplayValue("make portfolio")
    ).toBeInTheDocument();
    expect(input).toHaveValue("");

    //second submit
    expect(
      screen.queryByDisplayValue("training coding test")
    ).not.toBeInTheDocument();
    await user.type(input, "training coding test");
    await user.click(submit);

    //side effect
    waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    expect(
      await screen.findByDisplayValue("training coding test")
    ).toBeInTheDocument();
    expect(input).toHaveValue("");

    //delete first todo
    const deleteButtons = screen.getAllByRole("button", { name: /complete/i });
    expect(deleteButtons).toHaveLength(2);

    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        screen.queryByDisplayValue("make portfolio")
      ).not.toBeInTheDocument();
    });

    //delete second todo
    expect(
      screen.getByDisplayValue("training coding test")
    ).toBeInTheDocument();

    const lastDeleteButton = screen.getByRole("button", { name: /complete/i });
    await user.click(lastDeleteButton);

    await waitFor(() => {
      expect(
        screen.queryByDisplayValue("training coding test")
      ).not.toBeInTheDocument();
      expect(screen.getByText("There is no todos")).toBeInTheDocument();
    });
  });
});

describe("Item Level State Transitions", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.delete.mockReset();
    mockedAxios.put.mockReset();
  });

  //helper method
  const setupTodos = async (todos: any[]) => {
    mockedAxios.get.mockResolvedValue({ data: todos } as any);

    render(<Home />);

    if (todos.length > 0) {
      await screen.findByDisplayValue(todos[0].content);
    }
  };

  test("idle -> completed -> idle", async () => {
    const user = userEvent.setup();
    const initialTodos = [
      { id: "id-1", content: "Task 1", isCompleted: false },
      { id: "id-2", content: "Task 2", isCompleted: false },
    ];

    // PUT Request Mock
    // mockedAxios.put.mockResolvedValue({
    //   data: { ...initialTodos[0], isCompleted: true },
    // } as any);

    await setupTodos(initialTodos);

    // confirm a number of buttons
    const initialButtons = screen.getAllByRole("button", {
      name: /complete/i,
    });
    expect(initialButtons).toHaveLength(2);

    const task1Input = screen.getByDisplayValue("Task 1");
    const task1Row = task1Input.closest("div") as HTMLElement;
    const completeButton1 = within(task1Row).getByRole("button", {
      name: /complete/i,
    });

    // 1. Idle -> Completed (1つ目を完了)
    await user.click(completeButton1);

    await waitFor(() => {
      //confirm a number of buttons
      const currentButtons = screen.getAllByRole("button", {
        name: /complete/i,
      });
      expect(currentButtons).toHaveLength(1);
    });
  });

  test("idle -> editing -> idle", async () => {
    const user = userEvent.setup();
    const initialTodos = [
      { id: "id-1", content: "make portfolio", isCompleted: false },
    ];
    mockedAxios.put.mockResolvedValue({
      data: { id: "id-1", content: "updated content", isCompleted: false },
    } as any);

    //in this case todo will not be completed ,so we use only one todo
    await setupTodos(initialTodos);

    const todoInput = screen.getByDisplayValue("make portfolio");

    // 1. Idle -> Editing
    await user.dblClick(todoInput);
    const saveButton = screen.getByRole("button", { name: /save/i });

    // 2. Editing -> Idle
    await user.clear(todoInput);
    await user.type(todoInput, "updated content");
    await user.click(saveButton);

    // 3. Editing -> Idle
    // Assertion: a content updated and readOnly is attached again
    await waitFor(() => {
      expect(screen.getByDisplayValue("updated content")).toHaveAttribute(
        "readonly"
      );
      expect(
        screen.queryByRole("button", { name: /save/i })
      ).not.toBeInTheDocument();
    });
  });

  test("idle -> editing -> completed -> idle", async () => {
    const user = userEvent.setup();
    const initialTodos = [
      { id: "id-1", content: "Task 1", isCompleted: false },
      { id: "id-2", content: "Task 2", isCompleted: false },
    ];

    // mockedAxios.put.mockResolvedValue({
    //   data: { ...initialTodos[0], isCompleted: true },
    // } as any);

    await setupTodos(initialTodos);
    const task1Input = screen.getByDisplayValue("Task 1");

    const initialButtons = screen.getAllByRole("button", {
      name: /complete/i,
    });
    expect(initialButtons).toHaveLength(2);

    // 1. Idle -> Editing
    await user.dblClick(task1Input);
    expect(task1Input).not.toHaveAttribute("readonly");

    // 2. Editing -> Completed
    const task1Row = task1Input.closest("div") as HTMLElement;
    const completeButton1 = within(task1Row).getByRole("button", {
      name: /complete/i,
    });
    await user.click(completeButton1);

    // 3. Completed -> Idle
    await waitFor(() => {
      expect(task1Input).not.toBeInTheDocument();
      expect(completeButton1).not.toBeInTheDocument();
    });

    const currentButtons = screen.getAllByRole("button", {
      name: /complete/i,
    });
    expect(currentButtons).toHaveLength(1);
  });
});
