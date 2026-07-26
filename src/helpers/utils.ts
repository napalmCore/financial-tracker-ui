export const getApiUrl = (version : string | null) => {
    var apiVersion = version ?? import.meta.env.VITE_API_VERSION;
    return import.meta.env.VITE_API_BASE_URL + apiVersion
}