var map;
var route_arr = [];

function createMap(data) {

    if (map != undefined) map.remove();
    map = L.map('route-map').setView([42.413306, -71.126423], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZ3JhY2VmYWdhbiIsImEiOiJja3gyNmFlY3gwZzFtMnBtdWtzcDYxbmk5In0.XGxf9wDcKw_kxESf6FgaOQ'
    }).addTo(map);

    let final_route;

    for (i in data) {
        console.log("route to add: ", data[i])
        final_route = add_route(data[i], i);
    }

    //Center map around most recent route
    map.fitBounds(final_route.getBounds());

    //Add route interaction properties
    setRouteStyles();
}

//FUNCTION:
//params – JSON item
//add run polyline to the map, populate route array, and then returns the route
function add_route(run, index){
    if (!run.map.summary_polyline) return;
    let decoded = polyline.decode(run.map.summary_polyline)
    let route = L.polyline(decoded, {name: run.name, color: 'purple', opacity: '.3', weight: '3'}).addTo(map);
    console.log("route: ", route);

    route_arr[index] = route;
    return route;
}

function setRouteStyles(){
    route_arr.forEach((r) => {
        r.on('mouseover', function(){
            route_arr.forEach((e) => {
                if (e != r) e.setStyle({opacity: '.1'})
                else e.setStyle({opacity:'1', color: 'red'})
            })
        })

        r.on('mouseout', function(){
            route_arr.forEach((e) => {
                e.setStyle({opacity:'.3', color: 'purple'})
            })
        })
    })
}