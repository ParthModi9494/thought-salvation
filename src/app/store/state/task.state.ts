import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { tap } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import { FetchAllTasks } from '../actions/task.action';

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
  static fetchAllTasks(state: TaskStateModel) {
    return state.tasks;
  }

  @Action(FetchAllTasks)
  fetchAllTasks(state: StateContext<TaskStateModel>) {
    return this.tasksService.getAllTasks().pipe(
      tap((tasks) => {
        state.setState({ ...state.getState(), tasks });
      })
    );
  }
}
