<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const kabupatens = ref(null);
const kabupatenDialog = ref(false);
const deleteKabupatenDialog = ref(false);
const deleteKabupatensDialog = ref(false);
const kabupaten = ref({});
const selectedKabupatens = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    getKabupatenData();
});

const getKabupatenData = () => {
    axios
        .get('api/kabupaten')
        .then((response) => {
            if (response.data.status === 'success') {
                kabupatens.value = response.data.data;
            }
        })
        .catch((error) => {
            console.error(error);
        });
};

const openNew = () => {
    kabupaten.value = {};
    submitted.value = false;
    kabupatenDialog.value = true;
};

const hideDialog = () => {
    kabupatenDialog.value = false;
    submitted.value = false;
};

const saveKabupaten = async () => {
    submitted.value = true;
    if (kabupaten.value.kode_kab && kabupaten.value.kode_prov && kabupaten.value.nama_kabupaten){
        console.log(kabupaten.value.id);
      if (kabupaten.value.id) {
        const index = findIndexById(kabupaten.value.id);
        kabupatens.value[index] = kabupaten.value;
        await axios.put(`/api/kabupaten/${kabupaten.value.id}`, {
          kode_kab: kabupaten.value.kode_kab,
          kode_prov: kabupaten.value.kode_prov,
          nama_kabupaten: kabupaten.value.nama_kabupaten
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Kabupaten Updated', life: 3000 });
        kabupatenDialog.value = false;
      kabupaten.value = {};
      } else {
        kabupatens.value.push(kabupaten.value);
        await axios.post('/api/kabupaten', {
          kode_kab: kabupaten.value.kode_kab,
          kode_prov: kabupaten.value.kode_prov,
          nama_kabupaten: kabupaten.value.nama_kabupaten
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Kabupaten Created', life: 3000 });
        kabupatenDialog.value = false;
      kabupaten.value = {};
      }
      kabupatenDialog.value = false;
      kabupaten.value = {};
    }
  };


const editKabupaten = (editKabupaten) => {
    kabupaten.value = { ...editKabupaten };
    console.log(kabupaten);
    kabupatenDialog.value = true;
};

const confirmDeleteKabupaten = (editKabupaten) => {
    kabupaten.value = editKabupaten;
    deleteKabupatenDialog.value = true;
};

const deleteKabupaten = async () => {
  try {
    await axios.delete(`/api/kabupaten/${kabupaten.value.id}`);
    
    kabupatens.value = kabupatens.value.filter((val) => val.id !== kabupaten.value.id);
    deleteKabupatenDialog.value = false;
    kabupaten.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Kabupaten Deleted', life: 3000 });
  } catch (error) {
    // Handle any errors that occurred during the API request
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
  }
};


const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < kabupatens.value.length; i++) {
        if (kabupatens.value[i].id === id) {
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
    deleteKabupatensDialog.value = true;
};
const deleteSelectedKabupatens = async () => {
  try {
    const selectedKabupatenIds = selectedKabupatens.value.map((kabupaten) => kabupaten.id);
    await axios.delete(`/api/kabupaten`, { data: { ids: selectedKabupatenIds } });
    
    kabupatens.value = kabupatens.value.filter((val) => !selectedKabupatens.value.includes(val));
    deleteKabupatensDialog.value = false;
    selectedKabupatens.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Kabupatens Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedKabupatens || !selectedKabupatens.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="kabupatens"
                    v-model:selection="selectedKabupatens"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} kabupatens"
                    responsiveLayout="scroll"
                    >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Kabupaten</h5>
                        <span class="block mt-2 md:mt-0 p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="kode_kab" header="kode kabupaten" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Kabupaten</span>
                        {{ slotProps.data.kode_kab }}
                        </template>
                    </Column>
                    <Column field="kode_prov" header="kode provinsi" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Provinsi</span>
                        {{ slotProps.data.kode_prov }}
                        </template>
                    </Column>
                    <Column field="nama_kabupaten" header="nama kabupaten" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Nama Kabupaten</span>
                        {{ slotProps.data.nama_kabupaten }}
                        </template>
                    </Column>
                    <Column field="nama_provinsi" header="nama provinsi" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Nama Provinsi</span>
                        {{ slotProps.data.nama_provinsi }}
                        </template>
                    </Column>
                    
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editKabupaten(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteKabupaten(slotProps.data)" />
                        </template>
                    </Column>
                    </DataTable>

                    <Dialog v-model:visible="kabupatenDialog" :style="{ width: '450px' }" header="Kabupaten Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="kode_kab">Kode Kabupaten</label>
                        <InputText id="kode_kab" v-model.trim="kabupaten.kode_kab" required="true" autofocus :class="{ 'p-invalid': submitted && !kabupaten.kode_kab }" />
                        <small class="p-invalid" v-if="submitted && !kabupaten.kode_kab">Kode Kabupaten is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_prov">Kode Provinsi</label>
                        <InputText id="kode_prov" v-model.trim="kabupaten.kode_prov" required="true" autofocus :class="{ 'p-invalid': submitted && !kabupaten.kode_prov }" />
                        <small class="p-invalid" v-if="submitted && !kabupaten.kode_prov">Kode Kabupaten is required.</small>
                    </div>
                    <div class="field">
                        <label for="nama_kabupaten">Nama Kabupaten</label>
                        <InputText id="nama_kabupaten" v-model.trim="kabupaten.nama_kabupaten" required="true" autofocus :class="{ 'p-invalid': submitted && !kabupaten.nama_kabupaten }" />
                        <small class="p-invalid" v-if="submitted && !kabupaten.nama_kabupaten">Nama Kabupaten is required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveKabupaten" />
                    </template>
                    </Dialog>

                <Dialog v-model:visible="deleteKabupatenDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="kabupaten"
                            >Are you sure you want to delete <b>{{ kabupaten.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteKabupatenDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteKabupaten" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteKabupatensDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="kabupaten">Are you sure you want to delete the selected kabupatens?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteKabupatensDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedKabupatens" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
