<template>
  <section class="home">
    <h1>Welcome to Acme Co.</h1>
    <p>
      We build delightful digital experiences that help teams move faster and make
      better decisions. Explore our work, learn about our services, and connect
      with us to see how we can collaborate.
    </p>
    <div class="home-actions">
      <RouterLink class="cta" to="/contact">Let's work together</RouterLink>
      <button type="button" class="ghost-cta" @click="openModal">Learn more</button>
    </div>

    <Modal v-model="showAboutModal" title="How we partner with teams">
      <p>
        Every project starts with understanding your goals. We combine discovery
        workshops, rapid prototyping, and tight feedback loops to craft products
        that feel effortless to use. Our cross-functional team guides you from
        idea to launch and beyond.
      </p>
      <p>
        Ready to see what we can build together? Reach out and we'll shape a
        roadmap tailored to your team.
      </p>

      <template #footer>
        <button type="button" class="modal-secondary" @click="closeModal">Not yet</button>
        <RouterLink class="modal-primary" to="/contact" @click="closeModal">
          Start a project
        </RouterLink>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Modal from '../components/Modal.vue'

const showAboutModal = ref(false)

const openModal = () => {
  showAboutModal.value = true
}

const closeModal = () => {
  showAboutModal.value = false
}
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

.home-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
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

.ghost-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  border: 1px solid rgba(37, 99, 235, 0.35);
  background: rgba(37, 99, 235, 0.08);
  color: #1d4ed8;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}

.ghost-cta:hover {
  background: rgba(37, 99, 235, 0.12);
  border-color: rgba(37, 99, 235, 0.55);
}

.modal-primary,
.modal-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
}

.modal-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
  border: none;
  cursor: pointer;
}

.modal-primary:hover {
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.45);
}

.modal-secondary {
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: #f8fafc;
  color: #475569;
  cursor: pointer;
}

.modal-secondary:hover {
  border-color: rgba(100, 116, 139, 0.8);
}
</style>
