import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import memberSlice from "./member/memberSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        member: memberSlice,
    },
});

export default store;
