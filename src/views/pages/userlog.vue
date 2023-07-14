<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const userlogs = ref(null);

const userlog = ref({});
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    getUserData();
});

const getUserData = () => {
    axios
        .get('api/userlog')
        .then((response) => {
            if (response.data.status === 'success') {
                userlogs.value = response.data.data;
            }
        })
        .catch((error) => {
            console.error(error);
        });
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
                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="userlogs"
                    v-model:selection="selectedUsers"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} userlogs"
                    responsiveLayout="scroll"
                    >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">User</h5>
                        <span class="block mt-2 md:mt-0 p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
                        </div>
                    </template>


                    <Column field="name" header="name" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Name</span>
                        {{ slotProps.data.name }}
                        </template>
                    </Column>

                    <Column field="aktivitas" header="Aktivitas" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Aktivitas</span>
                        {{ slotProps.data.aktivitas }}
                        </template>
                    </Column>

                    <Column field="modul" header="Modul" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Modul</span>
                            {{ slotProps.data.modul }}
                        </template>
                    </Column>

                    </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
