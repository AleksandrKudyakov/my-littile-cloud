import {
    createApi,
    fetchBaseQuery
} from "@reduxjs/toolkit/query/react";

export enum TagTypes {
    GetUsers = "GetUsers",
    GetUserFiles = "GetUserFiles"
}

const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
    {
        return parts?.pop()?.split(';').shift();
    }
}

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery(
        { 
            baseUrl: process.env.REACT_APP_API_URL,
            prepareHeaders:(headers) => {
                const csrftoken = getCookie("csrftoken");
                headers.set("X-CSRFToken", csrftoken || "");
            },
        }),
    tagTypes: [ TagTypes.GetUsers, TagTypes.GetUserFiles ],
    endpoints: () => ({})
});
