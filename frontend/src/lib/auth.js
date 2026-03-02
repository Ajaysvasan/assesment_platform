import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem('token');

export const removeToken = () => localStorage.removeItem('token');

export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        // Ensure returning an object with at least role and id
        return decoded;
    } catch (e) {
        removeToken();
        return null;
    }
};

export const isAuthenticated = () => {
    return !!getUserFromToken();
};

export const hasRole = (role) => {
    const user = getUserFromToken();
    if (!user) return false;

    // Sometimes role is inside an array, sometimes just a string depending on backend
    if (Array.isArray(user.role) || Array.isArray(user.roles)) {
        const roles = user.role || user.roles;
        return roles.includes(role);
    }

    // In case the claim is a URL or named differently, check standard convention:
    const userRole = user.role || user.roles || user.authorities;
    return userRole === role;
};
