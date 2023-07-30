<script setup>
  import {
    useLayout
  } from '@/layout/composables/layout';
  import {
    computed,
    ref,
    onMounted
  } from 'vue';
  import {
    useRouter
  } from 'vue-router';
  import axios from 'axios';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  const {
    layoutConfig
  } = useLayout();
  const router = useRouter();
  const {
    wilayah,
    kodepos
  } = defineProps({
    wilayah: {
      type: String,
      required: false
    },
    kodepos: {
      type: String,
      required: false
    }
  });
  const map = ref(null);
  const datakodepos = ref({});
  const qrcode = ref(null);
  const getKodepos = async() => {
    try {
      const currentURL = router.currentRoute.value.path;
      const detailIndex = currentURL.indexOf('detail/') + 'detail/'.length;
      const remainingURL = currentURL.slice(detailIndex);
      const letterCount = remainingURL.length;
      let url = '';
      
      if (kodepos || letterCount < 11) {
      // Jika letterCount adalah 10, itu berarti URL mengandung kodepos (misal: /detail/12345)
      const kodepos = remainingURL;

      url = `/api/kode-pos/kodepos/${kodepos}`;
    } else if(wilayah || letterCount > 10) {
      // Jika letterCount lebih besar dari 10, itu berarti URL mengandung wilayah (misal: /detail/desa,kecamatan,kabupaten,provinsi)
      const wilayah = remainingURL;
      const [desa, kecamatan, kabupaten, provinsi] = wilayah.split(',');
      url = `/api/kode-pos/allprovinsi/${provinsi}/${kabupaten}/${kecamatan}/${desa}`;
    } else {
      console.error('Invalid parameters');
      return;
    }
      const response = await axios.get(url);
      datakodepos.value = response.data.data;
      qrcode.value = response.data.qrcode;
      const {
        latitude,
        longitude,
        geojson
      } = response.data;
      // Create Leaflet map
      map.value = L.map('map').setView([latitude, longitude], 12);
    L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=id&x={x}&y={y}&z={z}', {
      attribution: 'Map data &copy; <a href="https://www.google.com/maps">GoogleMaps</a> contributors',
    }).addTo(map.value);

    const geometry = JSON.parse(response.data.geojson);

    // Define style for the polygon's outline (garis batas)
    const polygonStyle = {
  color: 'black', // Mengatur warna garis menjadi hitam
  weight: 1, // Mengatur ketebalan garis
  fillOpacity: 0, // Mengatur opacity isi poligon menjadi 0 (transparan)
};

    const geoJSONLayer = L.geoJSON(geometry, {
      style: polygonStyle, // Menetapkan style yang telah didefinisikan
    }).addTo(map.value);
    } catch (error) {
      console.error(error);
    }
  };
  onMounted(getKodepos);
  const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  };
  const logoUrl = computed(() => {
    return router.resolve({
      name: 'landing'
    }).href;
  });
  const redirectToLogin = () => {
    router.push({
      name: 'login'
    });
  };
  const printQRCode = () => {
  const qrcodeImg = qrcode.value;
  const printWindow = window.open('', '', 'width=600,height=600');
  printWindow.document.write('<html><head><title>QR Code</title></head><body>');
  
  // Menambahkan logo di atas gambar QR code
  printWindow.document.write('<div style="text-align: center; padding: 10px;">');
  printWindow.document.write('<img src="/demo/images/login/kominfoo.png" alt="logo" height="50" class="mr-0 lg:mr-2" />');
  printWindow.document.write('</div>');
  
  printWindow.document.write(`<img src="data:image/;base64,${qrcodeImg}" style="width:100%;" />`);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
};

</script>



