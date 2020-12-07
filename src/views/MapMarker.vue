<template>
  <div>
    <h1
      class="p-2 text-lg font-bold text-center text-white uppercase bg-blue-500"
    >
      Map Maker
    </h1>
    <div class="flex flex-col items-center w-full h-full">
      <div class="flex flex-col flex-1 w-full h-full">
        <vue-google-maps
          @google-map-updated="onGoogleMapUpdated"
          style="width: 100%; height: 300px"
          :map-config="mapConfig"
          :api-key="apiKey"
          class="border border-gray-200"
        ></vue-google-maps>
      </div>
    </div>
  </div>
</template>

<script>
import VueGoogleMaps from "@/vue-google-maps/MapLoader";

export default {
  components: {
    VueGoogleMaps
  },
  data() {
    return {
      apiKey: process.env.VUE_APP_GMAP_API_KEY,
      mapConfig: {
        zoom: 16,
        center: {
          lat: -7,
          lng: 112
        }
      },
      map: null,
      google: null,
      geocoder: null,
      autocomplete: null,
      infoWindow: null,
      marker: null,
      form: {
        address: null,
        lat: null,
        lng: null
      }
    };
  },
  methods: {
    onGoogleMapUpdated(googleMap) {
      this.map = googleMap.map;
      this.google = googleMap.google;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.myPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.form.lat = position.coords.latitude;
            this.form.lng = position.coords.longitude;

            const { Marker } = this.google.maps;
            this.marker = new Marker({
              position: this.myPosition,
              map: this.map,
              draggable: true,
              animation: this.google.maps.Animation.DROP,
              title: "Current Position"
            });
            this.map.panTo(this.marker.position);
          },
          () => {
            this.handleLocationError(false);
          },
          {
            enableHighAccuracy: true
          }
        );
      } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false);
      }
    },
    handleLocationError(browserHasGeolocation) {
      this.infoWindow.setPosition(this.map.getCenter());
      this.infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      this.infoWindow.open(this.map);
    }
  }
};
</script>
