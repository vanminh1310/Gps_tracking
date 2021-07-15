// var firebaseConfig = {
//     apiKey: "AIzaSyALyfBlOsvmKDwNQLTKurC5hf_BmFKYnr4",
//     authDomain: "vann-53570.firebaseapp.com",
//     databaseURL: "https://vann-53570.firebaseio.com",
//     projectId: "vann-53570",
//     storageBucket: "vann-53570.appspot.com",
//     messagingSenderId: "476713717043",
//     appId: "1:476713717043:web:93e1c456a05aa8b8130246",
//     measurementId: "G-8PRCPKPS2K"
// };
firebase.initializeApp(firebaseConfig);

var track = firebase.database().ref("GPS3");
var ref = firebase.database().ref("GPS2");
// ref.on("value", gotData);
var kinhdo;
var vido;
var time;
var min;
var se;
var dates;
var speed;
var kinhdo4;
var btncheck = document.getElementById("btn-check-2");
var btncheck2 = document.getElementById("btn-check-21");

var time_ecall;
var kinhdo_ecall;
var vido_ecall;
var speed_ecall;
var date_ecall;

// if (btncheck2.checked == false) {
//     document.getElementById('tab').style.display = 'none'
// }
// if (btncheck.checked == false) {
//     document.getElementById('card12').style.display = 'none'
// }

String.prototype.format = function () {
    var content = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        content = content.replace(reg, arguments[i]);
    }
    return content;

};
// check map
function checkmap(e) {
    navigator.geolocation.getCurrentPosition(function (location) {
        var latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

        L.marker(latlng).addTo(map)
            .bindPopup("Vị trí của bạn").openPopup();
        map.setView(latlng, 20); // zoom  

    });

}

var kinhdo3 = firebase.database().ref().child("GPS4/")
ref.on("value", ecall);


var make_gs;

function gotData(data) {
    var scores = data.val();
    // Grab the keys to iterate over the object
    var keys = Object.keys(scores);
    // var textnode = document.createTextNode("Water")
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];

        // Look at each fruit object!
        vido = scores[k].Latitude;
        kinhdo = scores[k].Longitude;
        time = scores[k].Time
        speed = scores[k].Speed
        dates = scores[k].Date

        console.log(time)
        var row = $("<ul>");
        row.css("cursor", "pointer");
        row.append("<li class='col0'>{0},</li>".format(time));
        row.append("<li class='col0'>{0},</li>".format(vido));
        row.append("<li class='col0'>{0},</li>".format(kinhdo));
        row.append("<li class='col0'>{0}</li>".format(speed));
        row.click(function () {
            // alert($(this).text()); // get data from row on list 
            var time = $(this).text().split(',', 1)[0];
            var vido1 = $(this).text().split(',', 2)[1];
            var kinhdo2 = $(this).text().split(',', 3)[2];
            var speeds = $(this).text().split(',', 4)[3];
            var list = " <dt>Tracking</dt>" +
                "<dt>Time</dt>" +
                "<dd>" + time + "</dd>" +
                "<dt>Tọa Độ</dt>" +
                "<dd>" + vido1 + "," + kinhdo2 + "</dd>" +
                "<dt>Tốc độ</dt>" +
                "<dd>" + speeds + "</dd>"
            $(this).toggleClass('background_selected');
            make_gs = L.marker([vido1, kinhdo2], {
                icon: greenIcon
            }).addTo(map)
            make_gs.bindPopup(list)
            map.setView([vido1, kinhdo2], 20); // zoom 

        }); // ham click
        // sai jquery 
        $(".table-ul-body .table-ul").append(row);
    }
    console.log("LA", this.vido, "LO", this.kinhdo)


}


// ecall
function ecall(data) {
    var scores = data.val();
    // Grab the keys to iterate over the object
    var keys = Object.keys(scores);
    // var textnode = document.createTextNode("Water")
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        // Look at each fruit object!
        vido_ecall = scores[k].Latitude;
        kinhdo_ecall = scores[k].Longitude;
        time_ecall = scores[k].Time
        speed_ecall = scores[k].Speed
        date_ecall = scores[k].Date
        console.log(i)
        document.getElementById('count').innerHTML = i
        console.log(time_ecall)
        var row = $("<ul>");
        row.css("cursor", "pointer");
        row.append("<li class='col0'>{0},</li>".format(time_ecall));
        row.append("<li class='col0'>{0},</li>".format(vido_ecall));
        row.append("<li class='col0'>{0},</li>".format(kinhdo_ecall));
        row.append("<li class='col0'>{0}</li>".format(speed_ecall));
        row.click(function () {
            // alert($(this).text()); // get data from row on list 
            var time = $(this).text().split(',', 1)[0];
            var vido1 = $(this).text().split(',', 2)[1];
            var kinhdo2 = $(this).text().split(',', 3)[2];
            var speeds = $(this).text().split(',', 4)[3];
            var list =
                "<dt>Ecall</dt>" +
                "<dl><dt>Time</dt>" +
                "<dd>" + time + "</dd>" +
                "<dt>Tọa Độ</dt>" +
                "<dd>" + vido1 + "," + kinhdo2 + "</dd>" +
                "<dt>Tốc độ</dt>" +
                "<dd>" + speeds + "</dd>"
            $(this).toggleClass('background_selected');
            make_gs = L.marker([vido1, kinhdo2], {
                icon: waring
            }).addTo(map)
            make_gs.bindPopup(list)
            map.setView([vido1, kinhdo2], 20); // zoom 

        }); // ham click
        // sai jquery 
        $(".table-ul-body-ecall .table-ul-ecall").append(row);
    }
    console.log("LA", this.vido_ecall, "LO", this.kinhdo_ecall)
    document.getElementById('time_ecal').innerHTML = time_ecall
    document.getElementById('date_ecal').innerHTML = date_ecall
    document.getElementById('vido_ecal').innerHTML = vido_ecall
    document.getElementById('kinhdo_ecal').innerHTML = kinhdo_ecall
    document.getElementById('speed_ecal').innerHTML = speed_ecall


}

