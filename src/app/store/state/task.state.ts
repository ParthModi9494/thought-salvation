import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';
import { map, of, tap } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import { AddTask, FetchAllTasks, UpdateTask } from '../actions/task.action';
const TASKS_STATE_TOKEN = new StateToken<TaskStateModel>('tasks');
export interface TaskStateModel {
  tasks: Task[];
}

@State<TaskStateModel>({
  name: TASKS_STATE_TOKEN,
  defaults: {
    tasks: [],
  },
})
@Injectable({
  providedIn: 'root',
})
export class TaskState {
  constructor(private tasksService: TasksService) {}

  @Selector()
  static fetchAllTasks(state: TaskStateModel): Task[] {
    return state.tasks;
  }

  @Action(FetchAllTasks)
  fetchAllTasks(state: StateContext<TaskStateModel>) {
    if (state.getState().tasks.length) {
      return of(state.getState().tasks);
    } else {
      return this.tasksService.getAllTasks().pipe(
        map((tasks) => {
          state.setState({ ...state.getState(), tasks });
          return tasks;
        })
      );
    }
  }

  @Action(UpdateTask)
  updateTask(context: StateContext<TaskStateModel>, action: UpdateTask) {
    const taskData = action.task;
    return this.tasksService.updateTask(taskData.id, taskData).pipe(
      tap(() => {
        context.setState(
          patch<TaskStateModel>({
            tasks: updateItem<Task>(
              (task) => task?.id === taskData.id,
              taskData
            ),
          })
        );
      })
    );
  }

  @Action(AddTask)
  AddTask(context: StateContext<TaskStateModel>, action: AddTask) {
    const taskData = action.task;
    return this.tasksService.addNewTask(taskData).pipe(
      tap((id: string) => {
        context.setState(
          patch<TaskStateModel>({
            tasks: insertItem<Task>({ ...taskData, id }),
          })
        );
      })
    );
  }
}
