import express from "express";
import {getTask, getTasks} from "@/models/task";
import {formatDate} from "@/lib/util";

export const router = express.Router();

router.get("/", async (req, res) => {
  const tasks = await getTasks();

  const convertedTasks = tasks.map(task => {
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    let priority;
    if (
      dueDate.getFullYear() === now.getFullYear() &&
      dueDate.getMonth() === now.getMonth() &&
      dueDate.getDate() === now.getDate()
    ) {
      priority = "Normal";
    } else if (dueDate < now) {
      priority = "High";
    } else {
      priority = "Low";
    }

    return {
      ...task,
      dueDate: formatDate(task.dueDate),
      status: task.isDone ? "DONE" : "TODO",
      priority,
    };
  });
  res.render("tasks/index", {tasks: convertedTasks});
});

router.get("/tasks/new", (req, res) => {
  res.render("tasks/new");
});

router.get("/tasks/:id", async (req, res) => {
  const {id} = req.params;
  const task = await getTask(Number(id));
  if (task === null) {
    res.status(404).send("Task not found");
    return;
  }
  const convertedTask = {
    ...task,
    dueDate: formatDate(task.dueDate),
  };
  res.render("tasks/show", {task: convertedTask});
});
