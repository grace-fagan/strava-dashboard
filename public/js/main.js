//Based on user query, send HTTP GET request to retrieve activities from given timeline
function selectTimeline(time){
    
    let after = new Date();

    //convert time to epoch value
    switch(time){
        case "week":
            let monday = new Date();
            monday.setDate(monday.getDate() - monday.getDay() + 1)
            after = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate(), 0).getTime() / 1000;
            break;
        
        case "month":
            after = new Date(after.getFullYear(), after.getMonth(), 1, 0).getTime() / 1000;
            break;
        
        case "year":
            after = new Date(after.getFullYear(), 0, 1, 0).getTime() / 1000;
    }

    const host = window.location

    let request = new XMLHttpRequest();
    request.open("GET", host + "activities/after/" + after, true)

    //once the response from the server is received, grab the data and create the vis
    request.onload = function loadData() {
        let data = JSON.parse(this.response);
        createMap(data);
    }

    request.send();
}