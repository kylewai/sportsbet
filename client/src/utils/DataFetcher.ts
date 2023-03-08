export const apiFetcher = (url: string) => (fetch(url).then((res) => res.json()));

export const makePostReq = (endpointURL: string, body: {}, headers?: HeadersInit) => {
    return fetch(endpointURL,
        {
            method: "POST",
            body: JSON.stringify(body),
            headers: headers ?? {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => manageErrors(response));
}

export const manageErrors = async (response: Response): Promise<Response> => {
    if (response.ok) {
        return response;
    }
    throw new Error(await response.text());
}