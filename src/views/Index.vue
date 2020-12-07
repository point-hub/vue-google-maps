<template>
  <div class="flex">
    <nav class="flex flex-col w-64">
      <h1 class="m-2 text-lg font-bold">Vue 3 Google Maps</h1>
      <router-link class="mx-2 my-1" to="/">Map Only</router-link>
      <router-link class="mx-2 my-1" to="/map-marker">Map Marker</router-link>
      <router-link class="mx-2 my-1" to="/map-places">Map Places</router-link>
    </nav>
    <div class="flex-1">
      <router-view></router-view>
    </div>
  </div>
</template>
