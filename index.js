const request = require('request');
var xml2js = require('xml2js');
var CronJob = require('cron').CronJob;


new CronJob('* * * * * *', invokeService, null, true, 'America/Los_Angeles');
  
function invokeService() {

    request('http://api.quickdigital.in/core/api/v1/public/track-all', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        var parser = new xml2js.Parser();
        parser.parseString(body, function (err, result) {
            if (result.vtsdata && result.vtsdata.data) {
                let data = result.vtsdata.data;
                if (data && data.length > 0) {
                    let filteredData = data.filter(element => {
                        let gps_power = element['$'].gps_power.replace('%', '');
                        if (!Number.isNaN(gps_power) && gps_power <= 40) {
                            return true;
                        }
                    }).map(element => {
                        return {
                            vehicle_number: element['$'].vehicle_number,
                            gps_power: element['$'].gps_power
                            
                        }
                    });

                    filteredData.forEach(element => {
                        console.log(element.vehicle_number + '->' + element.gps_power)
                    });
                }
            }
        });
    });
}