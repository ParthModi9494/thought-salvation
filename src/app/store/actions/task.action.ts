import { Task } from '../../models/task.model';
export class AddTask {
  static readonly type = '[Task] Add';
  constructor(public task: Task) {}
}

export class UpdateTask {
  static readonly type = '[Task] Update';
  constructor(public task: Task) {}
}

export class DeleteTask {
  static readonly type = '[Task] Delete';
  constructor(id: string) {}
}

export class FetchAllTasks {
  static readonly type = '[Task] FetchAll';
}
