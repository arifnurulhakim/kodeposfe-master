<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import ProductService from '@/service/ProductService';
import { Buffer } from 'buffer';

const toast = useToast();

const pengerimans = ref(null);
const qrcodes = ref(null);
const base64Image = ref({});
const imageUrl = ref(null);
const pengirimanDialog = ref(false);
const deletePengirimanDialog = ref(false);
const deletePengirimansDialog = ref(false);
const pengiriman = ref({});
const selectedPengirimans = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const qrcodepengirimanDialog = ref(false);

const dataviewValue = ref(null);
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);

const productService = new ProductService();

onMounted(() => {
  productService.getProductsSmall().then((data) => (dataviewValue.value = data));
});

onBeforeMount(() => {
  initFilters();
});

onMounted(() => {
  pengirimanData();
});

const pengirimanData = () => {
  axios
    .get('api/pengiriman')
    .then((response) => {
      if (response.data.status === 'success') {
        pengerimans.value = response.data.data;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const openNew = () => {
  pengiriman.value = {};
  submitted.value = false;
  pengirimanDialog.value = true;
};

const hideDialog = () => {
  pengirimanDialog.value = false;
  submitted.value = false;
};

const savePengiriman = async () => {
  submitted.value = true;
  if (pengiriman.value.alamat_penerima && pengiriman.value.alamat_pengirim) {
    console.log(pengiriman.value.id);
    if (pengiriman.value.id) {
      const index = findIndexById(pengiriman.value.id);
      pengerimans.value[index] = pengiriman.value;
      await axios.put(`/api/pengiriman/${pengiriman.value.id}`, {
        alamat_penerima: pengiriman.value.alamat_penerima,
        alamat_pengirim: pengiriman.value.alamat_pengirim,
        status_kiriman: pengiriman.value.status_kiriman,
        info_kiriman: pengiriman.value.info_kiriman,
        notes_kiriman: pengiriman.value.notes_kiriman,
        payment: pengiriman.value.payment,
      });
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Pengiriman Updated', life: 3000 });
      pengirimanDialog.value = false;
      pengiriman.value = {};
    } else {
      pengerimans.value.push(pengiriman.value);
      await axios.post('/api/pengiriman', {
        alamat_penerima: pengiriman.value.alamat_penerima,
        alamat_pengirim: pengiriman.value.alamat_pengirim,
        status_kiriman: pengiriman.value.status_kiriman,
        info_kiriman: pengiriman.value.info_kiriman,
        notes_kiriman: pengiriman.value.notes_kiriman,
        payment: pengiriman.value.payment,
      });
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Pengiriman Created', life: 3000 });
      pengirimanDialog.value = false;
      pengiriman.value = {};
    }
    pengirimanDialog.value = false;
    pengiriman.value = {};
  }
};

const editPengiriman = (editPengiriman) => {
  pengiriman.value = { ...editPengiriman };
  console.log(pengiriman);
  pengirimanDialog.value = true;
};

const confirmDeletePengiriman = (editPengiriman) => {
  pengiriman.value = editPengiriman;
  deletePengirimanDialog.value = true;
};

const deletePengiriman = async () => {
  try {
    await axios.delete(`/api/pengiriman/${pengiriman.value.id}`);
    pengerimans.value = pengerimans.value.filter((val) => val.id !== pengiriman.value.id);
    deletePengirimanDialog.value = false;
    pengiriman.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Pengiriman Deleted', life: 3000 });
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
  }
};

const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < pengerimans.value.length; i++) {
    if (pengerimans.value[i].id === id) {
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
  deletePengirimansDialog.value = true;
};

const deleteSelectedPengirimans = async () => {
  try {
    const selectedPengirimanIds = selectedPengirimans.value.map((pengiriman) => pengiriman.id);
    await axios.delete(`/api/pengiriman`, { data: { ids: selectedPengirimanIds } });
    pengerimans.value = pengerimans.value.filter((val) => !selectedPengirimans.value.includes(val));
    deletePengirimansDialog.value = false;
    selectedPengirimans.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Pengirimans Deleted', life: 3000 });
  } catch (error) {
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
  pengiriman.value = { ...generateQRCodeModal };

  axios
    .get(`/api/pengiriman/qrcode/${pengiriman.value.id}`)
    .then((response) => {
      qrcodes.value = response.data;
      console.log(qrcodes);
      base64Image.value = response.data.data.qrCode;

      console.log(base64Image);
      // imageUrl = `data:image/png;base64,${base64Image}`; // Adding the prefix "data:image/png;base64," to the base64 image URL
      qrcodepengirimanDialog.value = true;

      // Assigning imageUrl to the imageUrl property
      generateQRCodeModal.imageUrl = imageUrl;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};



const cardMenu = ref([
  { label: 'Save', icon: 'pi pi-fw pi-check' },
  { label: 'Update', icon: 'pi pi-fw pi-refresh' },
  { label: 'Delete', icon: 'pi pi-fw pi-trash' },
]);

const menuRef = ref(null);

const toggle = () => {
  menuRef.value.toggle(event);
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedPengirimans || !selectedPengirimans.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="pengerimans"
                    v-model:selection="selectedPengirimans"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} pengerimans"
                    responsiveLayout="scroll"
                    >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Pengiriman</h5>
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
                    <Column field="alamat_penerima" header="Alamat Penerima" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Alamat Penerima</span>
                            {{ slotProps.data.alamat_penerima }}
                        </template>
                    </Column>

                    <Column field="alamat_pengirim" header="Alamat Pengirim" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Alamat Pengirim</span>
                            {{ slotProps.data.alamat_pengirim }}
                        </template>
                    </Column>

                    <Column field="status_kiriman" header="Status Kiriman" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status Kiriman</span>
                            {{ slotProps.data.status_kiriman }}
                        </template>
                    </Column>

                    <Column field="info_kiriman" header="Informasi Kiriman" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Informasi Kiriman</span>
                            {{ slotProps.data.info_kiriman }}
                        </template>
                    </Column>

                    <Column field="notes_kiriman" header="Catatan Kiriman" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Catatan Kiriman</span>
                            {{ slotProps.data.notes_kiriman }}
                        </template>
                    </Column>

                    <Column field="payment" header="Pembayaran" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Pembayaran</span>
                            {{ slotProps.data.payment }}
                        </template>
                    </Column>
 
                    
                    <Column headerStyle="min-width:15rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editPengiriman(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeletePengiriman(slotProps.data)" />
                            
                        </template>

                    </Column>
                    </DataTable>
                    <Dialog v-model:visible="qrcodepengirimanDialog" :style="{ width: '450px' }" header="Pengiriman Details" :modal="true" class="p-fluid">
                        <div class="col-12">
                          <div class="card">
                            <h5>DataView</h5>
                            <div class="data-container">
                              <img v-bind:src="'data:image/;base64,' + qrcodes.data.qrCode.base64" />

                              <div class="data-item">
                                <div class="data-label" style="font-weight: bold;">Alamat Penerima:</div>
                                <div class="data-value">{{ qrcodes.data.pengirimanData.alamat_penerima}}</div>
                              </div>

                              <div class="data-item">
                                <div class="data-label" style="font-weight: bold;">Alamat Pengirim:</div>
                                <div class="data-value">{{ qrcodes.data.pengirimanData.alamat_pengirim}}</div>
                              </div>

                              <div class="data-item">
                                <div class="data-label" style="font-weight: bold;">Status Kiriman:</div>
                                <div class="data-value">{{ qrcodes.data.pengirimanData.status_kiriman}}</div>
                              </div>

                              <div class="data-item">
                                <div class="data-label" style="font-weight: bold;">Info Kiriman:</div>
                                <div class="data-value">{{ qrcodes.data.pengirimanData.info_kiriman}}</div>
                              </div>

                              <div class="data-item">
                                <div class="data-label" style="font-weight: bold;">Notes Kiriman:</div>
                                <div class="data-value">{{ qrcodes.data.pengirimanData.notes_kiriman}}</div>
                              </div>

                              <div class="data-item">
                                <div class="data-label" style="font-weight: bold;">Payment:</div>
                                <div class="data-value">{{ qrcodes.data.pengirimanData.payment}}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Dialog>



                    <Dialog v-model:visible="pengirimanDialog" :style="{ width: '450px' }" header="Pengiriman Details" :modal="true" class="p-fluid">
                        <div class="field">
                            <label for="alamat_penerima">Alamat Penerima</label>
                            <InputText id="alamat_penerima" v-model.trim="pengiriman.alamat_penerima" required="true" autofocus :class="{ 'p-invalid': submitted && !pengiriman.alamat_penerima }" />
                            <small class="p-invalid" v-if="submitted && !pengiriman.alamat_penerima">Alamat Penerima is required.</small>
                        </div>

                        <div class="field">
                            <label for="alamat_pengirim">Alamat Pengirim</label>
                            <InputText id="alamat_pengirim" v-model.trim="pengiriman.alamat_pengirim" required="true" autofocus :class="{ 'p-invalid': submitted && !pengiriman.alamat_pengirim }" />
                            <small class="p-invalid" v-if="submitted && !pengiriman.alamat_pengirim">Alamat Pengirim is required.</small>
                        </div>

                        <div class="field">
                            <label for="status_kiriman">Status Kiriman</label>
                            <InputText id="status_kiriman" v-model.trim="pengiriman.status_kiriman" required="true" autofocus :class="{ 'p-invalid': submitted && !pengiriman.status_kiriman }" />
                            <small class="p-invalid" v-if="submitted && !pengiriman.status_kiriman">Status Kiriman is required.</small>
                        </div>

                        <div class="field">
                            <label for="info_kiriman">Informasi Kiriman</label>
                            <InputText id="info_kiriman" v-model.trim="pengiriman.info_kiriman" required="true" autofocus :class="{ 'p-invalid': submitted && !pengiriman.info_kiriman }" />
                            <small class="p-invalid" v-if="submitted && !pengiriman.info_kiriman">Informasi Kiriman is required.</small>
                        </div>

                        <div class="field">
                            <label for="notes_kiriman">Catatan Kiriman</label>
                            <InputText id="notes_kiriman" v-model.trim="pengiriman.notes_kiriman" required="true" autofocus :class="{ 'p-invalid': submitted && !pengiriman.notes_kiriman }" />
                            <small class="p-invalid" v-if="submitted && !pengiriman.notes_kiriman">Catatan Kiriman is required.</small>
                        </div>

                        <div class="field">
                            <label for="payment">Pembayaran</label>
                            <InputText id="payment" v-model.trim="pengiriman.payment" required="true" autofocus :class="{ 'p-invalid': submitted && !pengiriman.payment }" />
                            <small class="p-invalid" v-if="submitted && !pengiriman.payment">Pembayaran is required.</small>
                        </div>


                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePengiriman" />
                    </template>
                    </Dialog>

                <Dialog v-model:visible="deletePengirimanDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="pengiriman"
                            >Are you sure you want to delete <b>{{ pengiriman.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePengirimanDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deletePengiriman" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deletePengirimansDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="pengiriman">Are you sure you want to delete the selected pengerimans?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deletePengirimansDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedPengirimans" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
