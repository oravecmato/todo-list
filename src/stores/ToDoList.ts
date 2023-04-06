import {defineStore} from "pinia";
import type {ToDoListActions, ToDoListGetters, ToDoListState} from "./ToDoList.d"
import {
    API_ROOT_URL,
    API_TODO_LISTS_ENDPOINT,
    DATE_FORMAT,
    TDL_ITEM_FILTER_ACTIVE,
    TDL_ITEM_FILTER_ALL,
    TDL_ITEM_FILTER_COMPLETED
} from "../constants";
import {ToDoListDefinition} from "../typings/ToDoListDefinition";
import {ToDoItem} from "../typings/ToDoItem";
import {useMoment} from "../composables/useMoment";
import _some from "lodash/some"
import {
    FirestoreApiEmptyRunQueryListResponse,
    FirestoreApiGeneralDeleteResponse,
    FirestoreApiGeneralPostResponse,
    FirestoreApiListResponse,
    FirestoreApiRunQueryListResponse,
    FirestoreDataObject,
    FirestoreDocumentFieldsObject,
    isFirestoreApiGeneralPostResponse,
    isFirestoreApiListResponse,
    isFirestoreApiRunQueryListResponse
} from "../typings/FirestoreApiResponses";
import {ToDoItemDefinition} from "../typings/ToDoItemDefinition";
import {useFakeAuth} from "../composables/useFakeAuth";
import {ToDoList} from "../typings/ToDoList";