// check button

var btn1 = false;
var btn2 = false;
var btn3 = false;
var btn_ecall = false;


$('#tk,#gs,#ecall').click(function () {
    if (this.id == 'tk') {
        btn1 = true;



    }
    if (this.id == 'gs') {
        btn2 = true;


        // 

    }
    if (this.id == 'ecall') {
        btn3 = true;


    }
    if (this.id == 'btn_ecall') {
        btn_ecall = true;


    }


});


var btnecall = firebase.database().ref().child("ecall")
btnecall.on('value', function (btnecall) {
    // AS.innerHTML=btnecall.val();
    console.log(btnecall.val());
    if (btnecall.val() >1.2) {
        $('#staticBackdrop').modal('show');
    }

});

function click_pass() {
    var myModal = document.getElementById('modal')
    var pass = document.getElementById('pass').value
    var passW = firebase.database().ref().child("pass")
    passW.on('value', function (passW) {
        var pass2 = passW.val();
        // btn search
        if (pass == pass2 && btn1 == true) {
            $('#modal').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            console.log("test1");
            // alert("Chế độ Checking Real Time")
            kinhdo3.on('value', function (kinhdo3) {
                // AS.innerHTML=kinhdo3.val();

                kinhdo4 = kinhdo3.val().LO
                var time = kinhdo3.val().TIME
                var vido4 = kinhdo3.val().LA
                var sp = kinhdo3.val().SP

                document.getElementById('time').innerHTML = time
                // document.getElementById('date').innerHTML = dates
                document.getElementById('kinhdo').innerHTML = kinhdo4
                document.getElementById('vido').innerHTML = vido4
                document.getElementById('speed').innerHTML = sp + " kpm";
                var list =
                    "<dt>VanMinh</dt>" +
                    "<dt>Time</dt>" +
                    "<dd>" + time + "</dd>" +
                    "<dt>Tọa Độ</dt>" +
                    "<dd>" + vido4 + "," + kinhdo4 + "</dd>" +
                    "<dt>Tốc độ</dt>" +
                    "<dd>" + sp + "</dd>"

                L.marker([vido4, kinhdo4], {
                        icon: human
                    }).addTo(map)
                    .bindPopup(list)
                map.setView([vido4, kinhdo4], 18);


            });
            document.getElementById('gr_serach').style.display = 'block'
            document.getElementById('list_ul').style.display = 'none'
            document.getElementById('list_ulecall').style.display = 'none'

        }
        if (pass == pass2 && btn2 == true) {
            track.on("value", gotData);
            $('#modal').modal('hide');
            $('.modal-backdrop').remove();
            console.log("test12");
            document.getElementById('list_ul').style.display = 'block'
            document.getElementById('gr_serach').style.display = 'none'
            document.getElementById('list_ulecall').style.display = 'none'
        }
        if (pass == pass2 && btn3 == true) {

            $('#modal').modal('hide');
            $('.modal-backdrop').remove();
            console.log("test12");
            document.getElementById('list_ul').style.display = 'none'
            document.getElementById('gr_serach').style.display = 'none'
            document.getElementById('list_ulecall').style.display = 'block'

        } else {
            document.getElementById("tb").innerHTML = "Mật khẩu sai rồi hay thử lại nhé!"
        }
    });

}





// icon 
var greenIcon = L.icon({
    iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var human = L.icon({
    iconUrl: 'pngegg.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var waring = L.icon({
    iconUrl: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|e85141&chf=a,s,ee00FFFF',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// tạo map
var map = L.map('mapId').setView([10.8447125, 106.797841667], 5);
//L.marker([10.8447125, 106.797841667], {icon: greenIcon}).addTo(map) .bindPopup();
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.facebook.com/taminh1310">Văn Minh</a> contributors'
// }).addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/vanminh1310/ckqs0mony459o18oe5rf1o2v8/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidmFubWluaDEzMTAiLCJhIjoiY2txcnJpNDl6MWl4ejJuc3R4c2R4eGs2YiJ9.USooEOj9coEGxR1p_XuPWQ', {
    attribution: '&copy; <a href="https://www.facebook.com/taminh1310">Văn Minh</a> contributors'
}).addTo(map);

// L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
//     layers: 'nexrad-n0r-900913',
//     format: 'image/png',
//     transparent: true,
//     attribution: "Weather data © 2012 IEM Nexrad"
// });