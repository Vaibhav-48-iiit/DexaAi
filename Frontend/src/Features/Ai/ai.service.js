import axios from 'axios';

const aiApi = axios.create({
    baseURL: 'http://localhost:3000/api/ai',
    withCredentials: true
});

const filesApi = axios.create({
    baseURL: 'http://localhost:3000/api/files',
    withCredentials: true
});

export const generateAiResponse = async (prompt) => {
    try {
        const response = await aiApi.post('/generate-response', { prompt });
        return response.data;
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw error;
    }
};

export const executeAiCommand = async (command) => {
    try {
        const response = await aiApi.post('/execute', { command });
        return response.data;
    } catch (error) {
        console.error("Error executing AI command:", error);
        throw error;
    }
};

export const searchFiles = async (query, drive) => {
    try {
        const response = await filesApi.post('/search', { query, drive });
        return response.data;
    } catch (error) {
        console.error("Error searching files:", error);
        throw error;
    }
};
export const generateSpeech = async (text) => {
    try {
        const response = await aiApi.post('/tts', { text }, {
            responseType: 'blob'  // IMPORTANT: tells axios to return binary audio data
        });
        return response.data;  // This is a Blob containing WAV audio
    } catch (error) {
        console.error("Error generating speech:", error);
        throw error;
    }
};

