<template>
  <section class="grid gap-6 text-left">
    <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
      Welcome to Acme Co.
    </h1>
    <p class="max-w-2xl text-lg leading-relaxed text-slate-600">
      We build delightful digital experiences that help teams move faster and make better decisions. Explore our work,
      learn about our services, and connect with us to see how we can collaborate.
    </p>
    <div class="flex flex-wrap items-center gap-4">
      <RouterLink
        class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/40 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/50"
        to="/contact"
      >
        Let's work together
      </RouterLink>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full border border-brand-600/40 bg-brand-600/10 px-6 py-3 font-semibold text-brand-700 transition duration-150 hover:border-brand-600/60 hover:bg-brand-600/15"
        @click="openModal"
      >
        Learn more
      </button>
    </div>

    <Modal v-model="showAboutModal" title="How we partner with teams">
      <p class="mb-4 text-base leading-relaxed text-slate-600">
        Every project starts with understanding your goals. We combine discovery workshops, rapid prototyping, and tight
        feedback loops to craft products that feel effortless to use. Our cross-functional team guides you from idea to
        launch and beyond.
      </p>
      <p class="text-base leading-relaxed text-slate-600">
        Ready to see what we can build together? Reach out and we'll shape a roadmap tailored to your team.
      </p>

      <template #footer>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-100 px-5 py-2.5 font-semibold text-slate-600 transition duration-150 hover:border-slate-400 hover:bg-slate-200"
          @click="closeModal"
        >
          Not yet
        </button>
        <RouterLink
          class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-600/40 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/50"
          to="/contact"
          @click="closeModal"
        >
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
