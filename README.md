# Vue 3 Google Maps

Google Maps Loader for Vue 3

## Install
```
npm install @point-hub/vue-google-maps

or

yarn add @point-hub/vue-google-maps
```

## Usage
```
<template>
  <vue-google-maps
    style="width: 100%; height: 300px"
    :map-config="mapConfig"
    :api-key="apiKey"
  ></vue-google-maps>
</template>

<script>
import VueGoogleMaps from "@point-hub/vue-google-maps";

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

```