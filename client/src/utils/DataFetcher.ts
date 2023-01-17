export const apiFetcher = (url: string) => (fetch(url).then((res) => res.json()));


export const manageErrors = async (response: Response): Promise<Response> => {
    if (response.ok) {
        return response;
    }
    throw new Error(await response.text());
}