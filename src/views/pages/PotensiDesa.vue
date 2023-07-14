<script setup>
    import {
        FilterMatchMode
    } from 'primevue/api';
    import {
        ref,
        onMounted,
        onBeforeMount
    } from 'vue';
    import axios from 'axios';
    import {
        useToast
    } from 'primevue/usetoast';
    const toast = useToast();
    const potensisdesas = ref(null);
    const potensidesaDialog = ref(false);
    const deletePotensidesaDialog = ref(false);
    const deletePotensidesasDialog = ref(false);
    const potensidesa = ref({});
    const selectedPotensidesas = ref(null);
    const dt = ref(null);
    const filters = ref({});
    const submitted = ref(false);
    onBeforeMount(() => {
        initFilters();
    });
    onMounted(() => {
        getPotensidesaData();
    });
    const getPotensidesaData = () => {
        axios
            .get('api/potensidesa')
            .then((response) => {
                if (response.data.status === 'success') {
                    potensisdesas.value = response.data.data;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const openNew = () => {
        potensidesa.value = {};
        submitted.value = false;
        potensidesaDialog.value = true;
    };
    const hideDialog = () => {
        potensidesaDialog.value = false;
        submitted.value = false;
    };
    const savePotensidesa = async() => {
        submitted.value = true;
        if (potensidesa.value.kode_dagri && potensidesa.value.nama_potensidesa) {
            console.log(potensidesa.value.id);
            if (potensidesa.value.id) {
                const index = findIndexById(potensidesa.value.id);
                potensisdesas.value[index] = potensidesa.value;
                await axios.put(`/api/potensidesa/${potensidesa.value.id}`, {
                    kode_dagri: potensidesa.value.kode_dagri,
                    nama_potensidesa: potensidesa.value.nama_potensidesa
                });
                toast.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Potensidesa Updated',
                    life: 3000
                });
                potensidesaDialog.value = false;
                potensidesa.value = {};
            } else {
                potensisdesas.value.push(potensidesa.value);
                await axios.post('/api/potensidesa', {
                    kode_dagri: potensidesa.value.kode_dagri,
                    nama_potensidesa: potensidesa.value.nama_potensidesa
                });
                toast.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Potensidesa Created',
                    life: 3000
                });
                potensidesaDialog.value = false;
                potensidesa.value = {};
            }
            potensidesaDialog.value = false;
            potensidesa.value = {};
        }
    };
    const editPotensidesa = (editPotensidesa) => {
        potensidesa.value = { ...editPotensidesa
        };
        console.log(potensidesa);
        potensidesaDialog.value = true;
    };
    const confirmDeletePotensidesa = (editPotensidesa) => {
        potensidesa.value = editPotensidesa;
        deletePotensidesaDialog.value = true;
    };
    const deletePotensidesa = async() => {
        try {
            await axios.delete(`/api/potensidesa/${potensidesa.value.id}`);
            potensisdesas.value = potensisdesas.value.filter((val) => val.id !== potensidesa.value.id);
            deletePotensidesaDialog.value = false;
            potensidesa.value = {};
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Potensidesa Deleted',
                life: 3000
            });
        } catch (error) {
            // Handle any errors that occurred during the API request
            console.error(error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred',
                life: 3000
            });
        }
    };
    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < potensisdesas.value.length; i++) {
            if (potensisdesas.value[i].id === id) {
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
        deletePotensidesasDialog.value = true;
    };
    const deleteSelectedPotensidesas = async() => {
        try {
            const selectedPotensidesaIds = selectedPotensidesas.value.map((potensidesa) => potensidesa.id);
            await axios.delete(`/api/potensidesa`, {
                data: {
                    ids: selectedPotensidesaIds
                }
            });
            potensisdesas.value = potensisdesas.value.filter((val) => !selectedPotensidesas.value.includes(val));
            deletePotensidesasDialog.value = false;
            selectedPotensidesas.value = null;
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Potensidesas Deleted',
                life: 3000
            });
        } catch (error) {
            // Handle any errors that occurred during the API request
            console.error(error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred',
                life: 3000
            });
        }
    };
    const initFilters = () => {
        filters.value = {
            global: {
                value: null,
                matchMode: FilterMatchMode.CONTAINS
            },
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
                                    <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedPotensidesas || !selectedPotensidesas.length" />
                                </div>
</template>

<template v-slot:end>
    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
    <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
</template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="potensisdesas"
                    v-model:selection="selectedPotensidesas"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} potensisdesas"
                    responsiveLayout="scroll"
                    >
<template #header>
    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 class="m-0">Potensidesa</h5>
        <span class="block mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                                </span>
    </div>
</template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="kode_dagri" header="Kode Desa" :sortable="true" headerStyle="width:10%; min-width:10rem;">
<template #body="slotProps">
    <span class="p-column-title">Kode Desa</span>
    {{ slotProps.data.kode_dagri }}
</template>
</Column>
<Column field="nama_desa" header="Nama Desa" :sortable="true" headerStyle="width:70%; min-width:10rem;">
<template #body="slotProps">
    <span class="p-column-title">Nama Desa</span>
    {{ slotProps.data.nama_desa }}
</template>
</Column>
<Column field="jumlah_penduduk" header="Jumlah Penduduk" :sortable="true" headerStyle="width:70%; min-width:10rem;">
<template #body="slotProps">
    <span class="p-column-title">Jumlah Penduduk</span>
    {{ slotProps.data.jumlah_penduduk }}
</template>
</Column>
<Column field="jumlah_fasilitas_pendidikan" header="Jumlah Fasilitas Pendidikan" :sortable="true" headerStyle="width:70%; min-width:10rem;">
<template #body="slotProps">
    <span class="p-column-title">Jumlah Fasilitas Pendidikan</span>
    {{ slotProps.data.jumlah_fasilitas_pendidikan }}
</template>
</Column>
<Column field="jumlah_fasilitas_ibadah" header="Jumlah Fasilitas Ibadah" :sortable="true" headerStyle="width:70%; min-width:10rem;">
<template #body="slotProps">
    <span class="p-column-title">Jumlah Fasilitas Ibadah</span>
    {{ slotProps.data.jumlah_fasilitas_ibadah }}
</template>
</Column>
<Column field="jumlah_tempat_wisata" header="Jumlah Tempat Wisata" :sortable="true" headerStyle="width:70%; min-width:10rem;">
<template #body="slotProps">
    <span class="p-column-title">Jumlah Tempat Wisata</span>
    {{ slotProps.data.jumlah_tempat_wisata }}
</template>
</Column>
<Column field="jumlah_industri_kecil" header="Jumlah Industri Kecil" :sortable="true" headerStyle="width:70%; min-width:10rem;">
<template #body="slotProps">
    <span class="p-column-title">Jumlah Industri Kecil</span>
    {{ slotProps.data.jumlah_industri_kecil }}
</template>
</Column>

                    <Column headerStyle="min-width:10rem;">
<template #body="slotProps">
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editPotensidesa(slotProps.data)" />
    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeletePotensidesa(slotProps.data)" />
</template>
                    </Column>
                    </DataTable>

                    <Dialog v-model:visible="potensidesaDialog" :style="{ width: '450px' }" header="Potensidesa Details" :modal="true" class="p-fluid">
  <div class="field">
    <label for="kode_dagri">Kode Potensidesa</label>
    <InputText id="kode_dagri" v-model.trim="potensidesa.kode_dagri" required="true" autofocus :class="{ 'p-invalid': submitted && !potensidesa.kode_dagri }" />
    <small class="p-invalid" v-if="submitted && !potensidesa.kode_dagri">Kode Potensidesa is required.</small>
  </div>

  <div class="field">
    <label for="jumlah_penduduk">Jumlah Penduduk</label>
    <InputText id="jumlah_penduduk" v-model.trim="potensidesa.jumlah_penduduk" required="true" autofocus :class="{ 'p-invalid': submitted && !potensidesa.jumlah_penduduk }" />
    <small class="p-invalid" v-if="submitted && !potensidesa.jumlah_penduduk">Jumlah Penduduk is required.</small>
  </div>
  <div class="field">
    <label for="jumlah_fasilitas_pendidikan">Jumlah Fasilitas Pendidikan</label>
    <InputText id="jumlah_fasilitas_pendidikan" v-model.trim="potensidesa.jumlah_fasilitas_pendidikan" required="true" autofocus :class="{ 'p-invalid': submitted && !potensidesa.jumlah_fasilitas_pendidikan }" />
    <small class="p-invalid" v-if="submitted && !potensidesa.jumlah_fasilitas_pendidikan">Jumlah Fasilitas Pendidikan is required.</small>
  </div>
  <div class="field">
    <label for="jumlah_fasilitas_ibadah">Jumlah Fasilitas Ibadah</label>
    <InputText id="jumlah_fasilitas_ibadah" v-model.trim="potensidesa.jumlah_fasilitas_ibadah" required="true" autofocus :class="{ 'p-invalid': submitted && !potensidesa.jumlah_fasilitas_ibadah }" />
    <small class="p-invalid" v-if="submitted && !potensidesa.jumlah_fasilitas_ibadah">Jumlah Fasilitas Ibadah is required.</small>
  </div>
  <div class="field">
    <label for="jumlah_tempat_wisata">Jumlah Tempat Wisata</label>
    <InputText id="jumlah_tempat_wisata" v-model.trim="potensidesa.jumlah_tempat_wisata" required="true" autofocus :class="{ 'p-invalid': submitted && !potensidesa.jumlah_tempat_wisata }" />
    <small class="p-invalid" v-if="submitted && !potensidesa.jumlah_tempat_wisata">Jumlah Tempat Wisata is required.</small>
  </div>
  <div class="field">
    <label for="jumlah_industri_kecil">Jumlah Industri Kecil</label>
    <InputText id="jumlah_industri_kecil" v-model.trim="potensidesa.jumlah_industri_kecil" required="true" autofocus :class="{ 'p-invalid': submitted && !potensidesa.jumlah_industri_kecil }" />
    <small class="p-invalid" v-if="submitted && !potensidesa.jumlah_industri_kecil">Jumlah Industri Kecil is required.</small>
  </div>
<template #footer>
    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePotensidesa" />
</template>
</Dialog>

                <Dialog v-model:visible="deletePotensidesaDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="potensidesa"
                            >Are you sure you want to delete <b>{{ potensidesa.name }}</b
                            >?</span
                        >
                    </div>
<template #footer>
    <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePotensidesaDialog = false" />
    <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePotensidesa" />
</template>
                </Dialog>

                <Dialog v-model:visible="deletePotensidesasDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="potensidesa">Are you sure you want to delete the selected potensisdesas?</span>
                    </div>
<template #footer>
    <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePotensidesasDialog = false" />
    <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedPotensidesas" />
</template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/demo/styles/badges.scss';
</style>
