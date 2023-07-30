<script setup>
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

  import {
    useLayout
  } from '@/layout/composables/layout';
  import {
    computed,
    ref,
    onMounted, onBeforeMount 
  } from 'vue';
  import {
    useRouter
  } from 'vue-router';
  import axios from 'axios';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';


  const toast = useToast();
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
  const desas = ref(null);
  const datakodepos = ref({});
  const qrcode = ref(null);
  const filters = ref({});
  onBeforeMount(() => {
  initFilters();
});
  const getKodepos = async() => {
    try {
      let url = '';
      if (wilayah) {
        const dataWilayah = wilayah;
        const [desa, kecamatan, kabupaten, provinsi] = dataWilayah.split(',');
        url = `/api/kode-pos/allprovinsi/${provinsi}/${kabupaten}/${kecamatan}/${desa}`;
      } else if (kodepos) {
        url = `/api/kode-pos/kodepos/${kodepos}`;
      } else {
        console.error('Invalid parameters');
        return;
      }
      const response = await axios.get(url);
      datakodepos.value = response.data.data;
      desas.value = response.data.data.desas;
      console.log(desas);
      qrcode.value = response.data.qrcode;
      var latitude = response.data.latitude;
      var longitude = response.data.longitude;
      // Create Leaflet map
      map.value = L.map('map').setView([latitude, longitude], 11);
      L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=id&x={x}&y={y}&z={z}', {
            attribution: 'Map data &copy; <a href="https://www.google.com/maps">GoogleMaps</a> contributors'
        }).addTo(map.value);

        const polygonStyle = {
  color: 'black', // Mengatur warna garis menjadi hitam
  weight: 1, // Mengatur ketebalan garis
  fillOpacity: 0, // Mengatur opacity isi poligon menjadi 0 (transparan)
};

   var geoJSONLayer = L.geoJSON(geometry, {
      style: polygonStyle, // Menetapkan style yang telah didefinisikan
    }).addTo(map.value);
      // var geoJSONLayer = L.geoJSON().addTo(map.value);
      var geometry = JSON.parse(response.data.geojson);
      geoJSONLayer.addData(geometry);
      // Tambahkan event listener untuk 'click' pada lapisan GeoJSON
    geoJSONLayer.eachLayer((layer) => {
      // Ambil properti dari fitur saat ini
      const properties = layer.feature.properties;

      // Buat isi popup dengan properti yang diambil
      const popupContent = `
        <div>
          <h4>Kode Pos: ${properties.kode_pos}</h4>
          <h5>Kode dagri: ${properties.kode_dagri}</h5>
          <h5>Nama Desa: ${properties.nama_desa}</h5>
        </div>
      `;

      // Tambahkan event listener 'click' pada layer
      layer.on('click', () => {
        // Tampilkan popup dengan isi konten yang telah dibuat
        layer.bindPopup(popupContent).openPopup();
      });
    });
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
  
  // Menambahkan logo dan teks di atas gambar QR code
  printWindow.document.write('<div style="text-align: center; padding: 10px;">');
    printWindow.document.write('<img src="/demo/images/login/kominfoo.png" alt="logo" height="100px" class="mr-0 lg:mr-2" />');
    printWindow.document.write('<div class="layout-topbar-content w-full">');
  printWindow.document.write('<h4>KEMKOMINFO RI</h1>');
  printWindow.document.write('<h5>Menuju Masyarakat Informasi Indonesia</h5>');
  printWindow.document.write('</div>');
  printWindow.document.write('</div>');
  
  printWindow.document.write(`<img src="data:image/;base64,${qrcodeImg}" style="width:100%;" />`);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
};

  const showDetail = (data) => {
    const kodepos = data.kode_new;
    router.push({
      name: 'detail-kodepos',
      params: {
        kodepos
      }
    });
  };
  const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
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
            <!-- Add navigation items dynamically using v-for -->
          </ul>
          <div class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
            <Button label="Login" :onClick="redirectToLogin" class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button>
          </div>
        </div>
      </div>
      <div id="highlights" class="py-4 px-4 mx-0 md:mx-8">
        <h1 class="text-900 font-normal mb-2">Wilayah Kode Pos {{ datakodepos.kode_old }} </h1>
        <div class="pb-6 rounded-b">
          <p class="my-6">Berikut ini adalah informasi untuk kelurahan {{ datakodepos.nama_kecamatan }}, {{ datakodepos.nama_kabupaten }}, {{ datakodepos.nama_provinsi }}, {{ datakodepos.kode_old }}:</p>
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
                    <td class="font-bold px-6 py-3">Kode Pos Lama</td>
                    <td class="px-6 py-3">{{ datakodepos.kode_old }}</td>
                  </tr>
                  <tr class="even-bg">
                    <td class="font-bold px-6 py-3">Kecamatan</td>
                    <td class="px-6 py-3">{{ datakodepos.nama_kecamatan }}</td>
                  </tr>
                  <tr class="odd-bg">
                    <td class="font-bold px-6 py-3">Kota</td>
                    <td class="px-6 py-3">{{ datakodepos.nama_kabupaten }}</td>
                  </tr>
                  <tr class="even-bg">
                    <td class="font-bold px-6 py-3">Provinsi</td>
                    <td class="px-6 py-3">{{ datakodepos.nama_provinsi }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="py-4 px-4 mx-0 md:mx-8">
        <h2 class="text-900 font-normal mb-2">Daftar Desa/Kelurahan</h2>
        <DataTable ref="dt"
  :value="desas"
  dataKey="id"
  :paginator="true"
  :rows="10" 
  :filters="filters"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  :rowsPerPageOptions="[5, 10, 25]"
  :totalRecords="totalData"
  :loading="loading"
  :currentPageReportTemplate="'Showing {first} to {last} of ' + totalData + ' provinsis'"
  :loadingIcon="loadingIcon"
  responsiveLayout="scroll">
  <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Desa</h5>
                        <span class="block mt-2 md:mt-0 p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                        </div>
                    </template>
          <Column field="kode_desa" header="kode Pos Baru" :sortable="true" headerStyle="width:40%; min-width:10rem;">
            <template #body="slotProps" >
                      <span class="p-column-title">Kode Pos Baru</span>
                      {{ slotProps.data.kode_new }}
    </template>
          </Column>
          <Column field="kode_desa" header="kode desa" :sortable="true" headerStyle="width:40%; min-width:10rem;">
<template #body="slotProps">
  <span class="p-column-title">Kode Desa</span>
  {{ slotProps.data.kode_dagri }}
</template>
          </Column>
          <Column field="nama_desa" header="nama desa" :sortable="true" headerStyle="width:40%; min-width:10rem;">
<template #body="slotProps">
  <span class="p-column-title">Nama Desa</span>
  {{ slotProps.data.nama_desa }}
</template>
          </Column>
          <Column headerStyle="min-width:10rem;">
<template #body="slotProps">
  <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" @click="showDetail(slotProps.data)" />
</template>

</Column>
        </DataTable>
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
  }
  .custom-table th,
  .custom-table td {
    padding: 10px;
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
      width: 500px;
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
      width: 500px;
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

