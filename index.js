const app = new Vue({
  el: '#app',
  data: {
    stops: [],
    numStops: 10,
    location: { lat: null, lng: null }
  },
  computed: {
    filteredStops: function () {
      return this.stops.sort((a, b) => a.distance - b.distance).slice(0, this.numStops)
    }
  },
  methods: {
    updateLocation(loc) {
      this.location.lat = loc.latitude;
      this.location.lng = loc.longitude;
      this.recalcDistances();
    },
    recalcDistances() {
      for (let i = 0; i < this.stops.length; i++) {
        let stop = this.stops[i]
        this.stops[i].distance = calcDistBetween(this.location.lat, this.location.lng, stop.lat, stop.lon);
      }
    }
  },
  mounted() {
    const me = this;
    fetch('https://utils.pauliankline.com/stops.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        app.stops = myJson;
      });
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        me.updateLocation(position.coords);
      });
      navigator.geolocation.watchPosition(function(position) {
        me.updateLocation(position.coords);
      });
    }
  }
})

// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function calcDistBetween(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
