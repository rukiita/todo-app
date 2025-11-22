import express from "express";
import { connectDB, getDB } from "./mongoClient.js";
import { ObjectId } from "mongodb";
import cors from "cors";

const app = express();
const port = 3001;

app.use(express.json());
await connectDB();

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get(`/api/todos`, async (req, res) => {
  try {
    const db = await getDB();
    const todos = await db.collection("todos").find({}).toArray();
    const formattedTodos = todos.map(
      (todo: { _id: any; content: string; isCompleted: boolean }) => ({
        id: todo._id,
        content: todo.content,
        isCompleted: todo.isCompleted,
      })
    );

    res.status(200).json(formattedTodos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post(`/api/todos`, async (req, res) => {
  try {
    const db = await getDB();
    const { content } = req.body;

    if (!content) {
      return res.status(400).send({ message: "Content is required" });
    }

    const todoData = {
      content: content,
      createdAt: new Date(),
      isCompleted: false,
    };

    const results = await db.collection("todos").insertOne(todoData);
    res.status(201).json({
      id: results.insertedId,
      content: todoData.content,
      isCompleted: todoData.isCompleted,
      createdAt: todoData.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;
    const result = await db
      .collection("todos")
      .deleteOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(400).send({ message: "Todo is not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todos" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const db = await getDB();
    const { id } = req.params;
    const { content } = req.body;
    const result = await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(id) }, { $set: { content } });

    if (result.matchedCount === 0) {
      return res.status(400).send({ message: "Todo is not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todos" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
