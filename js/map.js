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


    // var textnode = document.createTextNode("Water");
  
  
    
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      // Look at each fruit object!
      vido = scores[k].Latitude;
      kinhdo = scores[k].Longitude;
      console.log("LA",vido,"LO",kinhdo)
     
    }
    console.log("LA",vido,"LO",kinhdo)
}
  






// tạo map
var map = L.map('mapId').setView([10.8447125, 106.797841667], 20);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.facebook.com/taminh1310">Văn Minh</a> contributors'
}).addTo(map);



L.marker([10.8447125, 106.797841667]).addTo(map)
    .bindPopup('Tôi ở đây <br>Văn Minh')
    .openPopup();