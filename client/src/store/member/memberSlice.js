import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    members: [],
};

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
        setMembers: (state, action) => {
            state.members = action.payload;
        },
    },
});

export const { setMembers } = memberSlice.actions;

export default memberSlice.reducer;
