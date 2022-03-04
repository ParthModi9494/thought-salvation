import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, map, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  localTasks: Task[] = [];
  constructor(private afStore: AngularFirestore) {}

  getAllTasks(): Observable<Task[]> {
    console.log('Fetching all Tasks...');
    return from(this.afStore.collection<Task>('/tasks').get()).pipe(
      map((tasks) => {
        return tasks.docs.map((task) => {
          return { ...task.data(), id: task.id };
        });
      })
    );
  }

  addNewTask(task: Task) {
    console.log('Adding new Task...', task);
    return from(this.afStore.collection<Task>('/tasks').add(task)).pipe(
      map((docRef) => {
        const id = docRef.id;
        return id;
      })
    );
  }

  updateTask(id: string, task: Task) {
    console.log('Updating a Task...', task);
    return from(this.afStore.collection<Task>('/tasks').doc(id).set(task));
  }
}
