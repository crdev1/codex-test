<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <nav class="site-nav">
        <RouterLink to="/" class="brand">Acme Co.</RouterLink>
        <div class="nav-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/contact">Contact</RouterLink>
        </div>
      </nav>
    </header>

    <main class="site-content">
      <RouterView />
    </main>

    <footer class="site-footer">
      <small>© {{ new Date().getFullYear() }} Acme Co. All rights reserved.</small>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  padding: 1.25rem 1.5rem;
  color: #fff;
  box-shadow: 0 12px 30px rgba(29, 78, 216, 0.2);
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 960px;
  margin: 0 auto;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  transition: background 150ms ease, color 150ms ease;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.site-content {
  flex: 1;
  width: min(960px, 100%);
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.site-footer {
  background: #0f172a;
  color: rgba(255, 255, 255, 0.7);
  padding: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
}
</style>
