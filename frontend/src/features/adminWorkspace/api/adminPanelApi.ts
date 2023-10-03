import {
    api,
    TagTypes
} from "../../../app/api";
import { ICloudUser } from "../../common/models";
import {
    ICloudUserChangeIsAdminRequest,
    ICloudUserDeleteRequest
} from "../models";
import { routes } from "./routes";

const adminPanelApi = api.injectEndpoints({
    endpoints: build =>({
        getUsersList: build.query<ICloudUser[], void>({
            query: () => ({
                url: `${routes.userGetList}`
            }),
            providesTags: [TagTypes.GetUsers]
        }),
        deleteUser: build.mutation<void, ICloudUserDeleteRequest>({
            query: (request) => ({
                url: `${routes.userDelete}`,
                method: "POST",
                body: request
            }),
            invalidatesTags: [TagTypes.GetUsers]
        }),
        changeIsAdmim: build.mutation<void, ICloudUserChangeIsAdminRequest>({
            query: (request) => ({
                url: `${routes.userChangeIsAdmin}`,
                method: "POST",
                body: request
            }),
            invalidatesTags: [TagTypes.GetUsers]
        }),
    })
})

export const {
    useGetUsersListQuery,
    useDeleteUserMutation,
    useChangeIsAdmimMutation,
} = adminPanelApi;