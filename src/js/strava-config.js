import axios from "axios"

const clientID = process.env.VUE_APP_CLIENT_ID;
const clientSecret = process.env.VUE_APP_CLIENT_SECRET;

export const cleanUpAuthToken = (str) => {
    return str.split("&")[1].slice(5);
}

export const AuthGetter = async (authTok) => {
    try {
        const response = await axios.post(
            `https://www.strava.com/api/v3/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${authTok}&grant_type=authorization_code`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}; 

export const getUserData = async (userID, accessToken, page) => {
    try {
        const response = await axios.get(
            `https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${page}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const APISettings = {
    token: '',
    headers: new Headers({
        'Accept': 'application/json'
    }),
    baseURL: 'https://api.roastandbrew.coffee/api/v1',
}