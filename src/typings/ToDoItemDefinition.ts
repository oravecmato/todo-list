import {ToDoItem} from "./ToDoItem";

export type ToDoItemDefinition = Omit<ToDoItem, 'id'|'completed'>