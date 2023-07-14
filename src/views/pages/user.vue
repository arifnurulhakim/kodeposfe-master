<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const users = ref(null);
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const deleteUsersDialog = ref(false);
const user = ref({});
const selectedUsers = ref(null);
const dt = ref(null);
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
        .get('api/getAlluser')
        .then((response) => {
            if (response.data.status === 'success') {
                users.value = response.data.data;
            }
        })
        .catch((error) => {
            console.error(error);
        });
};

const openNew = () => {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const saveUser = async () => {
    submitted.value = true;
    if (user.value.name && user.value.email && user.value.password){
        console.log(user.value.id);
      if (user.value.id) {
        const index = findIndexById(user.value.id);
        users.value[index] = user.value;
        await axios.put(`/api/updateUser/${user.value.id}`, {
          name: user.value.name,
          email: user.value.email,
          password: user.value.password
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        userDialog.value = false;
      user.value = {};
      } else {
        users.value.push(user.value);
        await axios.post('/api/register', {
            name: user.value.name,
          email: user.value.email,
          password: user.value.password
        });
        toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
        userDialog.value = false;
      user.value = {};
      }
      userDialog.value = false;
      user.value = {};
    }
  };


const editUser = (editUser) => {
    user.value = { ...editUser };
    console.log(user);
    userDialog.value = true;
};

const confirmDeleteUser = (editUser) => {
    user.value = editUser;
    deleteUserDialog.value = true;
};

const deleteUser = async () => {
  try {
    await axios.delete(`/api/user/${user.value.id}`);
    
    users.value = users.value.filter((val) => val.id !== user.value.id);
    deleteUserDialog.value = false;
    user.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
  } catch (error) {
    // Handle any errors that occurred during the API request
    console.error(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
  }
};


const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.value.length; i++) {
        if (users.value[i].id === id) {
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
    deleteUsersDialog.value = true;
};
const deleteSelectedUsers = async () => {
  try {
    const selectedUserIds = selectedUsers.value.map((user) => user.id);
    await axios.delete(`/api/user`, { data: { ids: selectedUserIds } });
    
    users.value = users.value.filter((val) => !selectedUsers.value.includes(val));
    deleteUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
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
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="users"
                    v-model:selection="selectedUsers"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
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

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="name" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                        <span class="p-column-title">Name</span>
                        {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="email" header="Email" :sortable="true" headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Email</span>
                            {{ slotProps.data.email }}
                        </template>
                        </Column>

                    <Column headerStyle="min-width:15rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUser(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUser(slotProps.data)" />
                            </template>
                            </Column>
                    </DataTable>
                    <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="User Details" :modal="true" class="p-fluid">
                        <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="user.name" required="true" autofocus :class="{ 'p-invalid': submitted && !user.name }" />
                        <small class="p-invalid" v-if="submitted && !user.name">Name is required.</small>
                        </div>

                        <div class="field">
                        <label for="email">Email</label>
                        <InputText id="email" v-model.trim="user.email" required="true" :class="{ 'p-invalid': submitted && !user.email }" />
                        <small class="p-invalid" v-if="submitted && !user.email">Email is required.</small>
                        </div>

                        <div class="field">
                        <label for="password">Password</label>
                        <Password id="password" v-model.trim="user.password" :class="{ 'p-invalid': submitted && !user.password }" />
                        <small class="p-invalid" v-if="submitted && !user.password"></small>
                        </div>


                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveUser" />
                    </template>
                    </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >Are you sure you want to delete <b>{{ user.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user">Are you sure you want to delete the selected users?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedUsers" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
