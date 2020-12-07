<template>
  <div>
    <h1
      class="p-2 text-lg font-bold text-center text-white uppercase bg-blue-500"
    >
      Map Places
    </h1>
    <div class="flex flex-col items-center w-full h-full">
      <div class="flex flex-col flex-1 w-full h-full">
        <input
          id="search"
          value=""
          type="text"
          placeholder="Search location"
          class="p-2 text-black border border-gray-200 select-all"
        />
        <vue-google-maps
          @google-map-updated="onGoogleMapUpdated"
          style="width: 100%; height: 300px"
          :map-config="mapConfig"
          :api-key="apiKey"
          :libraries="mapLibraries"
          class="border border-gray-200"
        ></vue-google-maps>
      </div>
      <div
        class="flex items-center flex-shrink-0 w-full p-2 my-1 text-gray-800 bg-white shadow-md"
      >
        <div class="flex flex-col flex-1 text-left">
          <div class="flex flex-col p-2">
            <div class="flex flex-col my-2">
              <label class="text-xs uppercase" for="latitude">ADDRESS</label>
              <input
                v-model="form.address"
                type="text"
                readonly
                class="p-2 my-1 text-black bg-gray-400 border border-gray-500 rounded-md"
              />
            </div>
            <div class="flex flex-col my-2">
              <label class="text-xs uppercase" for="latitude">LATITUDE</label>
              <input
                v-model="form.lat"
                type="text"
                readonly
                class="p-2 my-1 text-black bg-gray-400 border border-gray-500 rounded-md"
              />
            </div>
            <div class="flex flex-col my-2">
              <label class="text-xs uppercase" for="longitude">LONGITUDE</label>
              <input
                v-model="form.lng"
                type="text"
                readonly
                class="p-2 my-1 text-black bg-gray-400 border border-gray-500 rounded-md"
              />
            </div>
          </div>
        </div>
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
        },
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: true,
        styles: [
          {
            featureType: "poi.business",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text",
            stylers: [
              {
                visibility: "off"
              }
            ]
          }
        ]
      },
      mapLibraries: ["places"],
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
    getGeocode() {
      this.geocoder.geocode(
        { location: this.marker.position },
        (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              this.form.address = results[0].formatted_address;
            } else {
              window.alert("No results found");
            }
          } else {
            window.alert("Geocoder failed due to: " + status);
          }
        }
      );
    },
    onGoogleMapUpdated(googleMap) {
      this.map = googleMap.map;
      this.google = googleMap.google;

      // eslint-disable-next-line no-undef
      this.infoWindow = new google.maps.InfoWindow();
      this.infoWindow.open(this.map);

      // eslint-disable-next-line no-undef
      this.geocoder = new google.maps.Geocoder();

      const input = document.getElementById("search");
      // eslint-disable-next-line no-undef
      this.autocomplete = new google.maps.places.Autocomplete(input);

      // Bind the map's bounds (viewport) property to the autocomplete object,
      // so that the autocomplete requests use the current map bounds for the
      // bounds option in the request.
      this.autocomplete.bindTo("bounds", this.map);

      this.autocomplete.addListener("place_changed", () => {
        var place = this.autocomplete.getPlace();
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(17);
        }
        this.marker.setPosition(place.geometry.location);
        this.marker.setVisible(true);

        if (place.formatted_address) {
          this.form.address = place.formatted_address;
          this.form.lat = place.geometry.location.lat();
          this.form.lng = place.geometry.location.lng();
        }
      });

      const vm = this;
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
            this.getGeocode();
            // eslint-disable-next-line no-undef
            google.maps.event.addListener(this.marker, "dragend", function(
              evt
            ) {
              vm.form.lat = evt.latLng.lat();
              vm.form.lng = evt.latLng.lng();
              vm.getGeocode();
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
