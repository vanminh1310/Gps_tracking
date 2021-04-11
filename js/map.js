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
var ref = firebase.database().ref("GPS");
ref.on("value", gotData);
var kinhdo;
var vido;
var time;
var min;
var se;
var day, mon, ye;
var speed;
var btncheck = document.getElementById("btn-check-2");
var btncheck2 = document.getElementById("btn-check-21");

if (btncheck2.checked == false) {
    document.getElementById('tab').style.display = 'none'
}
if (btncheck.checked == false) {
    document.getElementById('card12').style.display = 'none'
}

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
    // var textnode = document.createTextNode("Water")
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
            row.append("<li class='col0'>{0},</li>".format(time + ":" + min + ":" + se));
            row.append("<li class='col0'>{0},</li>".format(vido));
            // row.append("<li class='col3'>{0}</li>".format(vido));
            row.append("<li class='col3'>{0},</li>".format(kinhdo));
            row.append("<li class='col3'>{0}</li>".format(speed));
            // row.append("<li class='col3'>{0},</li>".format(kinhdo));
        row.click(function () {
            // alert($(this).text()); // get data from row on list 
            var array = $(this).text().split(',', 2)[1];
            var array2 = $(this).text().split(',', 3)[2];
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
    console.log("LA", this.vido, "LO", this.kinhdo)
            document.getElementById('time').innerHTML = time + ":" + min + ":" + se
            document.getElementById('date').innerHTML = day + "/" + mon + "/" + ye
            document.getElementById('kinhdo').innerHTML = this.kinhdo
            document.getElementById('vido').innerHTML = this.vido
            document.getElementById('tocdo').innerHTML = speed + " kpm";
    L.marker([vido, kinhdo], {
        icon: greenIcon
    }).addTo(map)
    map.setView([vido, kinhdo], 18);
}

var btnecall = firebase.database().ref().child("ecall")
btnecall.on('value',function(btnecall){
  // AS.innerHTML=btnecall.val();
  console.log(btnecall.val());
  if(btnecall.val()==1){
    $('#staticBackdrop').modal('show');
   }
   else{
    $('#staticBackdrop').modal('hide'); 
  }
  });

function click_pass() {
    var myModal = document.getElementById('modal')
    var pass = document.getElementById('pass').value
    var passW = firebase.database().ref().child("pass")
    passW.on('value', function (passW) {
        var pass2 = passW.val();
        if (pass == pass2 && btncheck.checked == true) {
                $('#modal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                console.log("test1");
                // alert("Chế độ Checking Real Time")
                document.getElementById('tab').style.display = 'none'
                document.getElementById('card12').style.display = 'block'
                document.getElementById('mapId').style.display = 'block'
        }
        if (pass == pass2 && btncheck2.checked == true) {
                $('#modal').modal('hide');
                $('.modal-backdrop').remove();
                console.log("test12");
                document.getElementById('tab').style.display = 'block'
                document.getElementById('card12').style.display = 'none'
        } else {
                document.getElementById("tb").innerHTML = "Mật khẩu sai rồi hay thử lại nhé!"
        }
    });

}

// icon 
var greenIcon = L.icon({
    iconUrl: 'icon2.png',
    iconSize: [70, 45], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-2, -40] // point from which the popup should open relative to the iconAnchor
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