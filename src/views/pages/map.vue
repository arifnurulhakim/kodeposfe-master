<template>
  <!-- Header -->

    <div class="py-4 px-8 mx-0  flex align-items-center justify-content-between relative lg:static mb-3" style="background-color: white;">
                <a class="flex align-items-center w-full" @click="redirectToHome">
                    <img src="/demo/images/login/kominfoo.png" alt="logo" height="50" class="mr-0 lg:mr-2" />
                    <div class="layout-topbar-content w-full">
                        <h1>KEMKOMINFO RI</h1>
                        <h5>Menuju Masyarakat Informasi Indonesia</h5>
                    </div>
                </a>
                <a class="cursor-pointer block lg:hidden text-700 p-ripple" v-ripple v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
                    <i class="pi pi-bars text-4xl"></i>
                </a>
                <div class="align-items-center surface-0 flex-grow-1 justify-content-end hidden lg:flex relative lg:static w-full left-0 px-6 lg:px-0 z-2" style="top: 120px">
                    <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column flex-row-reverse lg:flex-row cursor-pointer">
                      <li>
          <a @click="redirectToHome" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
            <span>Home</span>
          </a>
        </li>

                        <!-- <li>
                            <Button label="Login" :onClick="redirectToLogin" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button>
                        </li> -->
                        <!-- <li>
                <Button label="Register" :onClick="redirectToRegister" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button>
                </li> -->
                    </ul>
                    <div class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Button label="Login" :onClick="redirectToLogin" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button>
                        <!-- <Button label="Register" :onClick="redirectToRegister" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button> -->
                    </div>
                </div>
            </div>


  <!-- Map Container -->
  <div class="map-container">
    <div id="map">
      <a
        href="https://www.maptiler.com"
        style="position: absolute; left: 10px; bottom: 10px; z-index: 999;"
      >
        <img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" />
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
  import { useRouter } from 'vue-router';
  export default {
    mounted() {
      this.initializeMap();
      this.addGeoJSONLayer();
    },
    methods: {
      redirectToHome() {
      // Assuming you are using Vue Router, you can navigate to the "landing" route
      this.$router.push({ name: 'landing' });
    },
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
              fillOpacity: 0, // Set the stroke width (optional)
            }),
            // Add more styles as needed
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
    top: 60px; /* Adjust the top position to leave space for the header */
    right: 0;
    bottom: 0px; /* Adjust the bottom position to leave space for the footer */
    left: 0;
    padding-top: 20px; /* Add padding to the top of the map container */
    padding-bottom: 40px; /* Add padding to the bottom of the map container */
  }

  /* Style for the header */
 
  /* Style for the footer */


  .social-icons a {
        margin-right: 10px;
        color: #333;
        /* Change color to your preference */
        font-size: 20px;
    }
    /* #hero {
                        background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #eeefaf 0%, #c3e3fa 100%);
                        height: 700px;
                        overflow: hidden;
                    } */
    @media screen and (min-width: 768px) {
        #hero {
            -webkit-clip-path: ellipse(150% 87% at 93% 13%);
            clip-path: ellipse(150% 87% at 93% 13%);
            height: relative;
        }
        #alamat {
            width: 500px;
            border-radius: 100px;
        }
        #bg-img {
            height: 81%;
            width: 81%;
            position: relative;
        }
    }
    @media screen and (min-width: 1300px) {
        #hero>img {
            position: relative;
            max-width: 450px;
        }
        #hero>div>p {
            max-width: 450px;
        }
    }
    @media screen and (max-width: 1300px) {
        #hero {
            -webkit-clip-path: ellipse(150% 87% at 93% 13%);
            clip-path: ellipse(150% 87% at 93% 13%);
            height: relative;
        }
        #hero>img {
            position: static;
            transform: scale(1);
            margin-left: auto;
            max-width: 450px;
            max-height: 450px;
        }
        #hero>div {
            width: 100%;
        }
        #hero>div>p {
            width: 100%;
            max-width: 100%;
        }
        #alamat {
            width: 100px;
            border-radius: 100px;
        }
        #bg-img {
            height: 45%;
            width: 45%;
            position: relative;
        }
    }
</style>

  