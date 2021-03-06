import axios, {AxiosResponse} from "axios";


const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1/auth/',
    headers: {
        "API-KEY": '7b609e77-8b87-49b1-abc2-87ddc192ab78'
    }
})

// API

export const authAPI = {
    login(data: LoginParamsType) {
        return axiosInstance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>('login', data)
    },
    me() {
        return axiosInstance.get<ResponseType<MeResponseType>>('me')
    },
    loginOut() {
        return axiosInstance.delete<ResponseType<{ userId?: number }>>('login')
    }
}

// Types

type MeResponseType = {
    id: number
    email: string
    login: string
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors: Array<string>
    data: D
}
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}