import axios from 'axios';
import {
    getRequest,
    getResultSuccess,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './parentSlice';

export const getAllStudentsByParent = (parentId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Parent/Students/${parentId}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const updateParentFields = (id, fields) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/Parent/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getStudentProfile = (studentId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Parent/StudentProfile/${studentId}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getStudentMarks = (rollNum) => async (dispatch) => {
    console.log({rollNum});
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Parent/StudentMarks/${rollNum}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getResultSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const downloadStudentResult = (studentId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Parent/DownloadResult/${studentId}`, {
            responseType: 'blob',
        });
        
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `student_result_${studentId}.pdf`);
        document.body.appendChild(link);
        link.click();

        dispatch(stuffDone());
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getAllParents = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Parents`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            console.log(result.data);
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
};

export const someAction = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const response = await axios.post("http://localhost:5000/ParentReg");
        dispatch(getSuccess(response.data));
    } catch (error) {
        dispatch(getError(error.response?.data?.message || "An error occurred"));
    }
};