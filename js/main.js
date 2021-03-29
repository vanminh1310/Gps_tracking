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

    function gotData(data) {
        var gpsmaps= data.val();
        // Grab the keys to iterate over the object
        var keys = Object.keys(gpsmaps);
      
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          // Look at each fruit object!
          var gpsmap = gpsmaps[key];
          console.log(gpsmap) // du lieu gps 
        }
      }

$(function ()
{

   







    var Core = {};
    Core.Timer = function (option) {
        if (option == null) option = {};
        if (option.interval == null) option.interval = 500;

        var to = null;
        this.isRunning = false;

        this.setOption = function (withOption) { if (withOption != null) withOption(option); };

        this.start = function () {
            var $this = this;

            if (this.isRunning) return;
            this.isRunning = true;

            var interval = typeof (option.interval) == "function" ? option.interval : function () { return option.interval; };
            this.onStart();
            var func = function () {
                stopHelper();
                to = setTimeout(function () {
                    var result = option.stopWhen != null && option.stopWhen();
                    if (result) {
                        clearTimeout(to);
                        to = null;
                        $this.onStop();
                        $this.isRunning = false;
                        return;
                    };

                    if (option.onTick != null) option.onTick();
                    if ($this.isRunning === true) func();
                    else $this.onStop();
                }, interval());
            }
            func();
        }
        this.onStart = function () { }
        this.onStop = function () { }
        this.stop = function () {
            if (this.isRunning == false) return;
            this.isRunning = false;
            stopHelper();
        };
        var stopHelper = function () { if (to != null) { clearTimeout(to); to = null; }; };
    };

    String.prototype.format = function () {
        var content = this;
        for (var i = 0; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            content = content.replace(reg, arguments[i]);
        }
        return content;
    };


    var article = $("article");
    var divMapId = article.find("#mapId");

    var VehicleTracking = function () {
        var views = [];
        this.addView = function (view) {
            view.vehicleTracking = this;
            view.onAddVehicleTracking();
            views.push(view);
        }
        var withView = function (wv) { for (var i = 0; i < views.length; i++) wv.bind(this)(views[i]); }.bind(this);

        var trackings = [];
        var currentTrackingIndex = 0;
        this.loadTrackings = function (data) {
            currentTrackingIndex = 0;
            trackings = [];
            withView(function (view) {
                view.clear();
                var previousTracking = null;
                for (var i = 0; i < data.length; i++) {
                    var tracking = data[i];
                    tracking.index = i;
                    view.initTracking(tracking, previousTracking);
                    previousTracking = tracking;
                }
            });
            trackings = data;
            viewTracking(0, true);
        }
        var viewTracking = function (index, focus) {
            currentTrackingIndex = index;
            var tracking = trackings[currentTrackingIndex];
            withView(function (view) { view.viewTracking(tracking, focus); });
        }
            .bind(this);

        var interval = 155;
        var timer;

        this.start = function () {
            if (timer != null && timer.isRunning) return;
            if (timer == null) {
                timer = new Core.Timer({ interval: function () { return interval; } });
                timer.onStop = function () {
                    withView(function (view) { view.timerStop(); });
                };
            }
            timer.setOption(function (options) {
                options.onTick = function () {
                    var nextIndex = currentTrackingIndex + 1;
                    if (nextIndex >= trackings.length) { currentTrackingIndex = nextIndex; return; };
                    viewTracking(nextIndex, true);
                }
                options.stopWhen = function () { return currentTrackingIndex >= trackings.length - 1; };
            });
            timer.start();
        }
        this.stop = function () {
            stopTimer();
            clear();
            viewTracking(0, true);
        }
        this.pause = function () { stopTimer(); };
        var stopTimer = function () {
            if (timer == null) return;
            timer.stop();
            timer.onStop();
        };
        var clear = function () {
            for (var i = 0; i <= currentTrackingIndex; i++) {
                var tracking = trackings[i];
                withView(function (view) { view.clearTracking(tracking); });
            }
        }.bind(this);

        var clearForGoto = function (index) {
            var nowIndex = currentTrackingIndex;
            for (var i = 0; i < index; i++) viewTracking(i, false);
            viewTracking(index, true);
            for (var i = index + 1; i <= nowIndex; i++) {
                var tracking = trackings[i];
                withView(function (view) { view.clearTracking(tracking); });
            }
        }
        this.gotoIndex = function (index) {
            if (timer == null || !timer.isRunning) clearForGoto(index);
            else {
                timer.stop();
                clearForGoto(index);
                timer.start();
            }
        }
    };

    var View = function () {
        this.vehicleTracking = null;
        this.clear = function () { };
        this.initTracking = function (tracking, previousTracking) { }; // khoi tao tracking 
        this.onAddVehicleTracking = function () { };
        this.timerStop = function () { };
        this.viewTracking = function (tracking, focus) { };// hien thi tracking 
        this.clearTracking = function (tracking) { };
    };

    var TableView = function () {
        $.extend(this, new View());
        this.container = null;
        var btnPlay = null, btnPause = null, btnReset = null;
        var tableBody = null;

        this.clear = function () { tableBody.empty(); };
        this.onAddVehicleTracking = function () {
            var $this = this;
            this.container.find(".area-tracking").remove();
            var area = $("<div class='area-tracking box' style='position:absolute; width: 190px; bottom: 2px; left: 2px; z-index:999; padding: 1px'>");
            area.append(article.find("[data-form=template]").html());
            this.container.append(area);

            tableBody = area.find(".table-ul-body .table-ul");

            btnPlay = area.find("[data-cmd=play]");
            btnPause = area.find("[data-cmd=pause]");
            btnReset = area.find("[data-cmd=reset]");

            btnPlay.click(function () { $this.vehicleTracking.start(); });
            btnPause.click(function () { $this.vehicleTracking.pause(); });
            btnReset.click(function () { $this.vehicleTracking.stop(); });
        }
        this.initTracking = function (tracking) {
            var $this = this;
            var row = $("<ul>"); row.css("cursor", "pointer");
            row.append("<li class='col0'>{0}</li>".format(tracking.Time));
            row.append("<li class='col3'>{0}, {1}</li>".format(tracking.Lat, tracking.Lng));
            row.click(function () { $this.vehicleTracking.gotoIndex(tracking.index); });
            tracking.row = row;
            tableBody.append(row);
        };
        this.viewTracking = function (tracking, focus) {
            if (focus) {
                tableBody.find("ul").removeClass("bg-success text-white");
                var parent = tableBody.parent();
                parent.scrollTop(parent.scrollTop() + tracking.row.position().top - parent.height() / 2 + tracking.row.height() / 2);
                tracking.row.addClass("bg-success text-white");
            }
        };
    };
    var MapView = function () {
        $.extend(this, new View());
        this.map = null;
        var markerVehicle = L.marker([], { zIndexOffset: 1000 });

        var vehicleIcons = [];
        var directionIcons = [];
        for (var i = 0; i <= 7; i++) {
            vehicleIcons.push(L.icon({ iconUrl: "icon/{0}.png".format(i), iconSize: [35, 35] }));
            directionIcons.push(L.icon({ iconUrl: "icon/D{0}.png".format(i), iconSize: [10, 10] }));
        }

        this.clear = function () {
            var $this = this;
            this.map.eachLayer(function (layer) {
                if (layer.options.id == "mapbox/streets-v11") return;
                $this.map.removeLayer(layer);
            });
        };
        this.initTracking = function (tracking, previousTracking) {
            tracking.latLng = L.latLng(tracking.Lat, tracking.Lng);
            if (previousTracking == null) tracking.direction = 0;
            else {
                tracking.direction = getDir(previousTracking.direction, previousTracking.Lng, previousTracking.Lat, tracking.Lng, tracking.Lat);
                tracking.polyline = L.polyline([[tracking.Lat, tracking.Lng], [previousTracking.Lat, previousTracking.Lng]], { color: "#dc3545" });
                tracking.markerDirection = L.marker([]);
                tracking.markerDirection.setLatLng(tracking.latLng);
                tracking.markerDirection.setIcon(directionIcons[tracking.direction]);
            }

            tracking.vehicleIcon = vehicleIcons[tracking.direction];

        };
        this.viewTracking = function (tracking, focus) {
            if (tracking.polyline != null) {
                tracking.polyline.addTo(this.map);
                tracking.markerDirection.addTo(this.map);
            }

            if (focus) {
                markerVehicle.setIcon(tracking.vehicleIcon);
                markerVehicle.setLatLng(tracking.latLng).addTo(this.map);
                this.map.panTo(tracking.latLng, { animate: true });
            }
        }
        this.clearTracking = function (tracking) {
            if (tracking.polyline != null) {
                tracking.polyline.removeFrom(this.map);
                tracking.markerDirection.removeFrom(this.map);
            }
        }
        var getDir = function (oldDir, oldLongitude, oldLatitude, longitude, latitude) {
            //First point
            if (oldLatitude === 0 && oldLongitude === 0) {
                oldLatitude = latitude;
                oldLongitude = longitude;
                return 0;
            }

            //If longitude and latitude are not valid, don't change car's direction
            if (longitude === 0 | latitude === 0) { return oldDir; }

            //If distance between two cars is too small, exit sub
            if (canculatorDistance(longitude, latitude, oldLongitude, oldLatitude) < 30) return oldDir;

            //Calculate new direction
            var deltax = 0;
            var deltay = 0;
            var s = 0;
            var g = 0;

            deltax = latitude - oldLatitude;
            deltay = longitude - oldLongitude;

            s = Math.sqrt(Math.pow(deltax, 2) + Math.pow(deltay, 2));
            g = Math.acos(deltax / s);

            if (deltay < 0) { g = 2 * Math.PI - g; }

            g = Math.round(4 * g / Math.PI);
            if (g > 7 || g < 0) { g = 0; }

            return g;
        };
        var canculatorDistance = function (lng1, lat1, lng2, lat2) {
            if (lng1 === lng2 && lat1 === lat2) return 0;
            var p1x = lng1 * (Math.PI / 180);
            var p1y = lat1 * (Math.PI / 180);
            var p2x = lng2 * (Math.PI / 180);
            var p2y = lat2 * (Math.PI / 180);

            var kc = p2x - p1x;
            var temp = Math.cos(kc);
            temp = temp * Math.cos(p2y);
            temp = temp * Math.cos(p1y);
            kc = Math.sin(p1y);
            kc = kc * Math.sin(p2y);
            temp = temp + kc;
            kc = Math.acos(temp);
            kc = kc * 6378137;
            return kc;
        };
    };

    var vehicleTracking = new VehicleTracking();

    // Bảng view tracking
    var tableView = new TableView();
    tableView.container = divMapId;
    vehicleTracking.addView(tableView);

    // Map view tracking
    var mapView = new MapView();
    mapView.map = L.map(divMapId[0]).setView([20.922699, 105.833162], 15);
    var myUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    L.tileLayer(myUrl, { maxZoom: 40, attribution: 'Code mô phỏng © <a href="http://sonpc20.com">Sonpc20.com</a>', id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1 }).addTo(mapView.map);

    vehicleTracking.addView(mapView);
    vehicleTracking.loadTrackings(trackings);
});
