<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const provinsis = ref(null);
const provinsiDialog = ref(false);
const deleteProvinsiDialog = ref(false);
const deleteProvinsisDialog = ref(false);
const provinsi = ref({});
const selectedProvinsis = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    getProvinsiData();
});

const getProvinsiData = () => {
    axios
        .get('api/provinsi')
        .then((response) => {
            if (response.data.status === 'success') {
                provinsis.value = response.data.data;
            }
        })
        .catch((error) => {
            console.error(error);
        });
};

const openNew = () => {
    provinsi.value = {};
    submitted.value = false;
    provinsiDialog.value = true;
};

const hideDialog = () => {
    provinsiDialog.value = false;
    submitted.value = false;
};

const saveProvinsi = async () => {
    submitted.value = true;
    if (provinsi.value.kode_prov && provinsi.value.nama_provinsi){
        console.log(provinsi.value.id);
      if (provinsi.value.id) {
        const index = findIndexById(provinsi.value.id);
        provinsis.value[index] = provinsi.value;
        await axios.put(`/api/provinsi/${provinsi.value.id}`, {
          kode_prov: provinsi.value.kode_prov,
          nama_provinsi: provinsi.value.nama_provinsi
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Updated', life: 3000 });
        provinsiDialog.value = false;
      provinsi.value = {};
      } else {
        provinsis.value.push(provinsi.value);
        await axios.post('/api/provinsi', {
          kode_prov: provinsi.value.kode_prov,
          nama_provinsi: provinsi.value.nama_provinsi
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Created', life: 3000 });
        provinsiDialog.value = false;
      provinsi.value = {};
      }
      provinsiDialog.value = false;
      provinsi.value = {};
    }
  };


const editProvinsi = (editProvinsi) => {
    provinsi.value = { ...editProvinsi };
    console.log(provinsi);
    provinsiDialog.value = true;
};

const confirmDeleteProvinsi = (editProvinsi) => {
    provinsi.value = editProvinsi;
    deleteProvinsiDialog.value = true;
};

const deleteProvinsi = async () => {
  try {
    await axios.delete(`/api/provinsi/${provinsi.value.id}`);
    
    provinsis.value = provinsis.value.filter((val) => val.id !== provinsi.value.id);
    deleteProvinsiDialog.value = false;
    provinsi.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Deleted', life: 3000 });
  } catch (error) {
    // Handle any errors that occurred during the API request
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
  }
};


const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < provinsis.value.length; i++) {
        if (provinsis.value[i].id === id) {
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
    deleteProvinsisDialog.value = true;
};
const deleteSelectedProvinsis = async () => {
  try {
    const selectedProvinsiIds = selectedProvinsis.value.map((provinsi) => provinsi.id);
    await axios.delete(`/api/provinsi`, { data: { ids: selectedProvinsiIds } });
    
    provinsis.value = provinsis.value.filter((val) => !selectedProvinsis.value.includes(val));
    deleteProvinsisDialog.value = false;
    selectedProvinsis.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsis Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProvinsis || !selectedProvinsis.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="provinsis"
                    v-model:selection="selectedProvinsis"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} provinsis"
                    responsiveLayout="scroll"
                    >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Provinsi</h5>
                        <span class="block mt-2 md:mt-0 p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="kode_prov" header="kode provinsi" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Provinsi</span>
                        {{ slotProps.data.kode_prov }}
                        </template>
                    </Column>
                    <Column field="nama_provinsi" header="nama provinsi" :sortable="true" headerStyle="width:70%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Nama Provinsi</span>
                        {{ slotProps.data.nama_provinsi }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProvinsi(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProvinsi(slotProps.data)" />
                        </template>
                    </Column>
                    </DataTable>

                    <Dialog v-model:visible="provinsiDialog" :style="{ width: '450px' }" header="Provinsi Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="kode_prov">Kode Provinsi</label>
                        <InputText id="kode_prov" v-model.trim="provinsi.kode_prov" required="true" autofocus :class="{ 'p-invalid': submitted && !provinsi.kode_prov }" />
                        <small class="p-invalid" v-if="submitted && !provinsi.kode_prov">Kode Provinsi is required.</small>
                    </div>
                    <div class="field">
                        <label for="nama_provinsi">Nama Provinsi</label>
                        <InputText id="nama_provinsi" v-model.trim="provinsi.nama_provinsi" required="true" autofocus :class="{ 'p-invalid': submitted && !provinsi.nama_provinsi }" />
                        <small class="p-invalid" v-if="submitted && !provinsi.nama_provinsi">Nama Provinsi is required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProvinsi" />
                    </template>
                    </Dialog>

                <Dialog v-model:visible="deleteProvinsiDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="provinsi"
                            >Are you sure you want to delete <b>{{ provinsi.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProvinsiDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProvinsi" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProvinsisDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="provinsi">Are you sure you want to delete the selected provinsis?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProvinsisDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProvinsis" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
