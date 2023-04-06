export type FirestoreDocumentFieldsObject = Record<string, Record<string, string | boolean | number>>
export type FirestoreDataObject = {fields: FirestoreDocumentFieldsObject}

export interface FirestoreApiGeneralPostResponse {
    name: string
    fields: Record<string, Record<string,any>>
    createTime: string
    updateTime: string
}

export interface FirestoreApiGeneralDeleteResponse {
    name: string
    updateTime: string
}

export function isFirestoreApiGeneralPostResponse(value: any): value is FirestoreApiGeneralPostResponse {
    return 'name' in value && 'fields' in value && 'createTime' in value
}


export function isFirestoreApiGeneralDeleteResponse(value: any): value is FirestoreApiGeneralDeleteResponse {
    return 'name' in value && 'updateTime' in value
}
export interface FirestoreDocumentObject {
    fields: FirestoreDocumentFieldsObject
    name: string
    createTime: string
    updateTime: string
}

export interface FirestoreApiGetResponse {
    document: FirestoreDocumentObject
    readTime: string
}

export type FirestoreApiRunQueryGetResponse = FirestoreApiGetResponse

export interface FirestoreApiListResponse {
    documents: FirestoreDocumentObject[]
}

export function isFirestoreApiListResponse(value: any): value is FirestoreApiListResponse {
    return "documents" in value && Array.isArray(value.documents) && value.documents.length
}

export type FirestoreApiRunQueryListResponse = FirestoreApiRunQueryGetResponse[]

export type FirestoreApiEmptyRunQueryGetResponse = Omit<FirestoreApiRunQueryGetResponse, 'document'>
export type FirestoreApiEmptyRunQueryListResponse = [FirestoreApiEmptyRunQueryGetResponse]

export function isFirestoreApiRunQueryListResponse(value: any): value is FirestoreApiRunQueryListResponse {
    return Array.isArray(value) && "document" in value[0] && "readTime" in value[0] && "fields" in value[0].document
}