import {Dispatch} from "redux";
import {authAPI} from "../api/auth-api";
import {setIsLoggedInAC} from "../Features/Login/auth-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
}

export const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStateAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: NullableType<string> }>) {
            state.error = action.payload.error
        },
        setAppInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isInitialized = action.payload.value
        },
    }
})

export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStateAC, setAppInitializedAC} = slice.actions


// Thunk

export const initializedAppTC = () => (dispatch: Dispatch<any>) => {
    authAPI.me()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedIn: true}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(dispatch, err.message)
        })
        .finally(() => dispatch(setAppInitializedAC({value: true})))
}

// Types
// type ActionsType = SetStatusAT | SetErrorAT | ReturnType<typeof setAppInitializedAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
// export type SetStatusAT = ReturnType<typeof setAppStateAC>
// export type SetErrorAT = ReturnType<typeof setAppErrorAC>
export type NullableType<T> = null | T
// type InitialStateType = typeof initialState

//With classic Redux
// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case "APP/SET_IS_INITIALIZED":
//             return {...state, isInitialized: action.value}
//         default:
//             return state
//     }
// }

//Action

// export const setAppStateAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setAppErrorAC = (error: NullableType<string>) => ({type: 'APP/SET-ERROR', error} as const)
// export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET_IS_INITIALIZED', value} as const)
