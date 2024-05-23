import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const login = async (username, password) => {
    return axios.post(`${BASE_URL}/login`, { username, password });
}

export const register = async (username, email, password) => {
    return axios.post(`${BASE_URL}/register`, {
        username,
        email,
        password,
    });
}
