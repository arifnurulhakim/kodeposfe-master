<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const desas = ref(null);
const desaDialog = ref(false);
const deleteDesaDialog = ref(false);
const deleteDesasDialog = ref(false);
const desa = ref({});
const selectedDesas = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const perPage = ref(10);
const currentPage = ref(1);
const totalData = ref(0);
const loading = ref(false);
const loadingIcon = 'pi pi-spin pi-spinner';

onBeforeMount(() => {
  initFilters();
});

onMounted(() => {
  getDesaData();
});

const getDesaData = () => {
  loading.value = true;
  axios
    .get('api/desa')
    .then((response) => {
      if (response.data.status === 'success') {
        desas.value = response.data.data;
        totalData.value = response.data.total_data;
      }
    })
    .catch((error) => {
      console.error(error);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch data',
        life: 3000,
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const handlePageChange = (event) => {
  currentPage.value = event.page + 1;
  perPage.value = event.rows;
  getDesaData();
};


const openNew = () => {
    desa.value = {};
    submitted.value = false;
    desaDialog.value = true;
};

const hideDialog = () => {
    desaDialog.value = false;
    submitted.value = false;
};

const saveDesa = async () => {
    submitted.value = true;
    if (desa.value.kode_desa && desa.value.kode_kec && desa.value.kode_kab && desa.value.kode_prov && desa.value.nama_desa){
        console.log(desa.value.id);
      if (desa.value.id) {
        const index = findIndexById(desa.value.id);
        desas.value[index] = desa.value;
        await axios.put(`/api/desa/${desa.value.id}`, {
          kode_desa: desa.value.kode_desa,
          kode_kec: desa.value.kode_kec,
          kode_prov: desa.value.kode_prov,
          nama_desa: desa.value.nama_desa
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Desa Updated', life: 3000 });
        desaDialog.value = false;
      desa.value = {};
      } else {
        desas.value.push(desa.value);
        await axios.post('/api/desa', {
          kode_desa: desa.value.kode_desa,
          kode_kec: desa.value.kode_kec,
          kode_kab: desa.value.kode_kab,
          kode_prov: desa.value.kode_prov,
          nama_desa: desa.value.nama_desa
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Desa Created', life: 3000 });
        desaDialog.value = false;
      desa.value = {};
      }
      desaDialog.value = false;
      desa.value = {};
    }
  };


const editDesa = (editDesa) => {
    desa.value = { ...editDesa };
    console.log(desa);
    desaDialog.value = true;
};

const confirmDeleteDesa = (editDesa) => {
    desa.value = editDesa;
    deleteDesaDialog.value = true;
};

const deleteDesa = async () => {
  try {
    await axios.delete(`/api/desa/${desa.value.id}`);
    
    desas.value = desas.value.filter((val) => val.id !== desa.value.id);
    deleteDesaDialog.value = false;
    desa.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Desa Deleted', life: 3000 });
  } catch (error) {
    // Handle any errors that occurred during the API request
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
  }
};


const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < desas.value.length; i++) {
        if (desas.value[i].id === id) {
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
    deleteDesasDialog.value = true;
};
const deleteSelectedDesas = async () => {
  try {
    const selectedDesaIds = selectedDesas.value.map((desa) => desa.id);
    await axios.delete(`/api/desa`, { data: { ids: selectedDesaIds } });
    
    desas.value = desas.value.filter((val) => !selectedDesas.value.includes(val));
    deleteDesasDialog.value = false;
    selectedDesas.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Desas Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedDesas || !selectedDesas.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
  ref="dt"
  :value="desas"
  v-model:selection="selectedDesas"
  dataKey="id"
  :paginator="true"
  :rows="perPage"
  :currentPage="currentPage"
  :filters="filters"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  :rowsPerPageOptions="[5, 10, 25]"
  :totalRecords="totalData"
  :loading="loading"
  :currentPageReportTemplate="'Showing {first} to {last} of ' + totalData + ' provinsis'"
  :loadingIcon="loadingIcon"
  @page="handlePageChange"
>

                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Desa</h5>
                        <span class="block mt-2 md:mt-0 p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="kode_desa" header="kode desa" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Desa</span>
                        {{ slotProps.data.kode_desa }}
                        </template>
                    </Column>
                    <Column field="kode_kec" header="kode kecamatan" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Kecamatan</span>
                        {{ slotProps.data.kode_kec }}
                        </template>
                    </Column>
                    <Column field="kode_kab" header="kode kabupaten" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Kabupaten</span>
                        {{ slotProps.data.kode_kab }}
                        </template>
                    </Column>
                    <Column field="kode_prov" header="kode provinsi" :sortable="true" headerStyle="width:40%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Kode Provinsi</span>
                        {{ slotProps.data.kode_prov }}
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
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editDesa(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteDesa(slotProps.data)" />
                        </template>
                    </Column>
                    </DataTable>

                    <Dialog v-model:visible="desaDialog" :style="{ width: '450px' }" header="Desa Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="kode_desa">Kode Desa</label>
                        <InputText id="kode_desa    " v-model.trim="desa.kode_desa  " required="true" autofocus :class="{ 'p-invalid': submitted && !desa.kode_desa    }" />
                        <small class="p-invalid" v-if="submitted && !desa.kode_desa ">Kode  is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_kec">Kode Kecamatan</label>
                        <InputText id="kode_kec" v-model.trim="desa.kode_kec" required="true" autofocus :class="{ 'p-invalid': submitted && !desa.kode_kec }" />
                        <small class="p-invalid" v-if="submitted && !desa.kode_kec">Kode  is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_kab">Kode Kabupaten</label>
                        <InputText id="kode_kab" v-model.trim="desa.kode_kab" required="true" autofocus :class="{ 'p-invalid': submitted && !desa.kode_kab }" />
                        <small class="p-invalid" v-if="submitted && !desa.kode_kab">Kode Desa is required.</small>
                    </div>
                    <div class="field">
                        <label for="kode_prov">Kode Provinsi</label>
                        <InputText id="kode_prov" v-model.trim="desa.kode_prov" required="true" autofocus :class="{ 'p-invalid': submitted && !desa.kode_prov }" />
                        <small class="p-invalid" v-if="submitted && !desa.kode_prov">Kode Desa is required.</small>
                    </div>
                    <div class="field">
                        <label for="nama_desa">Nama Desa</label>
                        <InputText id="nama_desa" v-model.trim="desa.nama_desa" required="true" autofocus :class="{ 'p-invalid': submitted && !desa.nama_desa }" />
                        <small class="p-invalid" v-if="submitted && !desa.nama_desa">Nama Desa is required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveDesa" />
                    </template>
                    </Dialog>

                <Dialog v-model:visible="deleteDesaDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="desa"
                            >Are you sure you want to delete <b>{{ desa.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDesaDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteDesa" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteDesasDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="desa">Are you sure you want to delete the selected desas?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDesasDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDesas" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
