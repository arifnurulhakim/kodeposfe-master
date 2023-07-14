<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img src="/demo/images/login/kominfoo.png" alt="logo" />
      <div class="layout-topbar-content">
        <h1>KEMKOMINFO RI</h1>
        <h5>Menuju Masyarakat Informasi Indonesia</h5>
      </div>
    </router-link>
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
          <i class="pi pi-bars"></i>
        </button>
    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
          <i class="pi pi-ellipsis-v"></i>
        </button>
    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button>
      <button @click="onProfileClick" class="p-link layout-topbar-button">
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
      <button @click="onSettingsClick()" class="p-link layout-topbar-button">
            <i class="pi pi-cog"></i>
            <span>Settings</span>
          </button>
    </div>
    <div v-if="profileDropdownActive" class="layout-profile-dropdown">
      <div class="profile-dropdown-content">
        <div class="profile-info">
          <div class="profile-details">
            <h3>{{ profile.name }}</h3>
            <span>{{ profile.email }}</span>
          </div>
        </div>
        <ul class="profile-menu">
          <li>
            <router-link to="/profile">Edit Profile</router-link>
          </li>
          <li><button @click="logout" class="p-link layout-topbar-button">
    Logout
  </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount
  } from 'vue';
  import {
    useLayout
  } from '@/layout/composables/layout';
  import {
    useRouter
  } from 'vue-router';
  import axios from 'axios';
  const {
    layoutConfig,
    onMenuToggle
  } = useLayout();
  const outsideClickListener = ref(null);
  const topbarMenuActive = ref(false);
  const profileDropdownActive = ref(false);
  const router = useRouter();
  const profile = ref({
    name: '',
    email: '',
    avatar: ''
  });
  onMounted(() => {
    bindOutsideClickListener();
  });
  onBeforeUnmount(() => {
    unbindOutsideClickListener();
  });
  const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
  });
  const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
  };
  const onProfileClick = () => {
    topbarMenuActive.value = false;
    profileDropdownActive.value = !profileDropdownActive.value;
    if (profileDropdownActive.value) {
      fetchProfileData();
    }
  };
  const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
  };
  const topbarMenuClasses = computed(() => {
    return {
      'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
  });
  const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
      outsideClickListener.value = (event) => {
        if (isOutsideClicked(event)) {
          topbarMenuActive.value = false;
          profileDropdownActive.value = false;
        }
      };
      document.addEventListener('click', outsideClickListener.value);
    }
  };
  const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
      document.removeEventListener('click', outsideClickListener);
      outsideClickListener.value = null;
    }
  };
  const isOutsideClicked = (event) => {
    const menuEl = document.querySelector('.layout-topbar-menu');
    const profileEl = document.querySelector('.layout-topbar-menu-button');
    const dropdownEl = document.querySelector('.layout-profile-dropdown');
    if (!menuEl || !profileEl || !dropdownEl) {
      return true; // Return true if any of the elements are null or not found
    }
    return !(
      menuEl.isSameNode(event.target) ||
      menuEl.contains(event.target) ||
      profileEl.isSameNode(event.target) ||
      profileEl.contains(event.target) ||
      dropdownEl.isSameNode(event.target) ||
      dropdownEl.contains(event.target)
    );
  };
  const fetchProfileData = () => {
    axios
      .get('/api/getProfile')
      .then((response) => {
        const data = response.data.data;
        profile.value = {
          name: data.name,
          email: data.email,
          avatar: data.avatar
        };
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });
  };
  const logout = () => {
    axios
      .post('/api/logout')
      .then((response) => {
        // Handle successful logout, such as clearing user session and redirecting to the login page
        console.log('Logout successful');
        // Redirect to the login page
        router.push('/landing');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };
</script>
  
<style>
  .layout-topbar-logo {
    display: flex;
    align-items: center;
  }
  .layout-topbar-logo img {
    margin-right: 10px;
    /* Sesuaikan ukuran gambar dengan kebutuhan Anda */
  }
  .layout-topbar-content {
    display: flex;
    flex-direction: column;
  }
  .layout-topbar-content h1 {
    font-size: 20px;
    /* Sesuaikan ukuran teks dengan kebutuhan Anda */
    margin: 0;
    /* Menghilangkan margin bawaan */
  }
  .layout-topbar-content h5 {
    font-family: 'Roboto', sans-serif;
    font-size: 10px;
    /* Sesuaikan ukuran teks dengan kebutuhan Anda */
    margin: 0;
    /* Menghilangkan margin bawaan */
  }
  .layout-profile-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 100;
    width: 200px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  .profile-dropdown-content {
    padding: 16px;
  }
  .profile-info {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  .profile-info img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
  }
  .profile-details h3 {
    font-size: 16px;
    margin: 0;
  }
  .profile-details span {
    font-size: 12px;
    color: #777;
  }
  .profile-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .profile-menu li {
    margin-bottom: 8px;
  }
  .profile-menu a {
    color: #333;
    text-decoration: none;
  }
  .profile-menu a:hover {
    color: #007bff;
  }
</style>
  