export const useToDoListStore = defineStore<'todo-list', ToDoListState, ToDoListGetters, ToDoListActions>('todo-list', {

    state: () => {
        return {
            toDoLists: [],
            toDoListId: null,
            activeFilter: TDL_ITEM_FILTER_ALL,
            search: null
        }
    },

    getters: {
        
        toDoList: (state: ToDoListState) => {
            return state.toDoListId && state.toDoLists.length ? (
                state.toDoLists.find(list => list.id === state.toDoListId) || null
            ) : null
        },

        toDoItemsFiltered() {

            if (!this.toDoList || !this.toDoList.items.length)
                return []

            const {isFuture, toUnix} = useMoment()
            const sortFunc = (a: ToDoItem, b: ToDoItem) => toUnix(a.deadline, DATE_FORMAT) - toUnix(b.deadline, DATE_FORMAT);

            switch (this.activeFilter) {
                case TDL_ITEM_FILTER_ACTIVE:
                    return this.toDoList.items.filter(({deadline, completed}) => !completed && isFuture(deadline, DATE_FORMAT)).sort(sortFunc)
                case TDL_ITEM_FILTER_COMPLETED:
                    return this.toDoList.items.filter(({completed}) => completed).sort(sortFunc)
                case TDL_ITEM_FILTER_ALL:
                default:
                    return this.toDoList.items.sort(sortFunc)
            }
        },

        toDoItemsFilteredWithFullTextSearch() {
            return (search: string, withFilter: boolean = true) => {
                const defaultCollection = withFilter ? this.toDoItemsFiltered : this.toDoList!.items || [];
                return defaultCollection.filter(item => _some(item, (prop: any) => (
                        typeof prop === 'string' && prop.toLowerCase().includes(search.toLowerCase())
                    ))
                )
            }
        },

        toDoItems() {
            return this.search ? this.toDoItemsFilteredWithFullTextSearch(this.search) : this.toDoItemsFiltered
        }

    },

    actions: {

        async fetchLists() {
            const {getFakeUserId} = useFakeAuth()

            try {
                // Retrieve all todo_list collections by user id
                const query = `${API_ROOT_URL}:runQuery`
                const {data} = await this.$axios!.post<FirestoreApiRunQueryListResponse|FirestoreApiEmptyRunQueryListResponse>(query, {
                    structuredQuery:
                        {
                            from: [
                                {
                                    collectionId: API_TODO_LISTS_ENDPOINT
                                }
                            ],
                            where: {
                                compositeFilter: {
                                    filters: [
                                        {
                                            fieldFilter: {
                                                field: {
                                                    fieldPath: 'user_id'
                                                },
                                                op: 'EQUAL',
                                                value: {
                                                    stringValue: getFakeUserId()
                                                }
                                            }
                                        }
                                    ], op: 'AND'
                                }
                            }
                        }
                })

                if (!isFirestoreApiRunQueryListResponse(data)) {
                    this.toDoLists = []
                    return Promise.resolve()
                }

                var promises: Promise<void>[] = []

                this.toDoLists = data.map(({document}) => {
                    const doc = parseFirestoreDataObject(document) as ToDoList // let's pretend it also has items field for a while
                    const id = getDocumentIdFromPath(document.name)

                    const subquery = `/${API_TODO_LISTS_ENDPOINT}/${id}/items`

                    promises.push(
                        this.$axios!.get<FirestoreApiListResponse|Object>(subquery)
                            .then(({data}) => {
                                if(isFirestoreApiListResponse(data)) {
                                    return data.documents.map(item => {
                                        const itemData: ToDoItem = {
                                            ...parseFirestoreDataObject(item) as Omit<ToDoItem, 'id'>,
                                            id: getDocumentIdFromPath(item.name)
                                        }
                                        return itemData
                                    })
                                }
                                return []
                            })
                            .then((items) => {
                                const listToComplete = this.toDoLists.find(list => list.id === id)
                                if (listToComplete)
                                    listToComplete.items = items
                            })
                    )

                    return {...doc, id}
                })

                await Promise.all(promises)

                return Promise.resolve()

            } catch(error: any) {
                console.error(error)
                this.toDoLists = [];
            }
        },

        async storeList(toDoList: ToDoListDefinition): Promise<string> {
            const {getFakeUserId} = useFakeAuth()

            try {
                const {data} = await this.$axios!.post<FirestoreApiGeneralPostResponse|Object>(API_TODO_LISTS_ENDPOINT,
                    buildFirestoreDataObject({
                        ...toDoList,
                        user_id: getFakeUserId()
                    })
                )

                if (isFirestoreApiGeneralPostResponse(data)) {
                    const id = getDocumentIdFromPath(data.name)
                    this.toDoLists.push({...toDoList, id, items: []})
                    return id

                } else {
                    return Promise.reject(data)
                }

            } catch(error: any) {
                console.error(error)
                return Promise.reject(error)
            }
        },

        selectList(toDoListId: string) {
            this.toDoListId = _some(this.toDoLists, {id: toDoListId}) ? toDoListId : null
            return () => this.toDoListId = null
        },

        async storeToDoItem(toDoItem: ToDoItemDefinition) {
            if (!this.toDoListId)
                return

            try {
                const query = `/${API_TODO_LISTS_ENDPOINT}/${this.toDoListId}/items`
                const {data} = await this.$axios!.post<FirestoreApiGeneralPostResponse|Object>(query,
                    buildFirestoreDataObject({
                        ...toDoItem,
                        completed: false
                    })
                )

                if (isFirestoreApiGeneralPostResponse(data)) {
                    this.toDoLists.find(({id}) => id === this.toDoListId)?.items.push({...toDoItem, completed: false, id: getDocumentIdFromPath(data.name)})
                } else {
                    console.log('Not a proper format', data)
                }

            } catch(error: any) {
                console.error('error', error)
            }
        },

        async removeToDoItem(toDoItemId: string) {
            try {
                const query = `/${API_TODO_LISTS_ENDPOINT}/${this.toDoListId}/items/${toDoItemId}`
                const response = await this.$axios!.delete<FirestoreApiGeneralDeleteResponse>(query)

                if (response.status === 200) {
                    let listToUpdate = this.toDoLists.find(({id}) => id === this.toDoListId)
                    if (listToUpdate)
                        listToUpdate.items = listToUpdate.items.filter(item => item.id !== toDoItemId);

                } else {
                    console.log(response)
                }

            } catch(error: any) {
                console.error(error)
            }
        },


        async setToDoItemDone(toDoItemId: string) {
            try {
                const query = `/${API_TODO_LISTS_ENDPOINT}/${this.toDoListId}/items/${toDoItemId}`
                const response = await this.$axios!.patch<any>(query, buildFirestoreDataObject({
                    completed: true
                }), {
                    params: {
                        "updateMask.fieldPaths": "completed"
                    }
                })

                if (response.status === 200) {
                    let item = this.toDoLists
                        .find(({id}) => id === this.toDoListId)?.items
                        .find(item => item.id === toDoItemId);
                    if (item)
                        item.completed = true
                }

            } catch(error: any) {
                console.error(error)
            }
        },


        async removeToDoList(toDoListId: string) {
            try {
                const query = `${API_TODO_LISTS_ENDPOINT}/${toDoListId}`
                const response = await this.$axios!.delete<FirestoreApiGeneralDeleteResponse>(query)

                if (response.status !== 200) {
                    console.log(response)
                    return
                }

                this.toDoLists = this.toDoLists.filter(list => list.id !== toDoListId)

                if (this.toDoListId && this.toDoListId === toDoListId)
                    this.toDoListId = null

            } catch(error: any) {
                console.error(error)
            }
        },

        useSearchProxy(textToSearch: string){
            const search = textToSearch.trim()
            this.search = search || null
        },

        removeSearchProxy() {
            this.search = null
        }


    }
})



const buildFirestoreDataObject = (data: Object): FirestoreDataObject => {
    const queryTypeHelper = (value: any): Record<string, string | boolean | number> => {
        switch (typeof value) {
            case "string":
                return { "stringValue": value }
            case "boolean":
                return { "booleanValue": value }
            case "number":
                return { "integerValue": value }
            default:
                return {}
        }
    }

    return {
        fields: Object.entries(data).reduce((acc: FirestoreDocumentFieldsObject, [key, value]) => {
            acc[key] = queryTypeHelper(value)
            return acc
        }, {})
    }
}

const parseFirestoreDataObject = (data: FirestoreDataObject): Object => {
    const result: any = {};
    for (const [key, value] of Object.entries(data.fields)) {
        result[key] = Object.values(value)[0];
    }
    return result;
}

const getDocumentIdFromPath = (path: string): string => {
    const parts = path.split('/');
    return parts[parts.length - 1];
}

