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