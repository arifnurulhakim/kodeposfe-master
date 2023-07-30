<template>
    <div>
      <div id="map">
        <a href="https://www.maptiler.com" style="position:absolute;left:10px;bottom:10px;z-index:999;">
          <img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo">
        </a>
      </div>
    </div>
  </template>
  
  <script>
  import 'ol/ol.css';
  import { Map, View } from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import TileJSON from 'ol/source/TileJSON';
  import Attribution from 'ol/control/Attribution';
  import { fromLonLat } from 'ol/proj';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import GeoJSON from 'ol/format/GeoJSON';
  import Style from 'ol/style/Style';
  import Stroke from 'ol/style/Stroke';
  import Fill from 'ol/style/Fill';
  
  export default {
    mounted() {
      this.initializeMap();
      this.addGeoJSONLayer();
    },
    methods: {
      initializeMap() {
        const attribution = new Attribution({
          collapsible: false,
        });
  
        const source = new TileJSON({
          url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=uIjYEIXRFkHnvnQpkk2N`, // Replace with your MapTiler API key
          tileSize: 512,
          crossOrigin: 'anonymous',
        });
  
        this.map = new Map({
          layers: [new TileLayer({ source })],
          controls: [attribution],
          target: 'map',
          view: new View({
            constrainResolution: true,
            center: fromLonLat([119.753233, -1.976053]), // center on Indonesia
            zoom: 5, // starting zoom
          }),
        });
      },
      addGeoJSONLayer() {
        const vectorSource = new VectorSource({
          url: `https://api.maptiler.com/data/8f4bf7a5-4948-46dc-b600-08c7dc2deba9/features.json?key=uIjYEIXRFkHnvnQpkk2N`, // Replace with your MapTiler Dataset ID
          format: new GeoJSON(),
        });
  
        const layer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: 'black', // Set the stroke color to black
            width: 1,
            fillOpacity: 0 // Set the stroke width (optional)
          }),
         
        }),
      });
        this.map.addLayer(layer);
      },
    },
  };
  </script>
  
  <style>
  #map {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  </style>
  