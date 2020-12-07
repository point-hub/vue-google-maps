<template>
  <div>
    <h1
      class="p-2 text-lg font-bold text-center text-white uppercase bg-blue-500"
    >
      Map Only
    </h1>
    <vue-google-maps
      style="width: 100%; height: 300px"
      :map-config="mapConfig"
      :api-key="apiKey"
    ></vue-google-maps>
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
      }
    };
  }
};
</script>
