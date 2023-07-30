import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        
        {
            path: '/',
            redirect: '/landing',
            component: AppLayout,
 
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                // {
                //     path: '/uikit/formlayout',
                //     name: 'formlayout',
                //     component: () => import('@/views/uikit/FormLayout.vue')
                // },
                // {
                //     path: '/uikit/input',
                //     name: 'input',
                //     component: () => import('@/views/uikit/Input.vue')
                // },
                // {
                //     path: '/uikit/floatlabel',
                //     name: 'floatlabel',
                //     component: () => import('@/views/uikit/FloatLabel.vue')
                // },
                // {
                //     path: '/uikit/invalidstate',
                //     name: 'invalidstate',
                //     component: () => import('@/views/uikit/InvalidState.vue')
                // },
                // {
                //     path: '/uikit/button',
                //     name: 'button',
                //     component: () => import('@/views/uikit/Button.vue')
                // },
                // {
                //     path: '/uikit/table',
                //     name: 'table',
                //     component: () => import('@/views/uikit/Table.vue')
                // },
                // {
                //     path: '/uikit/list',
                //     name: 'list',
                //     component: () => import('@/views/uikit/List.vue')
                // },
                // {
                //     path: '/uikit/tree',
                //     name: 'tree',
                //     component: () => import('@/views/uikit/Tree.vue')
                // },
                // {
                //     path: '/uikit/panel',
                //     name: 'panel',
                //     component: () => import('@/views/uikit/Panels.vue')
                // },

                // {
                //     path: '/uikit/overlay',
                //     name: 'overlay',
                //     component: () => import('@/views/uikit/Overlay.vue')
                // },
                // {
                //     path: '/uikit/media',
                //     name: 'media',
                //     component: () => import('@/views/uikit/Media.vue')
                // },
                // {
                //     path: '/uikit/menu',
                //     component: () => import('@/views/uikit/Menu.vue'),
                //     children: [
                //         {
                //             path: '/uikit/menu',
                //             component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                //         },
                //         {
                //             path: '/uikit/menu/seat',
                //             component: () => import('@/views/uikit/menu/SeatDemo.vue')
                //         },
                //         {
                //             path: '/uikit/menu/payment',
                //             component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                //         },
                //         {
                //             path: '/uikit/menu/confirmation',
                //             component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                //         }
                //     ]
                // },
                // {
                //     path: '/uikit/message',
                //     name: 'message',
                //     component: () => import('@/views/uikit/Messages.vue')
                // },
                // {
                //     path: '/uikit/file',
                //     name: 'file',
                //     component: () => import('@/views/uikit/File.vue')
                // },
                // {
                //     path: '/uikit/charts',
                //     name: 'charts',
                //     component: () => import('@/views/uikit/Chart.vue')
                // },
                // {
                //     path: '/uikit/misc',
                //     name: 'misc',
                //     component: () => import('@/views/uikit/Misc.vue')
                // },
                // {
                //     path: '/blocks',
                //     name: 'blocks',
                //     component: () => import('@/views/utilities/Blocks.vue')
                // },
                // {
                //     path: '/utilities/icons',
                //     name: 'icons',
                //     component: () => import('@/views/utilities/Icons.vue')
                // },
                // {
                //     path: '/pages/timeline',
                //     name: 'timeline',
                //     component: () => import('@/views/pages/Timeline.vue')
                // },
                // {
                //     path: '/pages/empty',
                //     name: 'empty',
                //     component: () => import('@/views/pages/Empty.vue')
                // },
                // {
                //     path: '/pages/crud',
                //     name: 'crud',
                //     component: () => import('@/views/pages/Crud.vue')
                // },
                {
                    path: '/pages/provinsi',
                    name: 'provinsi',
                    component: () => import('@/views/pages/Provinsi.vue')
                },
                {
                    path: '/pages/potensidesa',
                    name: 'potensidesa',
                    component: () => import('@/views/pages/PotensiDesa.vue')
                },
                {
                    path: '/pages/kabupaten',
                    name: 'kabupaten',
                    component: () => import('@/views/pages/Kabupaten.vue')
                },
                {
                    path: '/pages/kecamatan',
                    name: 'kecamatan',
                    component: () => import('@/views/pages/Kecamatan.vue')
                },
                {
                    path: '/pages/desa',
                    name: 'desa',
                    component: () => import('@/views/pages/Desa.vue')
                },
                {
                    path: '/pages/kodepos',
                    name: 'kodepos',
                    component: () => import('@/views/pages/Kodepos.vue')
                },
                {
                    path: '/pages/kodepos',
                    name: 'kodepos',
                    component: () => import('@/views/pages/Kodepos.vue')
                },
                // {
                //     path: '/pages/pengiriman',
                //     name: 'pengiriman',
                //     component: () => import('@/views/pages/Pengiriman.vue')
                // },
                {
                    path: '/pages/user',
                    name: 'user',
                    component: () => import('@/views/pages/user.vue')
                },
                {
                    path: '/pages/userlog',
                    name: 'userlog',
                    component: () => import('@/views/pages/userlog.vue')
                },
                // {
                //     path: '/documentation',
                //     name: 'documentation',
                //     component: () => import('@/views/utilities/Documentation.vue')
                // }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/map',
            name: 'map',
            component: () => import('@/views/pages/map.vue')
        },
        {
            path: '/detail/:wilayah',
            name: 'detail-location',
            component: () => import('@/views/pages/Detail.vue'),
            props: true,
            beforeEnter: (to, from, next) => {
              if (to.params.kodepos) {
                next({ name: 'detail-kodepos', params: { kodepos: to.params.kodepos } });
              } else {
                next();
              }
            }
          },
          
          {
            path: '/detail/:kodepos',
            name: 'detail-kodepos',
            component: () => import('@/views/pages/Detail.vue'),
            props: true
          },
          {
            path: '/detail-list/:kodepos',
            name: 'detail-kodepos5',
            component: () => import('@/views/pages/ListDetail.vue'),
            props: true
          },
          
          
        // {
        //     path: '/pages/notfound',
        //     name: 'notfound',
        //     component: () => import('@/views/pages/NotFound.vue')
        // },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        // {
        //     path: '/auth/access',
        //     name: 'accessDenied',
        //     component: () => import('@/views/pages/auth/Access.vue')
        // },
        // {
        //     path: '/auth/error',
        //     name: 'error',
        //     component: () => import('@/views/pages/auth/Error.vue')
        // }
    ]
});

export default router;
