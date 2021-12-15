function createMap(data) {

    var map = L.map('route_map').setView([42.413306, -71.126423], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZ3JhY2VmYWdhbiIsImEiOiJja3gyNmFlY3gwZzFtMnBtdWtzcDYxbmk5In0.XGxf9wDcKw_kxESf6FgaOQ'
    }).addTo(map);

    let final_route;
    var route_arr = [];

    for (i in data) {
        final_route = add_route(data[i], i);
    }

    //Center map around most recent route
    map.fitBounds(final_route.getBounds());

    //Add route interaction properties
    setRouteStyles(route_arr);

    //FUNCTION:
    //params – JSON item
    //adds item's polyline to the map, populates route array, and then returns the route
    function add_route(item, index){
        if (!item.map.summary_polyline) return;
        let decoded = polyline.decode(item.map.summary_polyline)
        let route = L.polyline(decoded, {color: 'purple', opacity: '.5', weight: '3'}).addTo(map);
        console.log("route: ", route);

        route_arr[index] = route;
        return route;
    }

    function setRouteStyles(route_arr){
        route_arr.forEach((r) => {
            r.on('mouseover', function(){
                route_arr.forEach((e) => {
                    if (e != r) e.setStyle({opacity: '.1'})
                    else e.setStyle({opacity:'1'})
                })
            })

            // r.on('click', function(){
            //     console.log("clicked route: ", r);
            //     route_arr.forEach((e) => {
            //         if (e != r) e.setStyle({opacity: '.1'})
            //         else e.setStyle({opacity:'1'})
            //     })
            // })

            r.on('mouseout', function(){
                route_arr.forEach((e) => {
                    e.setStyle({opacity:'.5'})
                })
            })
        })
        console.log(route_arr);
    }

        // //Route mouse interactions
        // route.on('mouseover', function(){
        //     this.setStyle({opacity: '1'});
        //     route_arr.forEach((e) => {
        //         console.log("elem: ", e)
        //         if (e != this) e.setStyle({opacity: '.2'});
        //     });
        // })

        // route.on('mouseout', function(){
        //     this.setStyle({opacity: '.5'})
        // })
        // // route.on('click', function(){
        // //     this.setStyle({color: 'red'})
        // // });
}