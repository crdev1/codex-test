<template>
  <section class="auth">
    <header>
      <h1>Welcome back</h1>
      <p>Please sign in to access your personalized dashboard.</p>
    </header>

    <form class="auth-form" @submit.prevent="handleSubmit">
      <label>
        Name
        <input v-model="form.name" type="text" name="name" autocomplete="name" placeholder="Jane Doe" />
      </label>
      <label>
        Email
        <input
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          required
          placeholder="you@example.com"
        />
      </label>
      <label>
        Password
        <input
          v-model="form.password"
          type="password"
          name="password"
          autocomplete="current-password"
          required
          placeholder="••••••••"
        />
      </label>
      <p v-if="error" class="form-error">{{ error }}</p>
      <button type="submit">Log in</button>
    </form>

    <p class="footnote">
      New to Acme Co.? Reach out via the <RouterLink to="/contact">contact page</RouterLink> to get an account.
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

<style scoped>
.auth {
  display: grid;
  gap: 2rem;
  max-width: 480px;
  margin: 0 auto;
}

header h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.75rem);
  color: #0f172a;
}

header p {
  margin: 0.75rem 0 0;
  color: #475569;
  line-height: 1.7;
}

.auth-form {
  display: grid;
  gap: 1.5rem;
  background: #ffffff;
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08);
}

label {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

input {
  width: 100%;
  font: inherit;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

button {
  justify-self: start;
  padding: 0.75rem 1.75rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.45);
}

.form-error {
  margin: -0.5rem 0 0;
  color: #dc2626;
  font-weight: 600;
}

.footnote {
  margin: 0;
  color: #475569;
}

.footnote a {
  color: #2563eb;
  font-weight: 600;
}
</style>
