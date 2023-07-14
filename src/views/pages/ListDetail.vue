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
  const desas = ref(null);
  const datakodepos = ref({});
  const qrcode = ref(null);
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
      L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=id&x={x}&y={y}&z={z}').addTo(map.value);
      var geoJSONLayer = L.geoJSON().addTo(map.value);
      var geometry = JSON.parse(response.data.geojson);
      geoJSONLayer.addData(geometry);
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
    printWindow.document.write('<img src="data:image/;base64,' + qrcodeImg + '" style="width:100%;" />');
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
      <div id="highlights" class="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
        <div class="pb-6 rounded-b">
          <p class="my-6">Berikut ini adalah informasi untuk kelurahan {{ datakodepos.nama_kecamatan }}, {{ datakodepos.nama_kabupaten }}, {{ datakodepos.nama_provinsi }}, {{ datakodepos.kode_new }}:</p>
          <div class="block md:flex gap-6">
            <div class="w-auto max-w-[100%] overflow-x-auto mb-6">
              <center>
                <img v-bind:src="'data:image/;base64,' + qrcode" style="width: 100px; height: 100px;" />
                <button class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500" @click="printQRCode">Cetak QR Code</button>
              </center>
              <table class="w-full text-sm">
                <tbody>
                  <tr class="odd:bg-neutral-100">
                    <td class="font-bold px-6 py-3">Kode Pos Lama</td>
                    <td class="px-6 py-3">{{ datakodepos.kode_old }}</td>
                  </tr>
                  <tr class="odd:bg-neutral-100">
                    <td class="font-bold px-6 py-3">Kecamatan</td>
                    <td class="px-6 py-3">{{ datakodepos.nama_kecamatan }}</td>
                  </tr>
                  <tr class="odd:bg-neutral-100">
                    <td class="font-bold px-6 py-3">Kota</td>
                    <td class="px-6 py-3">{{ datakodepos.nama_kabupaten }}</td>
                  </tr>
                  <tr class="odd:bg-neutral-100">
                    <td class="font-bold px-6 py-3">Provinsi</td>
                    <td class="px-6 py-3">{{ datakodepos.nama_provinsi }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0" style="border-radius: 8px">
              <!-- <img src="/demo/images/landing/mockup.svg" class="w-11" alt="mockup mobile" /> -->
              <div id="map" style="height: 100%; width: 400px;"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="py-4 px-4 mx-0 mt-8 lg:mx-8">
        <DataTable ref="dt" :value="desas" dataKey="id" :paginator="true" :rows="10" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} kabupatens" responsiveLayout="scroll">
          <Column field="kode_desa" header="kode Pos Baru" :sortable="true" headerStyle="width:40%; min-width:10rem;">
            <template #body="slotProps">
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
          <div class="col-12 md:col-2" style="margin-top: -1.5rem">
            <a @click="smoothScroll('#home')" class="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
              <img :src="logoUrl" alt="footer sections" width="50" height="50" class="mr-2" />
              <h4 class="font-medium text-3xl text-900">SAKAI</h4>
            </a>
          </div>
          <div class="col-12 md:col-10 lg:col-7">
            <div class="grid text-center md:text-left">
              <div class="col-12 md:col-3">
                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">About Us</a>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">News</a>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Investor Relations</a>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Careers</a>
                <a class="line-height-3 text-xl block cursor-pointer text-700">Media Kit</a>
              </div>
              <div class="col-12 md:col-3 mt-4 md:mt-0">
                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Get Started</a>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Learn</a>
                <a class="line-height-3 text-xl block cursor-pointer text-700">Case Studies</a>
              </div>
              <div class="col-12 md:col-3 mt-4 md:mt-0">
                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Community</h4>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Discord</a>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Events<img src="/demo/images/landing/new-badge.svg" class="ml-2" /></a>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">FAQ</a>
                <a class="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
              </div>
              <div class="col-12 md:col-3 mt-4 md:mt-0">
                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Brand Policy</a>
                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Privacy Policy</a>
                <a class="line-height-3 text-xl block cursor-pointer text-700">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppConfig simple />
</template>



