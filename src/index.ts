import cors from "cors";
import express, { Application, Request, Response } from "express";
import { nanoid } from "nanoid";
import fs from "node:fs";

const app: Application = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello my nigga Welcome to the Backend Homepage");
});
function Gettasks() {
  const data = fs.readFileSync("data.txt", "utf8");
  const tasks = JSON.parse(data);
  return tasks;
}

function Writetasks(tasks: { id: string; name: string; check: boolean }[]) {
  fs.writeFile("data.txt", JSON.stringify(tasks), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

app.get("/tasks", (req: Request, res: Response) => {
  const { status } = req.query;
  const tasks = Gettasks();
  const filteredData = tasks.filter((task: { check: boolean }) => {
    if (status === "All") return true;
    if (status === "Active") return !task.check;
    return task.check;
  });
  res.send(filteredData);
});
app.post("/tasks", (req: Request, res: Response) => {
  const id = nanoid();
  const { name } = req.body;
  const { check } = req.body;
  const tasks = Gettasks();
  tasks.unshift({ id, name, check });
  Writetasks(tasks);
  res.status(201).send({ id });
});
app.delete("/tasks/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const tasks = Gettasks();

  const newTasks = tasks.filter((task: { id: string }) => task.id !== id);

  Writetasks(newTasks);
  res.send(tasks);
});
app.delete("/tasks/deleteall/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const tasks = Gettasks();

  const newTasks = tasks.filter((task: { id: string }) => task.id === id);
  Writetasks(newTasks);
  res.send(tasks);
});
app.delete("/tasks/deletecompleted/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const tasks = Gettasks();

  const newTasks = tasks.filter(
    (task: { check: string; id: string }) => !task.check
  );
  Writetasks(newTasks);
  res.send(tasks);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const name = req.body.name;
  const tasks = Gettasks();
  const index = tasks.findIndex((task: { id: string }) => task.id === id);
  tasks[index].name = name;
  Writetasks(tasks);
  res.send(tasks);
});
app.put("/toggle/tasks/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { check } = req.body;
  const tasks = Gettasks();
  const index = tasks.findIndex((task: { id: string }) => task.id === id);
  tasks[index].check = check;
  Writetasks(tasks);
  res.send(tasks);
});
app.listen(port, () => {
  console.log(`Localhost:3000 deer Backend aslaa ${port}`);
});
