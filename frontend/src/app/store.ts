import {
    configureStore,
    isRejectedWithValue
} from "@reduxjs/toolkit";

import { api } from "./api";

import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";

export const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (isRejectedWithValue(action)) {
            console.warn("We got a rejected action!");
            if (action.payload.status === 401
                || action.payload.status === 404
                || action.payload.status === 403
                || action.payload.status === 500
                || action.payload.status === "FETCH_ERROR") {
                window.location.href = "/error";
            }
        }

        return next(action);
    };

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(api.middleware)
            .concat(rtkQueryErrorLogger),
});
