import {ToDoList} from "./ToDoList";

export type ToDoListDefinition = Omit<ToDoList, 'items'|'id'>