import express from "express";
import {body, validationResult} from "express-validator";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "@/models/task";
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
  res.render("tasks/new", {
    task: {},
  });
});

router.post(
  "/tasks",
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("DueDate is required"),
  body("dueDate")
    .isDate({format: "YYYY-MM-DD"})
    .withMessage("DueDate must be a valid date in YYYY-MM-DD format"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("tasks/new", {
        task: req.body,
        errors: errors.array(),
      });
    }
    const {title, description, dueDate} = req.body;
    const newTask = {
      title,
      description,
      dueDate: new Date(dueDate),
      isDone: false,
    };
    await createTask(newTask);
    res.redirect("/");
  },
);

router.get("/tasks/:id/edit", async (req, res) => {
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
  res.render("tasks/edit", {task: convertedTask});
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

router.patch(
  "/tasks/:id",
  body("title").notEmpty().withMessage("Title is required"),
  body("dueDate")
    .notEmpty()
    .withMessage("DueDate is required")
    .isDate({format: "YYYY-MM-DD"})
    .withMessage("DueDate must be a valid date in YYYY-MM-DD format"),
  async (req: express.Request<{id: string}>, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("tasks/edit", {
        task: req.body,
        errors: errors.array(),
      });
    }
    const {id} = req.params;
    const {title, description, dueDate, isDone} = req.body;

    const newTask = {
      title,
      description,
      dueDate: new Date(dueDate),
      isDone: isDone === "true",
    };
    await updateTask(Number(id), newTask);
    res.redirect("/");
  },
);

router.delete("/tasks/:id", async (req, res) => {
  const {id} = req.params;
  await deleteTask(Number(id));
  res.redirect("/");
});
