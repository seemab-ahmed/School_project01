import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    parentStudentsList: [],
    studentMarks:[],
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
};

const parentSlice = createSlice({
    name: 'parent',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "completed";
        },
        getSuccess: (state, action) => {
            console.log(action);
            state.parentStudentsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getResultSuccess: (state, action) => {
            console.log(action);
            state.studentMarks = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetParentState: (state) => {
            state.loading = false;
            state.response = null;
            state.error = null;
            state.statestatus = "idle";
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    resetParentState,
    stuffDone,
    getResultSuccess
} = parentSlice.actions;

export const parentReducer = parentSlice.reducer;
