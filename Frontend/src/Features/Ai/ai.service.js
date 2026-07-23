import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ai';
const FILES_URL = 'http://localhost:3000/api/files';

export const generateAiResponse = async (prompt) => {
    try {
        const response = await axios.post(`${API_URL}/generate-response`, { prompt });
        return response.data;
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw error;
    }
};

export const executeAiCommand = async (command) => {
    try {
        const response = await axios.post(`${API_URL}/execute`, { command });
        return response.data;
    } catch (error) {
        console.error("Error executing AI command:", error);
        throw error;
    }
};

export const searchFiles = async (query, drive) => {
    try {
        const response = await axios.post(`${FILES_URL}/search`, { query, drive });
        return response.data;
    } catch (error) {
        console.error("Error searching files:", error);
        throw error;
    }
};
