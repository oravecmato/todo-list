export interface ToDoListDefinition {
    id?: string
    name: string
}

export type ToDoListDefinitionStrict = ToDoListDefinition & {
    id: string
}