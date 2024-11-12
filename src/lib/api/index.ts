import axios from "../config/axios";

export const loginUser = async (data: { email: string; password: string }) => {
    try {
        const response = await axios.post("/user/login", data);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const registerUser = async (data: FormData) => {
    try {
        const response = await axios.post("/user/add", data);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const userDetails = async () => {
    try {
        const response = await axios.get("/user/me");
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const uploadAvatarForUser = async (data: any) => {
    try {
        const response = await axios.post("/user/upload", data);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateUser = async (data: any) => {
    try {
        const response = await axios.post("/user/update", data);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateUserPassword = async (data: any) => {
    try {
        const response = await axios.post("/user/update-password", data);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getAllQuizzes = async () => {
    try {
        const response = await axios.get("/quiz/all-quiz");
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getQuizByTopic = async (topic: any) => {
    try {
        const response = await axios.get(`/quiz/topic/${topic}`);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const storeQuizRecord = async (record: any) => {
    try {
        const response = await axios.post("/quiz-record/add", record);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getUserAnalytics = async () => {
    try {
        const response = await axios.get(`/quiz-record/analytics`);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
