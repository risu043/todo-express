import {databaseManager} from "@/db";
import {Prisma} from "@prisma/client";

const prisma = databaseManager.getInstance();

export const getTasks = async () => {
  return await prisma.task.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getTask = async (id: number) => {
  return await prisma.task.findUnique({
    where: {
      id,
    },
  });
};

export const createTask = async (data: Prisma.TaskCreateInput) => {
  return await prisma.task.create({data});
};

export const updateTask = async (id: number, data: Prisma.TaskUpdateInput) => {
  return await prisma.task.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteTask = async (id: number) => {
  return await prisma.task.delete({
    where: {
      id,
    },
  });
};
