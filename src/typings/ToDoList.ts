import {ToDoItem} from "./ToDoItem";

export interface ToDoList {
    id: string
    name: string
    items: ToDoItem[]
}