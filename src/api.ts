import ApiClient from 'ggtu-timetable-api-client';
export const api = new ApiClient({baseURL: process.env.VUE_APP_GGTU_API_URL});
