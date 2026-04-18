import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";


const useJsCookie = () => {
    const setCookie = (name: string, value: string, expires: number, path: string) => {
        Cookies.set(name, value, { expires, path });
    }

    const getCookie = (name: string) => {
        return Cookies.get(name);
    }

    const removeCookie = (name: string) => {
        Cookies.remove(name);
    }

    const isCookieExist = (name: string) => {
        return Cookies.get(name) !== undefined;
    }

    const getTokenStoredInCookie = (name: string) => {
        const token = Cookies.get(name);
        if (!token) return { isValid: false };
        try {
            const decodedToken: any = jwtDecode(token);
            const isTokenValid = decodedToken instanceof Object && "exp" in decodedToken && typeof decodedToken.exp === "number" && decodedToken.exp > Date.now() / 1000;
            return { ...decodedToken, isValid: isTokenValid };
        } catch {
            return { isValid: false };
        }
    }


    return { setCookie, getCookie, removeCookie, isCookieExist, getTokenStoredInCookie };
}

export default useJsCookie;