<template>
  <div class="surface-0 flex justify-content-center">
    <div id="home" class="landing-wrapper overflow-hidden">
      <div class="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static mb-3">
        <a class="flex align-items-center w-full" :href="logoUrl">
          <img src="/demo/images/login/kominfoo.png" alt="logo" height="50" class="mr-0 lg:mr-2" />
          <div class="layout-topbar-content w-full">
            <h1>KEMKOMINFO RI</h1>
            <h5>Menuju Masyarakat Informasi Indonesia</h5>
          </div>
        </a>
        <a class="cursor-pointer block lg:hidden text-700 p-ripple" v-ripple v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
          <i class="pi pi-bars text-4xl"></i>
        </a>
        <div class="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2" style="top: 120px">
          <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
          </ul>
          <div class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
            <Button label="Login" :onClick="redirectToLogin" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button>
          </div>
        </div>
      </div>
      <div id="highlights" class="py-4 px-4 mx-0 md:mx-8">
        <h1 class="text-900 font-normal mb-2">Kode Pos Desa/Keluarahan {{ datakodepos.nama_desa }} </h1>
        <div class="pb-6 rounded-b">
          <p class="my-6">Berikut ini adalah informasi untuk kelurahan {{ datakodepos.nama_desa}}, {{ datakodepos.nama_kecamatan }}, {{ datakodepos.nama_kabupaten }}, {{ datakodepos.nama_provinsi }}, {{ datakodepos.kode_new }}
            <!-- -->:</p>
            <div class="block md:flex gap-4">
            <div class="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0" style="border-radius: 8px">
              <!-- <img src="/demo/images/landing/mockup.svg" class="w-11" alt="mockup mobile" /> -->
              <div id="map"></div>
            </div>
            <br>
            <div class="w-auto max-w-[100%] overflow-x-auto">
              <center>
                <h2 class="text-900 font-normal mb-2">Details</h2>
                <img id="qrcode" v-bind:src="'data:image/;base64,' + qrcode" />
                <br>
              
                <Button label="Cetak QR Code" @click="printQRCode"  class="p-button-rounded border-none font-light text-white line-height-2 bg-blue-500"></Button>
          
              </center>
              <br>
              <table class="custom-table">
        <tbody>
            <tr class="odd-bg">
                <td class="font-bold px-2 py-3">Kode Pos</td>
                <td class="px-2 py-3">{{ datakodepos.kode_new }}</td>
                <td class="font-bold px-2 py-3">Jumlah Penduduk</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_penduduk }}</td>
            </tr>
            <tr class="even-bg">
                <td class="font-bold px-2 py-3">Kode Pos Lama</td>
                <td class="px-2 py-3">{{ datakodepos.kode_old }}</td>
                <td class="font-bold px-2 py-3">Jumlah Fasilitas Pendidikan</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_fasilitas_pendidikan }}</td>
            </tr>
            <tr class="odd-bg">
                <td class="font-bold px-2 py-3">Kode Wilayah</td>
                <td class="px-2 py-3">{{ datakodepos.kode_dagri }}</td>
                <td class="font-bold px-2 py-3">Jumlah Fasilitas Ibadah</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_fasilitas_ibadah }}</td>
            </tr>
            <tr class="even-bg">
                <td class="font-bold px-2 py-3">Kelurahan/Desa</td>
                <td class="px-2 py-3">{{ datakodepos.nama_desa }}</td>
                <td class="font-bold px-2 py-3">Jumlah Tempat Wisata</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_tempat_wisata }}</td>
            </tr>
            <tr class="odd-bg">
                <td class="font-bold px-2 py-3">Kecamatan</td>
                <td class="px-2 py-3">{{ datakodepos.nama_kecamatan }}</td>
                <td class="font-bold px-2 py-3">Jumlah Industri Kecil</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_industri_kecil }}</td>
            </tr>
            <tr class="even-bg">
                <td class="font-bold px-2 py-3">Kota</td>
                <td class="px-2 py-3">{{ datakodepos.nama_kabupaten }}</td>
                <td class="font-bold px-2 py-3">Jumlah Menera Seluler</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_bts }}</td>
                <td class="px-2 py-3"></td>
            </tr>
            <tr class="odd-bg">
                <td class="font-bold px-2 py-3">Provinsi</td>
                <td class="px-2 py-3">{{ datakodepos.nama_provinsi }}</td>
                <td class="font-bold px-2 py-3">Jumlah Operator</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_operator }}</td>
                <td class="px-2 py-3"></td>
            </tr>
            <tr class="odd-bg">
               <!-- Tambahkan sel kosong untuk kolom sampingnya -->
               <td class="font-bold px-2 py-3"></td>
                <td class="px-2 py-3"></td>

                <td class="font-bold px-2 py-3">Jumlah Kantor Pos</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_kantor_pos }}</td>
                <td class="px-2 py-3"></td>
            </tr>
            <tr class="odd-bg">
               <!-- Tambahkan sel kosong untuk kolom sampingnya -->
                <td class="font-bold px-2 py-3"></td>
                <td class="px-2 py-3"></td>

                <td class="font-bold px-2 py-3">Jumlah Kurir Logistik</td>
                <td class="px-2 py-3">{{ datakodepos.jumlah_kurlog }}</td>
                <td class="px-2 py-3"></td>
            </tr>
        </tbody>
    </table>            </div>
           
          </div>
        </div>
      </div>
      <div class="py-4 px-4 mx-0 mt-8 lg:mx-8">
        <div class="grid justify-content-between">
          <div class="copyright">
            <p>© QRKODEPOS. All Rights Reserved.</p>
          </div>
          <div class="col-xl-3 col-md-6">
            <div class="social-icons">
              <a href="#" target="_blank">
                <i class="pi pi-facebook"></i>
              </a>
              <a href="#" target="_blank">
                <i class="pi pi-twitter"></i>
              </a>
              <a href="#" target="_blank">
                <i class="pi pi-instagram"></i>
              </a>
              <a href="#" target="_blank">
                <i class="pi pi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppConfig simple />
</template>

<style scoped>
  /* Add your custom CSS styles here */
  .custom-table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    table-layout: auto;
  }
  .custom-table th,
  .custom-table td {
    width: auto;
    padding: 1px;
    border-bottom: 1px solid #ccc;
  }
  .odd-bg {
    background-color: #f0f0f0;
    /* Light Gray Background */
  }
  .even-bg {
    background-color: #fff;
    /* White Background */
  }
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
    /* #hero {
                  -webkit-clip-path: ellipse(150% 87% at 93% 13%);
                  clip-path: ellipse(150% 87% at 93% 13%);
                  height: 530px;
              } */
    #map {
      height: 100%;
      width: 100%;
      border-radius: 10px;
    }
    #qrcode {
      width: 200px;
      height: 200px;
      border-radius: 20px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  @media screen and (min-width: 1300px) {
    #hero>img {
      position: absolute;
      max-width: 450px;
    }
    #hero>div>p {
      max-width: 450px;
    }
  }
  @media screen and (min-width: 1000px) {
    #hero>img {
      position: absolute;
      max-width: 450px;
    }
    #hero>div>p {
      max-width: 450px;
    }
    #map {
      height: 100%;
      width: 600px;
      border-radius: 10px;
    }
    #qrcode {
      width: 200px;
      height: 200px;
      border-radius: 10px;
    }
  }
  @media screen and (max-width: 1300px) {
    #hero {
      height: 600px;
      width: 600px;
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
    #map {
      height: 400px;
      width: 100%;
      border-radius: 10px;
    }
    #qrcode {
      width: 200px;
      height: 200px;
      border-radius: 20px;
    }
  }
</style>


