// Define the types for quiz data
export type Option = {
    answer: string;
};

export type Question = {
    question: string;
    options: Option[];
    answer: string[]; // Array of correct answers
};

export type Category = {
    _id: string;
    category: string;
    info: string;
    questions: Question[];
};

export interface Quiz {
    _id: string;
    topic: string;
    info: string;
    logo: string;
    categories: Category[];
}

export interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    privacy: boolean;
}

export interface Testimonial {
    _id: string;
    userId: User; // Nested user object
    rating: number;
    status: boolean;
    text: string;
    createdAt: string;
}
