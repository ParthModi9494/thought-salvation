export class AddTask {
  static readonly type = '[Task] Add';
  constructor(task: Task) {}
}

export class EditTask {
  static readonly type = '[Task] Edit';
  constructor(task: Task) {}
}

export class DeleteTask {
  static readonly type = '[Task] Delete';
  constructor(id: string) {}
}

export class FetchAllTasks {
  static readonly type = '[Task] FetchAll';
}
