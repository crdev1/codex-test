<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <div class="space-y-6 text-center">
    <h1 class="text-3xl font-bold text-slate-900">{{ msg }}</h1>

    <div class="space-y-4">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-600/40 transition duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/60"
        @click="count++"
      >
        count is {{ count }}
      </button>
      <p class="text-sm text-slate-600">
        Edit <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs">components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <p class="text-sm text-slate-600">
      Check out
      <a class="font-semibold text-brand-600 hover:underline" href="https://vuejs.org/guide/quick-start.html#local" target="_blank">
        create-vue
      </a>
      , the official Vue + Vite starter
    </p>
    <p class="text-sm text-slate-600">
      Learn more about IDE Support for Vue in the
      <a
        class="font-semibold text-brand-600 hover:underline"
        href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
        target="_blank"
      >
        Vue Docs Scaling up Guide
      </a>
      .
    </p>
    <p class="text-sm text-slate-500">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>
