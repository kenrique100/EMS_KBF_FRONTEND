export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

export const clearAuthToken = () => {
    localStorage.removeItem('authToken');
};

export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export const setRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
};

export const clearRefreshToken = () => {
    localStorage.removeItem('refreshToken');
};