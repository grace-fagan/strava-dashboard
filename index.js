
//creating the server, requiring express as a dependency
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000

const auth_link = "https://www.strava.com/oauth/authorize"
const athlete_link = "https://www.strava.com/api/v3/athlete/activities?per_page=200"

//serve static assets (files, images, JS files, etc) in a directory called public
app.use(express.static("public"))

//API call that sends an HTTP GET request
app.get('/activities/after/:after', (req, res) => {
    //using axios to send an XMLHttpRequest with an authorization header
    axios.get(athlete_link + "&after=" + req.params["after"], {headers: {"Authorization": "Bearer 31ba4aa81ea4dafd482617069405c99c24afa752"}})
        //once the Promise has been fulfilled, send the axios HTTP response to the response object within the express HTTP request
        .then(response => {
            console.log(response.data)
            res.send(response.data)});
})

//TESTER function to get a single activity's polyline
app.get('/activity', (req, res) => {
    axios.get("https://www.strava.com/api/v3/activities/6296969350?include_all_efforts=false", {headers: {"Authorization": "Bearer 7872a22e1f5a45764ddc1fe434b8e004ac4e43ca"}})
        .then(response => {res.send(response.data.map.polyline)});
})

//extremely basic GET request
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })


// app.get('/', (req, res) => { 
//     // STEP 1: inital GET request when user enters the app to authorize data access, response includes authorization code
//         axios.get(auth_link, {
//             params: {
//                 client_id: 52977,
//                 response_type: 'code',
//                 redirect_uri: 'http://localhost/exchange_token',
//                 approval_prompt: 'force',
//                 scope: 'read,profile:read_all,activity:read_all',
//             }
//         }).then(response => {res.send(response.data)})
    
//     //STEP 2: POST request that uses code generated in step 1 to retrieve access token
//         axios.post("https://www.strava.com/oauth/token",
//             {"client_id": 52977,
//             "client_secret": "99de5809cae141e4647980f7ba616f86fda13413",
//             "refresh_token": "00185af96d642a6156cb818064eb5e0f2fe553c8",
//             "code": "2d33d4e55d1ef0752bd22bd4098d7cf30d4059f1",
//             "grant-type": "authorization_code",
//         })
//         .then(response => console.log(response.data.access_token))
// })

//LISTEN ON A PORT
app.listen(port, () => {
    console.log(`Ready to run at ${port}`)
})