import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    //useRef here store data acros rerender cycle
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);

        //AbortController - functionality build in modern browsers
        const httpAbortCtrll = new AbortController();
        //useRef store data in object witch has current property, 
        //stored AbortController in useRef
        activeHttpRequests.current.push(httpAbortCtrll);

        try {
            fetch(url, {
                method,
                body,
                headers,
                //below link httpAbortCtrll to fetch request
                signal: httpAbortCtrll.signal
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message);
            };
            return responseData;

        } catch (error) {
            setError(error.message || 'Something went wrong, please try again.');
        }
        setIsLoading(false);
    }, []);
    const clearError = () => {
        setError(null);
    };
    useEffect(()=> {
        return () => {
            activeHttpRequests.current.forEach(abortCtrll => abortCtrll.abort())
        };
    }, [])
    return { isLoading, error, sendRequest, clearError };
};