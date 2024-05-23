// services/categoryService.js
import axios from 'axios';

export const fetchCategories = async () => {
    try {
        const response = await axios.get('http://localhost:8080/categories', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};
