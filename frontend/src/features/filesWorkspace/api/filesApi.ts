import {
    api,
    TagTypes
} from "../../../app/api";
import { IFileDeleteRequest } from "../models/IFileDeleteRequest";
import { IFileEditInfo } from "../models/IFileEditInfo";
import { IFileInfo } from "../models/IFileInfo";
import { routes } from "./routes";

const filesApi = api.injectEndpoints({
    endpoints: build =>({
        getFilesForUser: build.query<IFileInfo[], string>({
            query: (id: string) => ({
                url: `${routes.fileGetForUser}/${id}`
            }),
            providesTags: [TagTypes.GetUserFiles]
        }),
        uploadFile: build.mutation<void, FormData>({
            query: (request) => ({
                url: `${routes.fileUpload}`,
                method: "POST",
                body: request
            }),
            invalidatesTags: [TagTypes.GetUserFiles]
        }),
        deleteFile: build.mutation<void, IFileDeleteRequest>({
            query: (request) => ({
                url: `${routes.fileDelete}`,
                method: "POST",
                body: request
            }),
            invalidatesTags: [TagTypes.GetUserFiles]
        }),
        editFileInfo: build.mutation<void, IFileEditInfo>({
            query: (request) => ({
                url: `${routes.fileEdit}`,
                method: "POST",
                body: request
            }),
            invalidatesTags: [TagTypes.GetUserFiles]
        })
    })
})

export const {
    useGetFilesForUserQuery,
    useUploadFileMutation,
    useDeleteFileMutation,
    useEditFileInfoMutation,
} = filesApi;