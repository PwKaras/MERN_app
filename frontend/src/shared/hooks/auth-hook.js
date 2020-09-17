import { useCallback, useState, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpDate, setTokenExpDate] = useState();
    const [userId, setUserId] = useState(false);

    // token
    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);

        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem('userData');
        setTokenExpDate(null);
        setUserId(null);
    }, []);

    useEffect(() => {
        if (token && tokenExpDate) {
            const remainingTime = tokenExpDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpDate])


    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                new Date(storedData.expiration));
        }
    }, [login]);

    return {token, login, logout, userId};

};

