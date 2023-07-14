<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const kodeposs = ref(null);
const kodeposDialog = ref(false);
const deleteKodeposDialog = ref(false);
const deleteKodepossDialog = ref(false);
const kodepos = ref({});
const selectedKodeposs = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const qrcodes = ref(null);
const base64Image = ref({});
const imageUrl = ref(null);
const qrcodekodeposDialog = ref(false);

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    getKodeposData();
});

const getKodeposData = () => {
    axios
        .get('api/kode-pos')
        .then((response) => {
            if (response.data.status === 'success') {
                kodeposs.value = response.data.data;
            }
        })
        .catch((error) => {
            console.error(error);
        });
};

const openNew = () => {
    kodepos.value = {};
    submitted.value = false;
    kodeposDialog.value = true;
};

const hideDialog = () => {
    kodeposDialog.value = false;
    submitted.value = false;
};

const saveKodepos = async () => {
    submitted.value = true;
    if (kodepos.value.kode_desa && kodepos.value.kode_old && kodepos.value.kode_mod && kodepos.value.kode_new && kodepos.value.kode_desa && kodepos.value.kode_kec && kodepos.value.kode_kab && kodepos.value.kode_prov ){
        console.log(kodepos.value.id);
      if (kodepos.value.id) {
        const index = findIndexById(kodepos.value.id);
        kodeposs.value[index] = kodepos.value;
        await axios.put(`/api/kode-pos/${kodepos.value.id}`, {
          kode_desa: kodepos.value.kode_desa,
          kode_old: kodepos.value.kode_old,
          kode_mod: kodepos.value.kode_mod,
          kode_new: kodepos.value.kode_new,
          kode_desa: kodepos.value.kode_desa,
          kode_kec: kodepos.value.kode_kec,
          kode_prov: kodepos.value.kode_prov,
        
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Kodepos Updated', life: 3000 });
        kodeposDialog.value = false;
      kodepos.value = {};
      } else {
        kodeposs.value.push(kodepos.value);
        await axios.post('/api/kode-pos', {
          kode_desa: kodepos.value.kode_desa,
          kode_old: kodepos.value.kode_old,
          kode_mod: kodepos.value.kode_mod,
          kode_new: kodepos.value.kode_new,
          kode_desa: kodepos.value.kode_desa,
          kode_kec: kodepos.value.kode_kec,
          kode_prov: kodepos.value.kode_prov,
          
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Kodepos Created', life: 3000 });
        kodeposDialog.value = false;
      kodepos.value = {};
      }
      kodeposDialog.value = false;
      kodepos.value = {};
    }
  };


const editKodepos = (editKodepos) => {
    kodepos.value = { ...editKodepos };
    console.log(kodepos);
    kodeposDialog.value = true;
};

const confirmDeleteKodepos = (editKodepos) => {
    kodepos.value = editKodepos;
    deleteKodeposDialog.value = true;
};

const deleteKodepos = async () => {
  try {
    await axios.delete(`/api/kode-pos/${kodepos.value.id}`);
    
    kodeposs.value = kodeposs.value.filter((val) => val.id !== kodepos.value.id);
    deleteKodeposDialog.value = false;
    kodepos.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Kodepos Deleted', life: 3000 });
  } catch (error) {
    // Handle any errors that occurred during the API request
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
  }
};


const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < kodeposs.value.length; i++) {
        if (kodeposs.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteKodepossDialog.value = true;
};
const deleteSelectedKodeposs = async () => {
  try {
    const selectedKodeposIds = selectedKodeposs.value.map((kodepos) => kodepos.id);
    await axios.delete(`/api/kodepos`, { data: { ids: selectedKodeposIds } });
    
    kodeposs.value = kodeposs.value.filter((val) => !selectedKodeposs.value.includes(val));
    deleteKodepossDialog.value = false;
    selectedKodeposs.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Kodeposs Deleted', life: 3000 });
  } catch (error) {
    // Handle any errors that occurred during the API request
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
  }
};


const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};
const generateQRCodeModal = (generateQRCodeModal) => {
  kodepos.value = { ...generateQRCodeModal };

  axios
    .get(`/api/kode-pos/qrcode/${kodepos.value.id}`)
    .then((response) => {
      qrcodes.value = response.data;
      console.log(qrcodes);
      base64Image.value = response.data.data.qrCode;

      console.log(base64Image);
      // imageUrl = `data:image/png;base64,${base64Image}`; // Adding the prefix "data:image/png;base64," to the base64 image URL
      qrcodekodeposDialog.value = true;

      // Assigning imageUrl to the imageUrl property
      generateQRCodeModal.imageUrl = imageUrl;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedKodeposs || !selectedKodeposs.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="kodeposs"
                    v-model:selection="selectedKodeposs"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} kodeposs"
                    responsiveLayout="scroll"
                    >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Kodepos</h5>
                        <span class="block mt-2 md:mt-0 p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                        </div>
                    </template>

                    <Column headerStyle="min-width:5rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-qrcode" class="p-button-rounded p-button-info mt-3" @click="generateQRCodeModal(slotProps.data)" />
                            
                        </template>

                    </Column>
                    <Column field="kode_dagri" header="kode dagri" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Dagri</span>
                        {{ slotProps.data.kode_dagri }}
                        </template>
                    </Column>
                    <Column field="kode_old" header="kode pos lama" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Pos Lama</span>
                        {{ slotProps.data.kode_old }}
                        </template>
                    </Column>
                    <Column field="kode_mod" header="kode pos modifikasi" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode pos modifikasi</span>
                        {{ slotProps.data.kode_mod }}
                        </template>
                    </Column>
                    <Column field="kode_new" header="kode pos baru" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode pos baru</span>
                        {{ slotProps.data.kode_new }}
                        </template>
                    </Column>
                    <Column field="nama_desa" header="nama desa" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Nama Desa</span>
                        {{ slotProps.data.nama_desa }}
                        </template>
                    </Column>
                    <Column field="nama_kecamatan" header="nama kecamatan" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Nama Kecamatan</span>
                        {{ slotProps.data.nama_kecamatan }}
                        </template>
                    </Column>
                    <Column field="nama_kabupaten" header="nama kabupaten" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Nama Kabupaten</span>
                        {{ slotProps.data.nama_kabupaten }}
                        </template>
                    </Column>
                    <Column field="nama_provinsi" header="nama provinsi" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Nama Provinsi</span>
                        {{ slotProps.data.nama_provinsi }}
                        </template>
                    </Column>
                  
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editKodepos(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteKodepos(slotProps.data)" />
                        </template>
                    </Column>
                    </DataTable>
                    <Dialog v-model:visible="qrcodekodeposDialog" :style="{ width: '450px' }" header="Kodepos Details" :modal="true" class="p-fluid">
                        <div class="col-12">
                          <div class="card">
                            <h5>DataView</h5>
                            <div class="data-container">
                              <img v-bind:src="'data:image/;base64,' + qrcodes.data.qrCode.base64" />

                              <!--  -->
                            </div>
                          </div>
                        </div>
                      </Dialog>

                    <Dialog v-model:visible="kodeposDialog" :style="{ width: '450px' }" header="Kodepos Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="kode_desa">Kode Dagri</label>
                        <InputText id="kode_desa" v-model.trim="kodepos.kode_desa" required="true" autofocus :class="{ 'p-invalid': submitted && !kodepos.kode_desa    }" />
                        <small class="p-invalid" v-if="submitted && !kodepos.kode_desa">Kode desa is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_old">Kode Lama</label>
                        <InputText id="kode_old" v-model.trim="kodepos.kode_old" required="true" autofocus :class="{ 'p-invalid': submitted && !kodepos.kode_desa    }" />
                        <small class="p-invalid" v-if="submitted && !kodepos.kode_old">Kode desa is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_mod">Kode Modifikasi</label>
                        <InputText id="kode_mod" v-model.trim="kodepos.kode_mod" required="true" autofocus :class="{ 'p-invalid': submitted && !kodepos.kode_desa    }" />
                        <small class="p-invalid" v-if="submitted && !kodepos.kode_mod">Kode desa is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_new">Kode Baru</label>
                        <InputText id="kode_new" v-model.trim="kodepos.kode_new" required="true" autofocus :class="{ 'p-invalid': submitted && !kodepos.kode_desa    }" />
                        <small class="p-invalid" v-if="submitted && !kodepos.kode_new">Kode desa is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_desa">Kode Desa</label>
                        <InputText id="kode_desa    " v-model.trim="kodepos.kode_desa  " required="true" autofocus :class="{ 'p-invalid': submitted && !kodepos.kode_desa    }" />
                        <small class="p-invalid" v-if="submitted && !kodepos.kode_desa ">Kode desa is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_kec">Kode Kecamatan</label>
                        <InputText id="kode_kec" v-model.trim="kodepos.kode_kec" required="true" autofocus :class="{ 'p-invalid': submitted && !kodepos.kode_kec }" />
                        <small class="p-invalid" v-if="submitted && !kodepos.kode_kec">Kode kecamatan is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_kab">Kode Kabupaten</label>
                        <InputText id="kode_kab" v-model.trim="kodepos.kode_kab" required="true" autofocus :class="{ 'p-invalid': submitted && !kodepos.kode_kab }" />
                        <small class="p-invalid" v-if="submitted && !kodepos.kode_kab">Kode kabupaten is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_prov">Kode Provinsi</label>
                        <InputText id="kode_prov" v-model.trim="kodepos.kode_prov" required="true" autofocus :class="{ 'p-invalid': submitted && !kodepos.kode_prov }" />
                        <small class="p-invalid" v-if="submitted && !kodepos.kode_prov">Kode Provinsi is required.</small>
                    </div>
                    

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveKodepos" />
                    </template>
                    </Dialog>

                <Dialog v-model:visible="deleteKodeposDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="kodepos"
                            >Are you sure you want to delete <b>{{ kodepos.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteKodeposDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteKodepos" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteKodepossDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="kodepos">Are you sure you want to delete the selected kodeposs?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteKodepossDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedKodeposs" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
