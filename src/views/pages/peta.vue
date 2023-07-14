<template>
    <div id="map"></div>
  </template>
  
  <script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  export default {
    mounted() {
      // Inisialisasi peta
      this.map = L.map('map').setView([51.505, -0.09], 13);
  
      // Tambahkan layer tile dari Leaflet
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }
  </script>
  
  <style>
  #map {
    height: 400px;
  }
  </style>
  