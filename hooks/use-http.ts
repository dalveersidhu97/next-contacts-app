import { useCallback, useState } from "react";

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const sendRequest = useCallback(async (url: string, requestOptions: RequestInit) => {
        setIsLoading(true);
        setError(undefined);
        try {
            const response = await fetch(url, requestOptions);
            const data = await response.json();
            setIsLoading(false);
            return data;
        }catch(e:any) {
            console.log(e);
            setError(e.message);
        }
        setIsLoading(false);
    }, [])

    return {sendRequest, isLoading, error}

}

export default useHttp;