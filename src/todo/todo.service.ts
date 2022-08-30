import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService){}

  getTasks(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc'
      },
    });
  }
  getTask(taskId: number): Promise<Task> {
    return this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
  }
  getTaskById(userId: number, taskId: number): Promise<Task> {
    return this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId
      },
    });
  }
  async createTask(userId: number, dto:CreateTaskDto): Promise<Task> {
    const task =  await this.prisma.task.create({
      data: {
        userId,
        ...dto,
      }
    })
    return task;
  }
  async updateTaskById(
    userId: number, 
    taskId: number, 
    dto:UpdateTaskDto): Promise<Task> {
      const task = await this.prisma.task.findUnique({
        where: {
          id:taskId,
        }
      })
      if(!task || task.userId !== userId) {
        throw new ForbiddenException('No permission to update');
      }
      return this.prisma.task.update({
        where: {
          id:taskId,
        },
        data: {
          ...dto,
        }
      })
    }
  async deleteTaskById(
    userId: number, 
    taskId: number
    ): Promise<void> {
      const task = await this.prisma.task.findUnique({
        where: {
          id:taskId,
        }
      })
      if(!task || task.userId !== userId) {
        throw new ForbiddenException('No permission to delete');
      }
      await this.prisma.task.delete({
        where: {
          id:taskId,
        },
      })
    }
    async changeTaskDone(
      taskId:number,
      done:boolean
    ): Promise<Task> {
      console.log(done)
      const bool = JSON.stringify(done) === "{}"
      console.log(bool)
        const task =  await this.prisma.task.update({
        where: {
          id:taskId
        },
        data: {
          done: bool ? true : false
        }
      })
      if(!task) {
        throw new ForbiddenException('No Todo to delete');
      }
      return task
    }
}
