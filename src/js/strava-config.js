// import axios from "axios"

export const cleanUpAuthToken = (str) => {
    return str.split("&")[1].slice(5);
}

export const APISettings = {
    token: '',
    headers: new Headers({
        'Accept': 'application/json'
    }),
    baseURL: 'https://api.roastandbrew.coffee/api/v1',
}