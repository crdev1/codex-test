<template>
  <section class="mx-auto grid max-w-lg gap-8">
    <header class="space-y-3">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">Welcome back</h1>
      <p class="text-base leading-relaxed text-slate-600">Please sign in to access your personalized dashboard.</p>
    </header>

    <form class="grid gap-5 rounded-2xl bg-white p-8 shadow-2xl shadow-slate-900/5" @submit.prevent="handleSubmit">
      <label class="grid gap-2 text-sm font-semibold text-slate-700">
        Name
        <input
          v-model="form.name"
          type="text"
          name="name"
          autocomplete="name"
          placeholder="Jane Doe"
          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      </label>
      <label class="grid gap-2 text-sm font-semibold text-slate-700">
        Email
        <input
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          required
          placeholder="you@example.com"
          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      </label>
      <label class="grid gap-2 text-sm font-semibold text-slate-700">
        Password
        <input
          v-model="form.password"
          type="password"
          name="password"
          autocomplete="current-password"
          required
          placeholder="••••••••"
          class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      </label>
      <p v-if="error" class="-mt-2 text-sm font-semibold text-red-600">{{ error }}</p>
      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/40 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/50"
      >
        Log in
      </button>
    </form>

    <p class="text-sm text-slate-600">
      New to Acme Co.? Reach out via the
      <RouterLink class="font-semibold text-brand-600 hover:underline" to="/contact">contact page</RouterLink>
      to get an account.
    </p>
  </section>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const { login, isAuthenticated } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const error = ref('')

watchEffect(() => {
  if (isAuthenticated.value) {
    router.replace(route.query.redirect?.toString() || '/dashboard')
  }
})

const handleSubmit = () => {
  error.value = ''

  if (!form.email || !form.password) {
    error.value = 'Please provide both an email and password.'
    return
  }

  try {
    login({ name: form.name, email: form.email })
    router.push(route.query.redirect?.toString() || '/dashboard')
  } catch (err) {
    error.value = err.message || 'Unable to log in right now. Please try again.'
  }
}
</script>
