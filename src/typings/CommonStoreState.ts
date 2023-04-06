import {AxiosInstance} from "axios";

/**
 * Implements TS support for using Axios instance injected into Pinia as a plugin on boot from the main.ts
 * Usage inside a store object: `this.$axios!.xyz`
 */
export interface CommonStoreState {
    $axios?: AxiosInstance
}