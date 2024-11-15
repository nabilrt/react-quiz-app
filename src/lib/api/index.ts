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

export const getLeaderboardData = async (
    topic_category: string | undefined
) => {
    try {
        const response = await axios.get(
            `/quiz-record/leaderboard/${topic_category}`
        );
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const addIssue = async (data: any) => {
    try {
        const response = await axios.post("/issue/add", data);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const showIssuesByUser = async (user_id: string | undefined) => {
    try {
        const response = await axios.get(`/issue/user/${user_id}`);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const showUserTestimonial = async (user_id: string | undefined) => {
    try {
        const response = await axios.get(`/testimonial/user/${user_id}`);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const createOrUpdateTestimonialByUserId = async (
    user_id: string | undefined,
    data: any
) => {
    try {
        const response = await axios.post(
            `/testimonial/upsert/${user_id}`,
            data
        );
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getAllMessages = async () => {
    try {
        const response = await axios.get(`/chat/all`);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const sendMessage = async (data: any) => {
    try {
        const response = await axios.post(`/chat/send`, data);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getUserAnalyticsCommunity = async (id: string | undefined) => {
    try {
        const response = await axios.get(`/quiz-record/analytics/${id}`);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateUserPrivacyStatus = async () => {
    try {
        const response = await axios.post(`/user/update-privacy`);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getActiveTestimonials = async () => {
    try {
        const response = await axios.get(`/testimonial/active`);
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
