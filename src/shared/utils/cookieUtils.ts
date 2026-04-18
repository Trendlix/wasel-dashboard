import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const setCookie = (name: string, value: string) => {
    Cookies.set(name, value);
};

export const getCookie = (name: string) => {
    return Cookies.get(name);
};

export const removeCookie = (name: string) => {
    Cookies.remove(name);
};

export const isCookieExist = (name: string) => {
    return Cookies.get(name) !== undefined;
};

export const getTokenStoredInCookie = (name: string) => {
    const token = Cookies.get(name);
    if (!token) return { isValid: false };
    try {
        const decodedToken: any = jwtDecode(token);
        const isTokenValid = decodedToken instanceof Object && "exp" in decodedToken && typeof decodedToken.exp === "number" && decodedToken.exp > Date.now() / 1000;
        return { ...decodedToken, isValid: isTokenValid };
    } catch {
        return { isValid: false };
    }
};
