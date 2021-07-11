var firebaseConfig = {
    apiKey: "AIzaSyALyfBlOsvmKDwNQLTKurC5hf_BmFKYnr4",
    authDomain: "vann-53570.firebaseapp.com",
    databaseURL: "https://vann-53570.firebaseio.com",
    projectId: "vann-53570",
    storageBucket: "vann-53570.appspot.com",
    messagingSenderId: "476713717043",
    appId: "1:476713717043:web:93e1c456a05aa8b8130246",
    measurementId: "G-8PRCPKPS2K"
};
firebase.initializeApp(firebaseConfig);
var ref = firebase.database().ref("GPS2");
ref.on("value", gotData);
var kinhdo;
var vido;
var btncheck = document.getElementById("btn-check-2");
var btncheck2 = document.getElementById("btn-check-21");



String.prototype.format = function () {
    var content = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        content = content.replace(reg, arguments[i]);
    }
    return content;
    
};

function gotData(data) {
    var scores = data.val();
    // Grab the keys to iterate over the object
    var keys = Object.keys(scores);
    // var textnode = document.createTextNode("Water"

    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        // Look at each fruit object!
        vido = scores[k].Latitude;
        kinhdo = scores[k].Longitude;
        time = scores[k].Time
        min = scores[k].minute
        se = scores[k].Second
        day = scores[k].Date
        mon = scores[k].month
        ye = scores[k].year
        speed = scores[k].Speed
        console.log(time + "/" + min + "/" + se)

        var row = $("<ul>");
        row.css("cursor", "pointer");
        row.append("<li class='col0'>{0},</li>".format(day + "/" + mon + "/" + ye));
        row.append("<li class='col0'>{0},</li>".format(time + ":" + min + ":" + se));
        row.append("<li class='col0'>{0},</li>".format(vido));
        // row.append("<li class='col3'>{0}</li>".format(vido));
        row.append("<li class='col3'>{0},</li>".format(kinhdo));
        row.append("<li class='col3'>{0}</li>".format(speed));
        // row.append("<li class='col3'>{0},</li>".format(kinhdo));
        row.click(function () {
            // alert($(this).text()); // get data from row on list 
            var array = $(this).text().split(',', 3)[2];
            var array2 = $(this).text().split(',', 4)[3];
            L.marker([array, array2], {
                icon: greenIcon
            }).addTo(map)
            map.setView([array, array2], 20); // zoom 
            console.log(array)
            console.log(array2)
        }); // ham click
        // sai jquery 
        $(".table-ul-body .table-ul").append(row);
    }
    console.log("LA",this.vido, "LO", this.kinhdo)
    document.getElementById('time').innerHTML= time + ":" + min + ":" + se;
    document.getElementById('date').innerHTML = day + "/" + mon + "/" + ye;
    document.getElementById('vido').innerHTML = vido;
    document.getElementById('kinhdo').innerHTML = kinhdo;
    document.getElementById('speed').innerHTML = speed;

}


var btnecall = firebase.database().ref().child("ecall")
btnecall.on('value',function(btnecall){
  // AS.innerHTML=btnecall.val();
  console.log(btnecall.val());
  if(btnecall.val()<20){
    $('#staticBackdrop').modal('show');
   }

  });

// tạo map
var map = L.map('mapId').setView([10.8447125, 106.797841667], 5);
//L.marker([10.8447125, 106.797841667], {icon: greenIcon}).addTo(map) .bindPopup();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.facebook.com/taminh1310">Văn Minh</a> contributors'
}).addTo(map);

L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
    layers: 'nexrad-n0r-900913',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
});
var greenIcon = L.icon({
    iconUrl: 'icon2.png',


    iconSize: [70, 45], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-2, -40] // point from which the popup should open relative to the iconAnchor
});