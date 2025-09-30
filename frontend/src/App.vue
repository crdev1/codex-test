<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './stores/auth.js'
import ToastHost from './components/ToastHost.vue'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-2xl px-6 py-5">
      <nav class="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <RouterLink to="/" class="text-2xl font-bold tracking-wide">Acme Co.</RouterLink>
        <div class="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <RouterLink to="/" class="nav-pill">Home</RouterLink>
          <RouterLink to="/contact" class="nav-pill">Contact</RouterLink>
          <RouterLink to="/customers" class="nav-pill">Customers</RouterLink>
          <RouterLink v-if="isAuthenticated" to="/dashboard" class="nav-pill">Dashboard</RouterLink>
          <span
            v-if="isAuthenticated"
            class="hidden items-center gap-2 rounded-full bg-slate-900/25 px-3 py-1 font-semibold text-white/90 md:inline-flex"
          >
            Hi, {{ user?.name }}
          </span>
          <button
            v-if="isAuthenticated"
            type="button"
            class="inline-flex items-center rounded-full bg-white/20 px-3 py-1 font-semibold text-white transition duration-150 hover:bg-white/30"
            @click="handleLogout"
          >
            Log out
          </button>
          <RouterLink v-else to="/login" class="nav-pill">Log in</RouterLink>
        </div>
      </nav>
    </header>

    <main class="flex-1 w-full max-w-5xl px-6 py-12 sm:px-8 lg:px-10 xl:px-12 mx-auto">
      <RouterView />
    </main>

    <ToastHost />

    <footer class="bg-slate-900 py-6 text-center text-sm text-white/70">
      <small>© {{ new Date().getFullYear() }} Acme Co. All rights reserved.</small>
    </footer>
  </div>
</template>