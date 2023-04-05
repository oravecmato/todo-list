import axios, {AxiosInstance} from 'axios'
import {API_ROOT_URL} from "@/constants"
import type {CreateAxiosDefaults} from "axios";

const options: CreateAxiosDefaults = {
    baseURL: API_ROOT_URL
}

const $axios: AxiosInstance = axios.create(options)

export default $axios