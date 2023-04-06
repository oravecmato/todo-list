import {Ref, ref} from "vue";
import {useRouter} from "vue-router";

const localStorageFakeAuthKey = 'fake-auth';

interface FakeAuthInterface {
    getFakeUserId: () => string
    signOutForever: () => void
    appKey: Ref<string>
}

const generateAppKey = (): string => new Date().getTime().toString()
const appKey = ref<string>(generateAppKey())

/**
 * This functionality has been proposed with the aim of imitating the authentication in order
 * not to share a user's to-do lists with anyone but rather to provide the ability to create
 * their own lists to any user. Take it as some kind of authentication mocking.
 *
 * This was not a part of the original assignment but made sense to me as the part of it was
 * to keep the data persisting and synced with the external database service.
 */
export const useFakeAuth = (): FakeAuthInterface => {
    return {
        getFakeUserId: (): string => {
            let userId = localStorage.getItem(localStorageFakeAuthKey)
            if (!userId) {
                userId = Date.now().toString()
                localStorage.setItem(localStorageFakeAuthKey, userId)
            }
            return userId
        },

        signOutForever: (): void => {
            localStorage.removeItem(localStorageFakeAuthKey)
            appKey.value = generateAppKey()
        },

        appKey
    }
}