const saveProvinsi = async () => {
    submitted.value = true;
    if (provinsi.value.kode_prov && provinsi.value.kode_prov.trim() && provinsi.value.nama_provinsi) {
      if (provinsi.value.kode_prov) {
        const index = findIndexById(provinsi.value.kode_prov);
        provinsi.value[index] = provinsi.value;
        await axios.put(`/api/provinsi/${provinsi.value.kode_prov}`, {
          kode_prov: provinsi.value.kode_prov,
          nama_provinsi: provinsi.value.nama_provinsi
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Updated', life: 3000 });
      } else {
       
        provinsi.value.push(provinsi.value);
        await axios.post('/api/provinsi', {
          kode_prov: provinsi.value.kode_prov,
          nama_provinsi: provinsi.value.nama_provinsi
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Created', life: 3000 });
      }
      provinsiDialog.value = false;
      provinsi.value = {};
    }
  };


  <DataTable
  ref="dt"
  :value="provinsi"
  v-model:selection="selectedProvinss"
  dataKey="kode_prov"
  :paginator="true"
  :rows="10"
  :filters="filters"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  :rowsPerPageOptions="[5, 10, 25]"
  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} provinsi"
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
  <Column field="kode_prov" header="kode provinsi" :sortable="true" headerStyle="width:40%; min-width:10rem;">
    <template #body="slotProps">
      <span class="p-column-title">Kode Provinsi</span>
      {{ slotProps.data.kode_prov }}
    </template>
  </Column>
  <Column field="nama_provinsi" header="nama provinsi" :sortable="true" headerStyle="width:40%; min-width:10rem;">
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
    <InputText kode_prov="kode_prov" v-model.trim="provinsi.kode_prov" required="true" autofocus :class="{ 'p-invalid': submitted && !provinsi.kode_prov }" />
    <small class="p-invalid" v-if="submitted && !provinsi.kode_prov">Kode Provinsi is required.</small>
  </div>
  <div class="field">
    <label for="nama_provinsi">Nama Provinsi</label>
    <InputText kode_prov="nama_provinsi" v-model.trim="provinsi.nama_provinsi" required="true" autofocus :class="{ 'p-invalid': submitted && !provinsi.nama_provinsi }" />
    <small class="p-invalid" v-if="submitted && !provinsi.nama_provinsi">Nama Provinsi is required.</small>
</div>

  <template #footer>
    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProvinsi" />
  </template>
</Dialog>\



<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    loadProducts();
});

const loadProducts = async () => {
    try {
        const response = await axios.get('/api/products');
        products.value = response.data;
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products', life: 3000 });
    }
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = async () => {
    submitted.value = true;
    if (product.value.name && product.value.name.trim() && product.value.price) {
        if (product.value.kode_prov) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            try {
                await axios.put(`/api/products/${product.value.kode_prov}`, product.value);
                products.value[findIndexById(product.value.kode_prov)] = product.value;
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } catch (error) {
                console.error(error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product', life: 3000 });
            }
        } else {
            product.value.kode_prov = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            try {
                await axios.post('/api/products', product.value);
                products.value.push(product.value);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            } catch (error) {
                console.error(error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create product', life: 3000 });
            }
        }
        productDialog.value = false;
        product.value = {};
    }
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    console.log(product);
    productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = async () => {
    try {
        await axios.delete(`/api/products/${product.value.kode_prov}`);
        products.value = products.value.filter((val) => val.kode_prov !== product.value.kode_prov);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
    }
    deleteProductDialog.value = false;
    product.value = {};
};

const findIndexById = (kode_prov) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].kode_prov === kode_prov) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let kode_prov = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        kode_prov += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return kode_prov;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const deleteSelectedProducts = async () => {
    try {
        const selectedProductIds = selectedProducts.value.map((product) => product.kode_prov);
        await axios.post('/api/products/delete', { ids: selectedProductIds });
        products.value = products.value.filter((val) => !selectedProductIds.includes(val.kode_prov));
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete products', life: 3000 });
    }
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const toast = useToast();

const provinsi = ref(null);
const provinsiDialog = ref(false);
const deleteProvinsiDialog = ref(false);
const deleteProvinsiDialog = ref(false);
const provinsi = ref({});
const selectedProvinsi = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    loadProvinsi();
});

const loadProvinsi = async () => {
    try {
        const response = await axios.get('/api/provinsi');
        provinsi.value = response.data;
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load provinsi', life: 3000 });
    }
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
    if (provinsi.value.kode_prov && provinsi.value.nama_provinsi) {
        if (provinsi.value.kode_prov) {
            try {
                await axios.put(`/api/provinsi/${provinsi.value.kode_prov}`, provinsi.value);
                provinsi.value[findIndexById(provinsi.value.kode_prov)] = provinsi.value;
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Updated', life: 3000 });
            } catch (error) {
                console.error(error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update provinsi', life: 3000 });
            }
        } else {
            try {
                await axios.post('/api/provinsi', provinsi.value);
                provinsi.value.push(provinsi.value);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Created', life: 3000 });
            } catch (error) {
                console.error(error);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create provinsi', life: 3000 });
            }
        }
        provinsiDialog.value = false;
        provinsi.value = {};
    }
};

const editProvinsi = (editProvinsi) => {
    provinsi.value = { ...editProvinsi };
    provinsiDialog.value = true;
};

const confirmDeleteProvinsi = (editProvinsi) => {
    provinsi.value = editProvinsi;
    deleteProvinsiDialog.value = true;
};

const deleteProvinsi = async () => {
    try {
        await axios.delete(`/api/provinsi/${provinsi.value.kode_prov}`);
        provinsi.value = provinsi.value.filter((val) => val.kode_prov !== provinsi.value.kode_prov);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete provinsi', life: 3000 });
    }
    deleteProvinsiDialog.value = false;
    provinsi.value = {};
};

const findIndexById = (kode_prov) => {
    let index = -1;
    for (let i = 0; i < provinsi.value.length; i++) {
        if (provinsi.value[i].kode_prov === kode_prov) {
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
    deleteProvinsiDialog.value = true;
};

const deleteSelectedProvinsi = async () => {
    try {
        const selectedProvinsiIds = selectedProvinsi.value.map((provinsi) => provinsi.kode_prov);
        await axios.post('/api/provinsi/delete', { ids: selectedProvinsiIds });
        provinsi.value = provinsi.value.filter((val) => !selectedProvinsiIds.includes(val.kode_prov));
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Provinsi Deleted', life: 3000 });
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete provinsi', life: 3000 });
    }
    deleteProvinsiDialog.value = false;
    selectedProvinsi.value = null;
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>
