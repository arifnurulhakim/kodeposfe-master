<script setup>
    import {
        useLayout
    } from '@/layout/composables/layout';
    import {
        computed,
        onMounted,
        ref,
        watch
    } from 'vue';
    import AppConfig from '@/layout/AppConfig.vue';
    import {
        useRouter
    } from 'vue-router';
    import axios from 'axios';
    const {
        layoutConfig
    } = useLayout();
    const router = useRouter();
    const datakodepos = ref({});
    const selectedProvinsi = ref('');
    const selectedWilayah = ref('');
    const selectedKabupaten = ref('');
    const selectedKecamatan = ref('');
    const selectedDesa = ref('');
    const selectedKodepos = ref('');
    const provinsiList = ref([]);
    const wilayahList = ref([]);
    const kabupatenList = ref([]);
    const kecamatanList = ref([]);
    const desaList = ref([]);
    const kodeposList = ref([]);
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
    const redirectToMap = () => {
        router.push({
            name: 'map'
        });
    };
    const getProvinsi = async() => {
        try {
            const response = await axios.get('/api/allprovinsis');
            provinsiList.value = response.data.data.map(provinsi => provinsi.nama_provinsi);
        } catch (error) {
            console.error(error);
        }
    };
    const getWilayah = async() => {
        try {
            const response = await axios.get('/api/kode-pos/wilayah');
            wilayahList.value = response.data.data.map(wilayah => wilayah.wilayah);
        } catch (error) {
            console.error(error);
        }
    };
    const getKodepos = async() => {
        try {
            const response = await axios.get(`/api/kode-pos/allprovinsi/${selectedKodepos.value}`);
            provinsiList.value = response.data.data.map(provinsi => provinsi.nama_provinsi);
        } catch (error) {
            console.error(error);
        }
    };
    const getKabupaten = async() => {
        selectedKabupaten.value = '';
        selectedKecamatan.value = '';
        selectedDesa.value = '';
        kabupatenList.value = [];
        kecamatanList.value = [];
        desaList.value = [];
        try {
            const response = await axios.get(`/api/kode-pos/allprovinsi/${selectedProvinsi.value}`);
            kabupatenList.value = response.data.data.map(kabupaten => kabupaten.nama_kabupaten);
        } catch (error) {
            console.error(error);
        }
    };
    const getKecamatan = async() => {
        selectedKecamatan.value = '';
        selectedDesa.value = '';
        kecamatanList.value = [];
        desaList.value = [];
        try {
            const response = await axios.get(`/api/kode-pos/allprovinsi/${selectedProvinsi.value}/${selectedKabupaten.value}`);
            kecamatanList.value = response.data.data.map(kecamatan => kecamatan.nama_kecamatan);
        } catch (error) {
            console.error(error);
        }
    };
    const getDesa = async() => {
        selectedDesa.value = '';
        desaList.value = [];
        try {
            const response = await axios.get(`/api/kode-pos/allprovinsi/${selectedProvinsi.value}/${selectedKabupaten.value}/${selectedKecamatan.value}`);
            desaList.value = response.data.data.map(desa => desa.nama_desa);
        } catch (error) {
            console.error(error);
        }
    };
    const submitForm = () => {
        const getkodepos = selectedKodepos.value;
        const getdesa = selectedDesa.value;
        const getkecamatan = selectedKecamatan.value;
        const getkabupaten = selectedKabupaten.value;
        const getprovinsi = selectedProvinsi.value;
        const kodepos = selectedKodepos.value;
        const getwilayah = selectedWilayah.value;
        if (getkodepos) {
            if (kodepos.length !== 5 && kodepos.length !== 7 && kodepos.length !== 10) {
                // Kode pos tidak sesuai dengan panjang yang diizinkan
                const errorMessage = "Kode pos harus terdiri dari 5 digit untuk kodepos lama, 7 untuk kodepos baru, atau 10 digit untuk kodepos dagri.";
                // Tampilkan pesan kesalahan
                alert(errorMessage);
                return;
            } else {
                axios.get(`/api/kode-pos/kodepos/${kodepos}`)
                    .then(response => {
                        datakodepos.value = response.data.data; // Menggunakan datakodepos.value untuk mengatur nilainya
                        console.log(datakodepos.value); // Lakukan sesuatu dengan data kode pos yang diterima
                        if (datakodepos.value === null) {
                            const errorMessage = "Kode pos tidak ditemukan.";
                            // Tampilkan pesan kodepos tidak ditemukan
                            alert(errorMessage);
                            return;
                        } else {
                            if (kodepos.length == 5) {
                                router.push({
                                    name: 'detail-kodepos5',
                                    params: {
                                        kodepos
                                    }
                                });
                            } else {
                                router.push({
                                    name: 'detail-kodepos',
                                    params: {
                                        kodepos
                                    }
                                });
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        } else if (getwilayah) {
            const wilayahArray = getwilayah.split(',%20'); // Pisahkan setiap bagian wilayah berdasarkan ',%20'
            const decodedWilayahArray = wilayahArray.map(part => decodeURIComponent(part)); // Decode setiap bagian wilayah
            const wilayah = decodedWilayahArray.reverse().join('/'); // Balikkan array wilayah dan gabungkan dengan '/'
            console.log(wilayah);
            router.push({
                name: 'detail-location',
                params: {
                    wilayah
                }
            });
        } else {
            const selectedValues = [
                selectedDesa.value,
                selectedKecamatan.value,
                selectedKabupaten.value,
                selectedProvinsi.value,
                selectedWilayah.value
            ];
            const wilayah = selectedValues.join(', ');
            router.push({
                name: 'detail-location',
                params: {
                    wilayah
                }
            });
        }
    };
    function validateKodepos(input) {
        // Check if the input has 'data-kodepos' attribute
        if (input.hasAttribute('data-kodepos')) {
            const value = input.value;
            const length = value.length;
            if (length !== 5 && length !== 7 && length !== 10) {
                input.setCustomValidity("Kode pos harus terdiri dari 5, 7, atau 10 digit.");
            } else {
                input.setCustomValidity("");
            }
        }
    };
    onMounted(async() => {
        await getProvinsi();
    });
    onMounted(async() => {
        await getWilayah();
    });
    watch(selectedProvinsi, () => {
        getKabupaten();
    });
    watch(selectedKabupaten, () => {
        getKecamatan();
    });
    watch(selectedKecamatan, () => {
        getDesa();
    });
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
                <div class="align-items-center surface-0 flex-grow-1 justify-content-end hidden lg:flex relative lg:static w-full left-0 px-6 lg:px-0 z-2" style="top: 120px">
                    <ul class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column flex-row-reverse lg:flex-row cursor-pointer">
                        <li>
                            <a label="Map" :onClick="redirectToMap" class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Search by Map</span>
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
            <div id="hero" class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden" style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)">
                <div class="mx-4 md:mx-8 mt-0 md:mt-4">
                    <h1 class="text-6xl font-bold text-gray-900 line-height-2"><span class="font-light block"></span>Kode Pos Indonesia</h1>
                    <p class="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">Temukan informasi lengkap kode pos seluruh daerah Indonesia dengan mudah</p>
                    <div class="card pt-1 pb-1 pr-1 pl-1 inline-flex items-center justify-center h-auto rounded-full text-center" style="border-radius: 100px;">
                        <!-- <input type="text" placeholder="Alamat" id="alamat" class="border-none m-0 font-normal line-height-3 m-1 p-0 rounded-full text-center" > -->
                        <input type="text" list="provinsiOptions" v-model="selectedProvinsi" @input="onProvinsiChange" :disabled="selectedWilayah !== ''||selectedKodepos !== ''" placeholder="Provinsi" class="border-none m-0 font-normal line-height-3 m-1 p-0 rounded-full text-center"
                            style="border-radius: 100px;" />
                        <datalist id="provinsiOptions">
                <option v-for="provinsi in provinsiList" :value="provinsi" :key="provinsi">
                  {{ provinsi }}
                </option>
              </datalist>
                        <input type="text" list="kabupatenOptions" v-model="selectedKabupaten" @input="getKecamatan" :disabled="selectedWilayah !== ''||selectedKodepos !== ''" placeholder="Kabupaten" class="border-none m-0 font-normal line-height-3 m-1 p-0 rounded-full text-center"
                            style="border-radius: 100px;">
                        <datalist id="kabupatenOptions">
                            <option v-for="kabupaten in kabupatenList" :value="kabupaten">{{ kabupaten }}</option>
                        </datalist>
                        <input type="text" list="kecamatanOptions" v-model="selectedKecamatan" @input="getDesa" :disabled="selectedWilayah !== ''||selectedKodepos !== ''" placeholder="Kecamatan" class="border-none m-0 font-normal line-height-3 m-1 p-0 rounded-full text-center"
                            style="border-radius: 100px;">
                        <datalist id="kecamatanOptions">
                            <option v-for="kecamatan in kecamatanList" :value="kecamatan">{{ kecamatan }}</option>
                        </datalist>
                        <input type="text" list="desaOptions" v-model="selectedDesa" :disabled="selectedWilayah !== ''||selectedKodepos !== ''" placeholder="Desa" class="border-none m-0 font-normal line-height-3 m-1 p-0 rounded-full text-center" style="border-radius: 100px;">
                        <datalist id="desaOptions">
                            <option v-for="desa in desaList" :value="desa">{{ desa }}</option>
                        </datalist>
                        <br>
                        <input type="text" list="wilayahOptions" v-model="selectedWilayah" @input="onWilayahChange" :disabled="selectedProvinsi !== ''||selectedKodepos !== ''" placeholder="Wilayah" class="border-none m-0 font-normal line-height-3 m-1 p-0 rounded-full text-center"
                            style="border-radius: 100px;" />
                        <datalist id="wilayahOptions">
                <option v-for="wilayah in wilayahList" :value="wilayah" :key="wilayah">
                  {{ wilayah }}
                </option>
              </datalist>
                        <input type="text" v-model="selectedKodepos" :disabled="selectedWilayah !== '' || selectedProvinsi !== ''" placeholder="Kode Pos" class="border-none m-0 font-normal line-height-3 m-1 p-0 rounded-full text-center" style="border-radius: 100px;" maxlength="10"
                        />
                        <Button class="p-button-rounded text-xl border-none m-0 bg-blue-500 font-normal text-white line-height-3 px-3" @click="submitForm"><i class="pi pi-search" style="font-size: 2rem"></i> </Button>
                    </div>
                </div>
                <div class="flex justify-content-center" style="height: 600px; text-align: center;">
                    <img id="bg-img" src="/demo/images/landing/indo.png" alt="Hero Image" class="w-9 md:w-auto" />
                </div>
            </div>
            <!-- <div id="features" class="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                                        <div class="grid justify-content-center">
                                            <div class="col-12 text-center mt-8 mb-4">
                                                <h2 class="text-900 font-normal mb-2">Marvelous Features</h2>
                                                <span class="text-600 text-2xl">Placerat in egestas erat...</span>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-yellow-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-users text-2xl text-yellow-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Easy to Use</h5>
                                                        <span class="text-600">Posuere morbi leo urna molestie.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-cyan-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-palette text-2xl text-cyan-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Fresh Design</h5>
                                                        <span class="text-600">Semper risus in hendrerit.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-indigo-200" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-map text-2xl text-indigo-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Well Documented</h5>
                                                        <span class="text-600">Non arcu risus quis varius quam quisque.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(145, 210, 204, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-bluegray-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-id-card text-2xl text-bluegray-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Responsive Layout</h5>
                                                        <span class="text-600">Nulla malesuada pellentesque elit.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2), rgba(160, 210, 250, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-orange-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-star text-2xl text-orange-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Clean Code</h5>
                                                        <span class="text-600">Condimentum lacinia quis vel eros.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg:pb-5 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-pink-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-moon text-2xl text-pink-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Dark Mode</h5>
                                                        <span class="text-600">Convallis tellus id interdum velit laoreet.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-teal-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-shopping-cart text-2xl text-teal-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Ready to Use</h5>
                                                        <span class="text-600">Mauris sit amet massa vitae.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg:pr-5 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-blue-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-globe text-2xl text-blue-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Modern Practices</h5>
                                                        <span class="text-600">Elementum nibh tellus molestie nunc non.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-12 lg:col-4 p-0 lg-4 mt-4 lg:mt-0">
                                                <div
                                                    style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))"
                                                >
                                                    <div class="p-3 surface-card h-full" style="border-radius: 8px">
                                                        <div class="flex align-items-center justify-content-center bg-purple-200 mb-3" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                                            <i class="pi pi-fw pi-eye text-2xl text-purple-700"></i>
                                                        </div>
                                                        <h5 class="mb-2 text-900">Privacy</h5>
                                                        <span class="text-600">Neque egestas congue quisque.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                class="col-12 mt-8 mb-8 p-2 md:p-8"
                                                style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%)"
                                            >
                                                <div class="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                                                    <h3 class="text-gray-900 mb-2">Joséphine Miller</h3>
                                                    <span class="text-gray-600 text-2xl">Peak Interactive</span>
                                                    <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-4" style="max-width: 800px">
                                                        “Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.”
                                                    </p>
                                                    <img src="/demo/images/landing/peak-logo.svg" class="mt-4" alt="Company logo" />
                                                </div>
                                            </div>
                                        </div>
                                    </div> -->
            <div id="highlights" class="py-4 px-4 lg:px-8 mx-0 my-6 lg:mx-8">
                <div class="grid mt-8 pb-2 md:pb-8">
                    <center>
                        <h2 class="text-900 font-normal mb-2">Tentang Kode Pos</h2><br>
                        <img src="/demo/images/landing/konten.png" class="w-11" alt="mockup mobile" /></center>
                    <!-- <div class="flex justify-content-center col-12 lg:col-6 bg-purple-100 p-0 flex-order-1 lg:flex-order-0" style="border-radius: 8px">
                                    </div> -->
                    <!-- <div class="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                                        <div class="flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                                            <i class="pi pi-fw pi-mobile text-5xl text-purple-700"></i>
                                        </div>
                                        <h2 class="line-height-1 text-900 text-4xl font-normal">Apa itu kode pos?</h2>
                                        <span class="text-700 text-2xl line-height-3 ml-0 md:ml-2" style="max-width: 650px">Kode pos disebut juga "postal code/zip code" yang berasal dari bahasa Inggris, yang secara harfiah berarti "kode pos". Sistem penomoran kode pos biasanya terdiri dari beberapa digit angka yang ditetapkan oleh pemerintah setempat atau oleh lembaga pos negara. Setiap digit angka tersebut biasanya mewakili suatu daerah atau wilayah tertentu.<br>
                        Kode pos sangat berguna untuk mempermudah proses pengiriman surat atau barang melalui jasa pos. Dengan menggunakan kode pos, maka alamat tujuan pengiriman bisa lebih spesifik dan tepat sasaran. Selain itu, kode pos juga bisa digunakan untuk mempermudah proses pencarian alamat di internet, seperti melalui layanan pencarian alamat atau aplikasi pemetaan.</span
                                                >
                                            </div> -->
                </div>
                <!-- <div class="grid my-8 pt-2 md:pt-8">
                                            <div class="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
                                                <div class="flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start" style="width: 4.2rem; height: 4.2rem; border-radius: 10px">
                                                    <i class="pi pi-fw pi-desktop text-5xl text-yellow-700"></i>
                                                </div>
                                                <h2 class="line-height-1 text-900 text-4xl font-normal">Celerisque Eu Ultrices</h2>
                                                <span class="text-700 text-2xl line-height-3 mr-0 md:mr-2" style="max-width: 650px"
                                                    >Adipiscing commodo elit at imperdiet dui. Viverra nibh cras pulvinar mattis nunc sed blandit libero. Suspendisse in est ante in. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi.</span
                                                >
                                            </div>
                                            <div class="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 bg-yellow-100 p-0" style="border-radius: 8px">
                                                <img src="/demo/images/landing/mockup-desktop.svg" class="w-11" alt="mockup" />
                                            </div>
                                        </div> -->
            </div>
            <!-- <div id="pricing" class="py-4 px-4 lg:px-8 my-2 md:my-4">
                                        <div class="text-center">
                                            <h2 class="text-900 font-normal mb-2">Matchless Pricing</h2>
                                            <span class="text-600 text-2xl">Amet consectetur adipiscing elit...</span>
                                    </div>
                                    <div class="grid justify-content-between mt-8 md:mt-0"> -->
            <!-- <div class="col-12 lg:col-4 p-0 md:p-3">
                                                <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                                                    <h3 class="text-900 text-center my-5">Free</h3>
                                                    <img src="/demo/images/landing/free.svg" class="w-10 h-10 mx-auto" alt="free" />
                                                    <div class="my-5 text-center">
                                                        <span class="text-5xl font-bold mr-2 text-900">$0</span>
                                                        <span class="text-600">per month</span>
                                                        <Button label="Get Started" class="block mx-auto mt-4 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                                                    </div>
                                                    <Divider class="w-full bg-surface-200"></Divider>
                                                    <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Responsive Layout</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">50 Support Ticket</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Free Shipping</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div> -->
            <!-- <div class="col-12 lg:col-4 p-0 md:p-3 mt-4 md:mt-0">
                                                <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                                                    <h3 class="text-900 text-center my-5">Startup</h3>
                                                    <img src="/demo/images/landing/startup.svg" class="w-10 h-10 mx-auto" alt="startup" />
                                                    <div class="my-5 text-center">
                                                        <span class="text-5xl font-bold mr-2 text-900">$1</span>
                                                        <span class="text-600">per month</span>
                                                        <Button label="Try Free" class="block mx-auto mt-4 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                                                    </div>
                                                    <Divider class="w-full bg-surface-200"></Divider>
                                                    <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Responsive Layout</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">50 Support Ticket</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Free Shipping</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div> -->
            <!-- <div class="col-12 lg:col-4 p-0 md:p-3 mt-4 md:mt-0">
                                                <div class="p-3 flex flex-column border-200 pricing-card cursor-pointer border-2 hover:border-primary transition-duration-300 transition-all" style="border-radius: 10px">
                                                    <h3 class="text-900 text-center my-5">Enterprise</h3>
                                                    <img src="/demo/images/landing/enterprise.svg" class="w-10 h-10 mx-auto" alt="enterprise" />
                                                    <div class="my-5 text-center">
                                                        <span class="text-5xl font-bold mr-2 text-900">$999</span>
                                                        <span class="text-600">per month</span>
                                                        <Button label="Get a Quote" class="block mx-auto mt-4 p-button-rounded border-none ml-3 font-light line-height-2 bg-blue-500 text-white"></Button>
                                                    </div>
                                                    <Divider class="w-full bg-surface-200"></Divider>
                                                    <ul class="my-5 list-none p-0 flex text-900 flex-column">
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Responsive Layout</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Unlimited Push Messages</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">50 Support Ticket</span>
                                                        </li>
                                                        <li class="py-2">
                                                            <i class="pi pi-fw pi-check text-xl text-cyan-500 mr-2"></i>
                                                            <span class="text-xl line-height-3">Free Shipping</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div> -->
            <!-- </div>
                                    </div> -->
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
                    <!-- <div class="col-12 md:col-10 lg:col-7">
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
                                                    </div> -->
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
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