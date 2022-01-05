//All timeframe-related helper functions

function getAfterValue(date, timeframe) {
    console.log("entering after value function with date: ", date)
    console.log("entering after value function with time: ", timeframe)

    switch(timeframe){
        case "week":
            //get value of most recent Sunday
            date.setDate(date.getDate() - (date.getDay() + 6) % 7)
            afterValue = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0).getTime() / 1000;
            console.log(afterValue)
            return afterValue;
            break;
        case "month":
            afterValue = new Date(date.getFullYear(), date.getMonth(), 1, 0).getTime() / 1000;
            console.log(afterValue)
            return afterValue;
            break;
        case "year":
            afterValue = new Date(date.getFullYear(), 0, 1, 0).getTime() / 1000;
            console.log(afterValue)
            return afterValue;
    }
}

function getBeforeValue(date, timeframe) {
    switch(timeframe){
        case "week":
            //get value of upcoming Monday
            date.setDate(date.getDate() + ((7 - date.getDay()) % 7 + 1) % 7);
            beforeValue = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0).getTime() / 1000;
            console.log(beforeValue)
            return beforeValue;
            break;
        case "month":
            beforeValue = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0).getTime() / 1000;
            console.log(beforeValue)
            return beforeValue;
            break;
        case "year":
            beforeValue = new Date(date.getFullYear() + 1, 0, 1, 0).getTime() / 1000;
            console.log(beforeValue)
            return beforeValue;
    }
}

//code taken and edited from: https://arumind.com/how-to-generate-an-array-of-weeks-between-two-dates-in-javascript/
function getWeekBins(startDate, endDate) {
    console.log("start: ", startDate.toString(), "end: ", endDate.toString())
    let dates = []
    const addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

    //now our Sunday check
    let currentDate = startDate
    currentDate.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);
     
    while (currentDate <= endDate) {
      let endWeekDate = addDays.call(currentDate, 7);
      dates.push({after: currentDate.valueOf() / 1000, before: endWeekDate.valueOf() / 1000, dist: 0 });
      currentDate = addDays.call(currentDate, 7);
     }
    return dates;
}