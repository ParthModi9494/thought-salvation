import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { appConstants } from 'src/app/constants/app.constant';
import { Task } from 'src/app/models/task.model';
import { TasksService } from 'src/app/services/tasks.service';
import {
  AddTask,
  FetchAllTasks,
  UpdateTask,
} from 'src/app/store/actions/task.action';
import { TaskState } from 'src/app/store/state/task.state';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {
  contenteditable = true;
  tasks: QueryDocumentSnapshot<Task>[] = [];
  savedCopy: Task;
  thoughtType = appConstants.THOUGHT_TYPE;
  myForm!: FormGroup;
  tasksSubscription: Subscription | undefined;
  @Select(TaskState.fetchAllTasks) tasks$: Observable<Task[]> | undefined;
  filteredTasks: Task[] = [];

  constructor(
    private tasksService: TasksService,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.savedCopy = {
      id: '',
      completed: false,
      endDate: '',
      startDate: '',
      title: '',
      type: '',
      visualise: '',
    };
  }

  ngOnInit(): void {
    this.myForm = this.createForm();
    this.store.dispatch(new FetchAllTasks());

    this.tasksSubscription = this.tasks$?.subscribe((tasks) => {
      this.filteredTasks = tasks;
      this.tasksFormArray.clear();
      tasks.forEach((task) => {
        const group = this.createTaskGroup(task);
        this.tasksFormArray.push(group);
      });
    });
  }

  ngOnDestroy(): void {
    this.tasksSubscription?.unsubscribe();
  }

  get tasksFormArray(): FormArray {
    return this.myForm.get('tasks') as FormArray;
  }

  createForm(): FormGroup {
    return this.fb.group({
      tasks: this.fb.array([]),
    });
  }

  createTaskGroup(task?: Task) {
    task?.id;
    return this.fb.group({
      id: [task?.id || null],
      completed: [task?.completed],
      title: [task?.title],
      type: [task?.type],
      visualise: [task?.visualise],
      startDate: [task?.startDate],
      endDate: [task?.endDate],
    });
  }

  getControls() {
    return (this.myForm.get('tasks') as FormArray)?.controls as FormGroup[];
  }

  addNewRow() {
    const newTask = this.createTaskGroup();
    (this.myForm.get('tasks') as FormArray).insert(0, newTask);
  }

  trackByFuntion(index: number, task: FormGroup) {
    return task.get('id')?.value;
  }

  saveCopy(task: FormGroup) {
    this.savedCopy = { ...task.value };
  }

  updateTask(value: string, control: AbstractControl | null, task: FormGroup) {
    control?.setValue(typeof value === 'string' ? value?.trim() : value);
    if (JSON.stringify(task.value) === JSON.stringify(this.savedCopy)) {
      return;
    }
    const updatedTask = task.getRawValue();
    console.log('updatedTask', updatedTask);
    const id = task.get('id')?.value;
    if (id) {
      this.store.dispatch(new UpdateTask(updatedTask));
      // this.tasksService.updateTask(id, updatedTask).subscribe(() => {
      //   console.log('updated');
      // });
    } else {
      this.store.dispatch(new AddTask(updatedTask));

      // this.tasksService.addNewTask(updatedTask).subscribe((newId: string) => {
      //   console.log('new task added', this.myForm.get('tasks') as FormArray);
      //   (this.myForm.get('tasks') as FormArray)
      //     ?.at(0)
      //     .patchValue({ id: newId });
      // });
    }
  }

  onSearch(value: string) {
    const filtered = this.filteredTasks
      .filter((task) => {
        return (
          task.title?.toLowerCase().includes(value?.toLowerCase()) ||
          task.type?.toLowerCase().includes(value?.toLowerCase()) ||
          task.visualise?.toLowerCase().includes(value?.toLowerCase()) ||
          task.startDate?.toLowerCase().includes(value?.toLowerCase()) ||
          task.endDate?.toLowerCase().includes(value.toLowerCase())
        );
      })
      .sort((a: any, b: any) => a.completed - b.completed);
    this.tasksFormArray.clear();
    filtered.forEach((task) => {
      const group = this.createTaskGroup(task);
      this.tasksFormArray.push(group);
    });
  }

  sortDate() {}
}
