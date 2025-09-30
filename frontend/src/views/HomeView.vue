<template>
  <section class="home">
    <h1>Welcome to Acme Co.</h1>
    <p>
      We build delightful digital experiences that help teams move faster and make
      better decisions. Explore our work, learn about our services, and connect
      with us to see how we can collaborate.
    </p>
    <RouterLink class="cta" to="/contact">Let's work together</RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.home {
  display: grid;
  gap: 1.5rem;
  text-align: left;
}

.home h1 {
  font-size: clamp(2.5rem, 5vw, 3.25rem);
  margin: 0;
  color: #0f172a;
}

.home p {
  margin: 0;
  font-size: 1.1rem;
  color: #475569;
  max-width: 40rem;
  line-height: 1.7;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.45);
}
</style>
