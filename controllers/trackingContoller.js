var hexToDec = require('hex-to-dec');
var rawData = "080400000113fc208dff000f14f650209cca80006f00d6040004000403010115031603000 1460000015d0000000113fc17610b000f14ffe0209cc580006e00c0050001000403010115 0316010001460000015e0000000113fc284945000f150f00209cd20000950108040000000 4030101150016030001460000015d0000000113fc267c5b000f150a50209cccc000930068 0400000004030101150016030001460000015b0004";    
var fullDataSplit = {
    timeStamp: function(){
        dateData =rawData.substring(9,20);
        dateDec = hexToDec(data);
        var date = new Date(dateDec);
        return date;
    },
    longitude: function(){
        longitudeData = rawData.substring(22,30);
        longi = hexToDec(longitudeData);
        longiValue=longi/10000000;
        return longiValue;
    },
    // latitude: function(){
    //     longitudeData = rawData.substring(22,30);
    //     longi = hexToDec(latitudeData);
    //     longiValue=longi/10000000;
    //     return longiValue;
    // }

}
module.exports = fullDataSplit;
    