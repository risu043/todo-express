import {databaseManager} from "@/db";
const prisma = databaseManager.getInstance();

export const getTasks = async () => {
  return await prisma.task.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getTask = async (taskId: number) => {
  return await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
};
