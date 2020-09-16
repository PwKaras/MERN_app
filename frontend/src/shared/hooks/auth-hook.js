import { useCallback, useState, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState();
    const [tokenExpDate, setTokenExpDate] = useState();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState();

    // token
    const login = useCallback((uid, token, expiration) => {
        setToken(token);
        setUserId(uid);
        // new Date() object- bulid in browser; new Date()-current date - now; getTime() miliseconds that past from the begining of time + one hour - current time + one houer - moment when expiration will finisch

        // if expiration has ben creaced - take it, other case - new login - new 1 hour time starts
        const tokenExpirationDate = expiration || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpDate(tokenExpirationDate);
        // localStorage is avalaible globaly, userData -check-auth token is sorage in req.userData;
        // in localStorage only store  text or data that couldbe convertet do text - to convert object {} to text JSON.stringify - because json is always text
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                // toISOString - no date lost when date is strin - ISOString - sore imported data and can be converted to data late
                expiration: tokenExpirationDate.toISOString()
            })
        );
        // setIsLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem('userData');
        // setIsLoggedIn(false);
        setTokenExpDate(null);
        setUserId(null);
    }, []);

    // when token changes ,[token] - work with timmer
    useEffect(() => {
        if (token && tokenExpDate) {
            // tokenExpDate i.e 17:20, .getTime() is time in millisecond from THE begining(1970) to 17:20
            // newDate().getTime() - time in milisecond from THE begining to now (i.e 16:50)
            const remainingTime = tokenExpDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpDate])


    // useEffect run after the all code, so first app render in no loged state, after run useEffect once ([]) and check if login
    // thanks to useCallback in login it only runs ones
    useEffect(() => {
        // JSON.parse() convert json (text) to regular js object - opposite method is JSON.stringify()
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData &&
            storedData.token &&
            // check if  exact time when expiration finish (left part) is grater than current date (right part)
            // new Date (stroedData.expiration) - take ISOString and convert to date object
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.uid,
                storedData.token,
                new Date(storedData.expiration));
        }
    }, [login]);

    return [token, login, logout, userId];

};

