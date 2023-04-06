import {ToDoList} from "../typings/ToDoList";
import {CommonStoreState} from "../typings/CommonStoreState";
import {ToDoListDefinition, ToDoListDefinitionStrict} from "../typings/ToDoListDefinition";
import {ToDoItem} from "../typings/ToDoItem";
import {ToDoItemFilter} from "../typings/ToDoItemFilter";
import {ToDoItemDefinition} from "../typings/ToDoItemDefinition";

export interface ToDoListState extends CommonStoreState {
    toDoLists: ToDoList[]
    toDoListId: string|null
    activeFilter: ToDoItemFilter
    search: string|null
}

export type ToDoListGetters = {
    toDoList: (state: ToDoListState) => ToDoList|null
    toDoItemsFiltered: (state: toDoListState) => ToDoItem[]
    toDoItemsFilteredWithFullTextSearch: (state: toDoListState) => (search: string, withFilter?: boolean) => ToDoItem[]
    toDoItems: (state: toDoListState) => ToDoItem[]
}

export interface ToDoListActions {
    fetchLists: () => Promise<void>
    storeList: (toDoList: ToDoListDefinition) => Promise<string>
    selectList: (toDoListId: string) => () => void
    storeToDoItem: (toDoItem: ToDoItemDefinition) => Promise<void>
    removeToDoItem: (toDoItemId: string) => Promise<void>
    setToDoItemDone: (toDoItemId: string) => Promise<void>
    removeToDoList: (toDoListId: string) => Promise<void>
    useSearchProxy: (textToSearch: string) => void
    removeSearchProxy: () => void
}