import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import { useAuthStore } from '../stores/auth-store'
import { useUtilStore } from '../stores/util-store'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    // Services Pages *************************************
    {
        path: '/terapias',
        name: 'Therapies',
        component: () => import('../views/Therapy.vue')
    },
    {
        path: '/blog',
        name: 'Blog',
        component: () => import('../views/Blog.vue')
    },
    {
        path: '/blog/:post_slug',
        name: 'BlogOne',
        component: () => import('../views/BlogOne.vue')
    },
    // NOTA: Aunque el backend es "Products", mantenemos la URL semántica para el usuario
    {
        path: '/formaciones',
        name: 'Formations',
        component: () => import('../views/Formations.vue')
    },
    {
        path: '/formaciones/:formation_slug',
        name: 'FormationsOne',
        component: () => import('../views/FormationsOne.vue')
    },
    {
        path: '/formaciones/:formation_slug/dashboard',
        name: 'FormationsDashboard',
        component: () => import('../views/FormationsDashboard.vue'),
        meta: { requires_auth: true }
    },
    {
        path: '/inscripcion/:formation_slug',
        name: 'Enrollment',
        component: () => import('../views/Enrollment.vue')
    },
    {
        path: '/inscripcion-exitosa/:formation_slug',
        name: 'EnrollmentConfirmation',
        component: () => import('../views/confirmations/EnrollmentConfirmation.vue')
    },
    // Test Pages *************************************
    {
        path: '/tests',
        name: 'Tests',
        component: () => import('../views/Tests.vue')
    },
    {
        path: '/tests/:test_name',
        name: 'Test',
        component: () => import('../views/TestOne.vue')
    },
    // Auth Pages *************************************
    {
        path: '/acceso',
        name: 'Acceso',
        component: () => import('../views/Access.vue')
    },
    {
        path: '/verify',
        name: 'Verify Email',
        component: () => import('../views/auth/VerifyEmail.vue')
    },
    {
        path: '/verify-login',
        name: 'Verify Login',
        component: () => import('../views/auth/VerifyLogin.vue')
    },
    {
        path: '/go-to-email',
        name: 'Go To Email',
        component: () => import('../views/auth/GoToEmail.vue')
    },
    {
        path: '/reset-password',
        name: 'Reset Password',
        component: () => import('../views/auth/ResetPassword.vue')
    },
    // Dashboard Pages *************************************
    {
        path: '/mi-espacio',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { requires_auth: true }
    },
    {
        path: '/mi-espacio/user/:user_id',
        name: 'One User Info',
        component: () => import('../views/admin/OneUserInfo.vue'),
        meta: { requires_auth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    // Resetear scroll al cambiar de página
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        return { top: 0 }
    }
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    const auth_store = useAuthStore()
    const requires_auth = to.matched.some(record => record.meta.requires_auth)
    const has_refresh_token = localStorage.getItem('refresh_token') // Antes era 'login'

    // Si ya tenemos token en memoria, pasamos
    if (auth_store.token) {
        return next()
    }

    // Si hay refresh token en localstorage, intentamos restaurar sesión
    if (has_refresh_token) {
        try {
            const success = await auth_store.refresh()
            if (success) {
                return next()
            }
        } catch (error) {
            console.error('Error auto-login:', error)
            // Si falla el refresh, limpiaremos todo en auth_store.logout()
        }
    }

    // Si la ruta requiere auth y no logramos autenticar
    if (requires_auth) {
        return next({
            path: '/acceso',
            query: { redirect: to.fullPath }
        })
    }

    next()
})

router.afterEach((to, from) => {
    // No guardamos estas páginas en el historial de redirección
    const excluded_pages = ['Verify Login', 'Verify Email', 'Acceso', 'Go To Email']

    if (!excluded_pages.includes(to.name)) {
        const util_store = useUtilStore()
        util_store.set_last_page(to.fullPath)
    }
})

export default router