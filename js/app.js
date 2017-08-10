var locations = [{
        title: "KFC",
        location: {
            lat: 30.592263,
            lng: 31.487187
        }
    },
    {
        title: "Gawish Hospital",
        location: {
            lat: 30.591393,
            lng: 31.493367
        }
    },
    {
        title: "Mo\'men",
        location: {
            lat: 30.590049,
            lng: 31.490210
        }
    },
    {
        title: "Zagazig Zoo",
        location: {
            lat: 30.588049,
            lng: 31.495413
        }
    },
    {
        title: "Chill Out",
        location: {
            lat: 30.591386,
            lng: 31.494033
        }
    },
    {
        title: "La Poire",
        location: {
            lat: 30.589890,
            lng: 31.490503
        }
    },
    {
        title: "Pizza Alexandria",
        location: {
            lat: 30.588943,
            lng: 31.491984
        }
    },
    {
        title: "Bab elhara cafe",
        location: {
            lat: 30.591256,
            lng: 31.493786
        }
    },
    {
        title: "Casablanca Cafe",
        location: {
            lat: 30.590975,
            lng: 31.494291
        }
    },
    {
        title: "El Masreya Plaza Club",
        location: {
            lat: 30.591324,
            lng: 31.490980
        }
    }
];

// make location
var location_maker = function(location) {

    var CLIENT_ID = 'YOYR3VEOBJGTLUBHAFYSUOCHZGX5CE0EN445LUPT13BDGZUJ';
    var CLIENT_SECRET = '4GFLALMRA0SALH4E4CVRBQXB34NPFMOH2EXEB2LJOOM2ARZM';

    var self = this;
    this.title = location.title;
    this.lat = location.location.lat;
    this.long = location.location.lng;
    this.city = "Unknown";
    this.street = "Unknown";
    this.visible = ko.observable(true);

    var url = 'https://api.foursquare.com/v2/venues/search?ll=';
    url += this.lat + ',' + this.long + '&client_id=' + CLIENT_ID;
    url += '&client_secret=' + CLIENT_SECRET + '&v=20170101' + '&query=' + this.title;

    $.getJSON(url).done(function(data) {
        var locationInfo = data.response.venues[0];
        if (locationInfo) {
            if (typeof locationInfo.location.formattedAddress[0] !== 'undefined') {
                self.street = locationInfo.location.formattedAddress[0];
            }

            if (typeof locationInfo.location.formattedAddress[1] !== 'undefined') {
                self.city = locationInfo.location.formattedAddress[1];
            }
        }
    }).fail(function(){
        alert("Error Loading Foursquare Information");
    });
};




var ViewModel = function() {
    self = this;
    var map;

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    makeMarkerIcon = function(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    };

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    self.populateInfoWindow = function(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            var content = '<div>' + marker.title + '</div>';
            content += '<div>' + marker.info.city + '</div>';
            content += '<div>' + marker.info.street + '</div>';
            infowindow.setContent(content);
            infowindow.open(map, marker);

            if (infowindow.marker.getAnimation() !== null) {
                infowindow.marker.setAnimation(null);
            } else {
                infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    infowindow.marker.setAnimation(null);
                }, 1400);
            }

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.5903976,
            lng: 31.4915766
        },
        zoom: 17,
        styles: styles,
        mapTypeControl: false
    });

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    self.largeInfowindow = new google.maps.InfoWindow();


    // Create a new blank array for all the listing markers.
    self.markers = ko.observableArray([]);

    self.list = ko.observableArray([]);

    // The following group uses the location array to create an array of markers on initialize.
    locations.forEach(function(location, i) {

        // Get the position from the location array.
        var position = location.location;
        var title = location.title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            location: location.location,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        marker.info = new location_maker(marker);
        // Push the marker to our array of markers.
        self.markers.push(marker);
        self.list.push(marker);

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            self.populateInfoWindow(this, self.largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    });

    self.showMarks = function() {
        // show marks on the map
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var ii = 0; ii < self.markers().length; ii++) {
            self.markers()[ii].setMap(map);
            bounds.extend(self.markers()[ii].position);
        }
        map.fitBounds(bounds);
    };


    self.query = ko.observable('');

    this.query.subscribe(function(newText) {
        self.list.removeAll();
        locations.forEach(function(location, i) {
            if (location.title.toLowerCase().indexOf(newText.toLowerCase()) >= 0) {
                self.markers()[i].visible = true;
                self.list.push(self.markers()[i]);
            } else {
                self.markers()[i].visible = false;
            }
        });

        self.showMarks();
    });
    self.showMarks();
};