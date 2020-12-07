<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import GoogleMapsApi from "@point-hub/google-maps-api";

export default {
  props: {
    mapConfig: {
      type: Object,
      required: true
    },
    apiKey: {
      type: String,
      required: true
    },
    libraries: {
      type: Array,
      required: false
    }
  },
  emits: ["google-map-updated"],
  data() {
    return {
      google: null,
      map: null
    };
  },
  mounted() {
    GoogleMapsApi({
      libraries: this.libraries,
      apiKey: this.apiKey
    }).then(google => {
      this.google = google;
      this.initializeMap();
    });
  },
  methods: {
    initializeMap() {
      const mapContainer = this.$el.querySelector("#map");
      const { Map } = this.google.maps;
      this.map = new Map(mapContainer, this.mapConfig);
      this.$emit("google-map-updated", {
        map: this.map,
        google: this.google
      });
    }
  }
};
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
