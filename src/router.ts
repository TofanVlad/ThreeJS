import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/', component: () => import('./pages/index.vue') },
    { path: '/animated-cubes', component: () => import('./pages/AnimatedCubes.vue') },
    { path: '/shapes', component: () => import('./pages/Shapes.vue') },
    { path: '/solar-system', component: () => import('./pages/SolarSystem.vue') },
    { path: '/globe', component: () => import('./pages/Globe.vue') },
    { path: '/caps', component: () => import('./pages/Caps.vue') },
    { path: '/prism', component: () => import('./pages/Prism.vue') },
    { path: '/Arhiterra', component: () => import('./pages/Arhiterra.vue') },
    { path: '/coins', component: () => import('./pages/Coins.vue') },
    { path: '/shaders', component: () => import('./pages/Shaders.vue') },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router