<script setup>
import { computed } from 'vue'
import { useAlerts } from '../stores/alerts.js'

const { alerts, dismiss } = useAlerts()

const TYPE_META = {
  info: {
    icon: 'ℹ️',
    wrapper: 'border-blue-500 bg-blue-50 text-blue-900 ring-blue-200/70',
    aria: 'polite',
    role: 'status',
  },
  success: {
    icon: '✅',
    wrapper: 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-emerald-200/70',
    aria: 'polite',
    role: 'status',
  },
  warning: {
    icon: '⚠️',
    wrapper: 'border-amber-500 bg-amber-50 text-amber-900 ring-amber-200/70',
    aria: 'assertive',
    role: 'status',
  },
  error: {
    icon: '❌',
    wrapper: 'border-rose-500 bg-rose-50 text-rose-900 ring-rose-200/70',
    aria: 'assertive',
    role: 'alert',
  },
}

const decoratedAlerts = computed(() =>
  alerts.map((alert) => ({
    ...alert,
    meta: TYPE_META[alert.type] ?? TYPE_META.info,
  })),
)

const hasAlerts = computed(() => decoratedAlerts.value.length > 0)

const close = (id) => {
  dismiss(id)
}
</script>

<template>
  <Teleport to="body">
    <transition-group
      v-if="hasAlerts"
      name="toast"
      tag="div"
      class="pointer-events-none fixed inset-x-4 top-4 z-[1100] flex flex-col gap-3 sm:inset-auto sm:top-6 sm:right-6 sm:w-full sm:max-w-sm"
    >
      <article
        v-for="alert in decoratedAlerts"
        :key="alert.id"
        class="pointer-events-auto flex w-full items-start gap-3 rounded-xl border-l-4 p-4 shadow-2xl shadow-slate-900/10 ring-1 ring-inset"
        :class="alert.meta.wrapper"
        :role="alert.meta.role"
        :aria-live="alert.meta.aria"
      >
        <span class="mt-0.5 text-lg leading-none">{{ alert.meta.icon }}</span>
        <p class="flex-1 text-sm font-medium leading-relaxed">{{ alert.message }}</p>
        <button
          type="button"
          class="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
          @click="close(alert.id)"
        >
          <span class="sr-only">Dismiss</span>
          ×
        </button>
      </article>
    </transition-group>
  </Teleport>
</template>