var History = require('../models/history');
var Vehicle = require('../models/vehicle');
var historyController = require('./historyController');

module.exports = {
    create : function(req,res) {
        Vehicle.viewVehicles(function(err,res){
            res.forEach(element => {
                var date = new Date() // Today!
                date.setDate(date.getDate() - 1); // Yesterday!
                var date = date.toISOString();
                var d = date.substring(0,10);
                var history = new History({
                    date : d,
                    userId : element.userId,
                    vehicleNumber : element.vehicleNumber,
                    trackingData : element.trackingData,
                    distance:0
                });
                History.getHistoryToDist('cp VO 2020');
                Vehicle.removeAllTrackingData(element._id,function(err,res){
                    if(err){
                        console.log(err);
                    }
                    console.log(res);
                })
                History.newHistory(history,function(err,historyRes){
                    if(err){
                        console.log({success: false, msg: err});
                    }
                    console.log({success:true,history:historyRes});
                })
                console.log(element._id);
            });
        })
        console.log({success:true});
    },

    addDistance : function(req){
        //res.json({success:false, msg:err});
        History.historyByDate(req,function(err,res){             
            res.forEach(element => { 
                if (err){
                    res.json({success:false, msg:err});
                }
                var trackingDataLength = element.trackingData.length;
                var vehicleNumber = element.vehicleNumber
                var distance = 0;
                var j =0 ;
    
                for (let i = 0; i < trackingDataLength-1; i++) {
                    radconv = 3.14159265358979 / 180;
                    var x1 = element.trackingData[i].latitude * radconv;
                    var y1 = element.trackingData[i].longitude * radconv;
                    var x2 = element.trackingData[i+1].latitude * radconv;
                    var y2 = element.trackingData[i+1].longitude * radconv;  
                    xDiff = x2 -x1;
                    yDiff = y2 -y1;
                    a = ((Math.sin(xDiff / 2) * Math.sin(xDiff / 2)) + (Math.cos(x1) * Math.cos(x2) * Math.sin(yDiff / 2) * Math.sin(yDiff / 2)))
                    c = 2 * Math.atan(Math.sqrt(a) / Math.sqrt(1 - a));
                    R = 6371;
                    dist = R * c
                    distance = distance + dist ;
                    j=i;
                }
                console.log('__________________________________');
                console.log(element._id);
                console.log('number of tracking data : '+(j+2));
                console.log('distance : '+distance);
                console.log('vehicle number : '+vehicleNumber);
                console.log('__________________________________');

                History.updateHistoryTrackingDistance(vehicleNumber,distance, function(err, res){
                    if(err){
                      console.log(err);
                    }
                    console.log('add tracking distance');
                  })
            });
        });
    }
}