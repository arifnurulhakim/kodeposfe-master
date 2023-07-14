<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const kecamatans = ref(null);
const kecamatanDialog = ref(false);
const deleteKecamatanDialog = ref(false);
const deleteKecamatansDialog = ref(false);
const kecamatan = ref({});
const selectedKecamatans = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    getKecamatanData();
});

const getKecamatanData = () => {
    axios
        .get('api/kecamatan')
        .then((response) => {
            if (response.data.status === 'success') {
                kecamatans.value = response.data.data;
            }
        })
        .catch((error) => {
            console.error(error);
        });
};

const openNew = () => {
    kecamatan.value = {};
    submitted.value = false;
    kecamatanDialog.value = true;
};

const hideDialog = () => {
    kecamatanDialog.value = false;
    submitted.value = false;
};

const saveKecamatan = async () => {
    submitted.value = true;
    if (kecamatan.value.kode_kec && kecamatan.value.kode_kab && kecamatan.value.kode_prov && kecamatan.value.nama_kecamatan){
        console.log(kecamatan.value.id);
      if (kecamatan.value.id) {
        const index = findIndexById(kecamatan.value.id);
        kecamatans.value[index] = kecamatan.value;
        await axios.put(`/api/kecamatan/${kecamatan.value.id}`, {
          kode_kec: kecamatan.value.kode_kec,
          kode_kab: kecamatan.value.kode_kab,
          kode_prov: kecamatan.value.kode_prov,
          nama_kecamatan: kecamatan.value.nama_kecamatan
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Kecamatan Updated', life: 3000 });
        kecamatanDialog.value = false;
      kecamatan.value = {};
      } else {
        kecamatans.value.push(kecamatan.value);
        await axios.post('/api/kecamatan', {
          kode_kec: kecamatan.value.kode_kec,
          kode_kab: kecamatan.value.kode_kab,
          kode_prov: kecamatan.value.kode_prov,
          nama_kecamatan: kecamatan.value.nama_kecamatan
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Kecamatan Created', life: 3000 });
        kecamatanDialog.value = false;
      kecamatan.value = {};
      }
      kecamatanDialog.value = false;
      kecamatan.value = {};
    }
  };


const editKecamatan = (editKecamatan) => {
    kecamatan.value = { ...editKecamatan };
    console.log(kecamatan);
    kecamatanDialog.value = true;
};

const confirmDeleteKecamatan = (editKecamatan) => {
    kecamatan.value = editKecamatan;
    deleteKecamatanDialog.value = true;
};

const deleteKecamatan = async () => {
  try {
    await axios.delete(`/api/kecamatan/${kecamatan.value.id}`);
    
    kecamatans.value = kecamatans.value.filter((val) => val.id !== kecamatan.value.id);
    deleteKecamatanDialog.value = false;
    kecamatan.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Kecamatan Deleted', life: 3000 });
  } catch (error) {
    // Handle any errors that occurred during the API request
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
  }
};


const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < kecamatans.value.length; i++) {
        if (kecamatans.value[i].id === id) {
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
    deleteKecamatansDialog.value = true;
};
const deleteSelectedKecamatans = async () => {
  try {
    const selectedKecamatanIds = selectedKecamatans.value.map((kecamatan) => kecamatan.id);
    await axios.delete(`/api/kecamatan`, { data: { ids: selectedKecamatanIds } });
    
    kecamatans.value = kecamatans.value.filter((val) => !selectedKecamatans.value.includes(val));
    deleteKecamatansDialog.value = false;
    selectedKecamatans.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Kecamatans Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedKecamatans || !selectedKecamatans.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="kecamatans"
                    v-model:selection="selectedKecamatans"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} kecamatans"
                    responsiveLayout="scroll"
                    >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Kecamatan</h5>
                        <span class="block mt-2 md:mt-0 p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="kode_kec" header="kode kecamatan" :sortable="true" headerStyle="width:5%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Kecamatan</span>
                        {{ slotProps.data.kode_kab }}
                        </template>
                    </Column>
                    <Column field="kode_kab" header="kode kabupaten" :sortable="true" headerStyle="width:5%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Kabupaten</span>
                        {{ slotProps.data.kode_kab }}
                        </template>
                    </Column>
                    <Column field="kode_prov" header="kode provinsi" :sortable="true" headerStyle="width:5%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Provinsi</span>
                        {{ slotProps.data.kode_prov }}
                        </template>
                    </Column>
                    <Column field="nama_kecamatan" header="nama kecamatan" :sortable="true" headerStyle="width:10%; min-width:10rem;">
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
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editKecamatan(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteKecamatan(slotProps.data)" />
                        </template>
                    </Column>
                    </DataTable>

                    <Dialog v-model:visible="kecamatanDialog" :style="{ width: '450px' }" header="Kecamatan Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="kode_kec">Kode Kecamatan</label>
                        <InputText id="kode_kec" v-model.trim="kecamatan.kode_kec" required="true" autofocus :class="{ 'p-invalid': submitted && !kecamatan.kode_kec }" />
                        <small class="p-invalid" v-if="submitted && !kecamatan.kode_kec">Kode Kecamatan is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_kab">Kode Kabupaten</label>
                        <InputText id="kode_kab" v-model.trim="kecamatan.kode_kab" required="true" autofocus :class="{ 'p-invalid': submitted && !kecamatan.kode_kab }" />
                        <small class="p-invalid" v-if="submitted && !kecamatan.kode_kab">Kode Kecamatan is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_prov">Kode Provinsi</label>
                        <InputText id="kode_prov" v-model.trim="kecamatan.kode_prov" required="true" autofocus :class="{ 'p-invalid': submitted && !kecamatan.kode_prov }" />
                        <small class="p-invalid" v-if="submitted && !kecamatan.kode_prov">Kode Kecamatan is required.</small>
                    </div>
                    <div class="field">
                        <label for="nama_kecamatan">Nama Kecamatan</label>
                        <InputText id="nama_kecamatan" v-model.trim="kecamatan.nama_kecamatan" required="true" autofocus :class="{ 'p-invalid': submitted && !kecamatan.nama_kecamatan }" />
                        <small class="p-invalid" v-if="submitted && !kecamatan.nama_kecamatan">Nama Kecamatan is required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveKecamatan" />
                    </template>
                    </Dialog>

                <Dialog v-model:visible="deleteKecamatanDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="kecamatan"
                            >Are you sure you want to delete <b>{{ kecamatan.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteKecamatanDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteKecamatan" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteKecamatansDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="kecamatan">Are you sure you want to delete the selected kecamatans?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteKecamatansDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedKecamatans" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
