// var places = [

// ];

var viewModel = function(){
  self = this;
  var map;



      // This function takes in a COLOR, and then creates a new marker
      // icon of that color. The icon will be 21 px wide by 34 high, have an origin
      // of 0, 0 and be anchored at 10, 34).
      makeMarkerIcon = function(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      };


      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      self.populateInfoWindow = function(marker, infowindow) {
        console.log(marker);
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      };

      // Create a new blank array for all the listing markers.
      self.markers = [];

        // Create a styles array to use with the map.
        var styles = [
        {
          featureType: 'water',
          stylers: [
          { color: '#19a0d8' }
          ]
        },{
          featureType: 'administrative',
          elementType: 'labels.text.stroke',
          stylers: [
          { color: '#ffffff' },
          { weight: 6 }
          ]
        },{
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [
          { color: '#e85113' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
          { color: '#efe9e4' },
          { lightness: -40 }
          ]
        },{
          featureType: 'transit.station',
          stylers: [
          { weight: 9 },
          { hue: '#e85113' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'labels.icon',
          stylers: [
          { visibility: 'off' }
          ]
        },{
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [
          { lightness: 100 }
          ]
        },{
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
          { lightness: -100 }
          ]
        },{
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
          { visibility: 'on' },
          { color: '#f0e4d3' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
          { color: '#efe9e4' },
          { lightness: -25 }
          ]
        }
        ];

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 30.8591514, lng: 31.9200567},
          zoom: 15,
          styles: styles,
          mapTypeControl: false
        });

        // These are the real estate listings that will be shown to the user.
        // Normally we'd have these in a database instead.
        self.locations = [
        {title: 'El Husseineya Central Hospital', location: {lat: 30.8639, lng: 31.9127}},
        {title: 'Traffic Station - El Husseineya', location: {lat: 30.8651, lng: 31.9278}},
        {title: 'Hosseinieh Court', location: {lat: 30.862, lng: 31.9139}},
        {title: 'Palace of Culture Hosseinieh', location: {lat: 30.8603, lng: 31.9126}},
        {title: 'Banque Du Caire', location: {lat: 30.8566, lng: 31.9179}},
        {title: 'Telecom Egypt - El Husseineya Central', location: {lat: 30.8556, lng: 31.9166}},
        {title: 'Hakem El Tahawy Mosque', location: {lat: 30.8643, lng: 31.9303}},
        {title: 'Great Alcaros Church of St. Mark the Apostle Husayniyyas', location: {lat: 30.8649, lng: 31.9212}},
        {title: 'Hosseinieh City Council', location: {lat: 30.8557, lng: 31.9179}}
        ];

        var largeInfowindow = new google.maps.InfoWindow();

        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('FFFF24');

        self.largeInfowindow = new google.maps.InfoWindow();
        // The following group uses the location array to create an array of markers on initialize.
        self.locations.forEach(function(location, i){

          // Get the position from the location array.
          var position = location.location;
          var title = location.title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
          });
          // Push the marker to our array of markers.
          self.markers.push(marker);
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

        // show marks on the map
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var ii = 0; ii < self.markers.length; ii++) {
          self.markers[ii].setMap(map);
          bounds.extend(self.markers[ii].position);
        }
        map.fitBounds(bounds);

      };