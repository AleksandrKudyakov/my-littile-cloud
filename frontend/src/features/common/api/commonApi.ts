import { api } from "../../../app/api";
import {
    ICloudUserInfo,
    ICloudUserLoginData,
    ICloudUserRegistrationInfo
} from "../models";
import { routes } from "./routes";

const commonApi = api.injectEndpoints({
    endpoints: build =>({
        registerUser: build.mutation<number, ICloudUserRegistrationInfo>({
            query: (request) => ({
                url: `${routes.userRegister}`,
                method: "POST",
                body: request
            })
        }),
        loginUser: build.mutation<number, ICloudUserLoginData>({
            query: (request) => ({
                url: `${routes.userLogin}`,
                method: "POST",
                body: request
            })
        }),
        logoutUser: build.mutation<void, void>({
            query: () => ({
                url: `${routes.userLogout}`,
                method: "POST"
            })
        }),
        getUserInfo: build.query<ICloudUserInfo, void>({
            query: () => ({
                url: `${routes.userInfo}`
            })
        })
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useGetUserInfoQuery
} = commonApi;