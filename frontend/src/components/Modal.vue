<template>
  <Teleport to="body">
    <!-- Teleport keeps the modal above app-level stacking contexts and portals animations correctly -->
    <transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 grid place-items-center bg-slate-900/60 backdrop-blur-sm p-6 z-[1000]"
        role="presentation"
        @click="onBackdrop"
      >
        <div
          class="relative grid w-full max-w-xl gap-6 rounded-2xl bg-white p-8 shadow-modal sm:p-10"
          role="dialog"
          :aria-modal="true"
          :aria-label="computedAriaLabel"
          @click.stop
        >
          <header v-if="$slots.header || title" class="flex items-center justify-between gap-4">
            <slot name="header">
              <h2 class="text-2xl font-semibold text-slate-900">{{ title }}</h2>
            </slot>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full p-1 text-2xl text-slate-500 transition duration-150 hover:scale-105 hover:text-blue-600"
              aria-label="Close dialog"
              @click="close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>

          <section class="text-slate-600 leading-relaxed">
            <slot />
          </section>

          <footer v-if="$slots.footer" class="flex justify-end gap-3">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { Teleport, computed, onBeforeUnmount, onMounted, watch } from 'vue'

/**
 * Accessible modal shell with optional header/footer slots, scroll locking, and keyboard shortcuts.
 */
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

let previousOverflow = ''

const computedAriaLabel = computed(() => props.ariaLabel || props.title || 'Dialog')

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onBackdrop = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const onKeydown = (event) => {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

const lockScroll = () => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

const restoreScroll = () => {
  document.body.style.overflow = previousOverflow || ''
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  restoreScroll()
})

// Keep background from scrolling while the modal is open and restore state on close.
watch(
  () => props.modelValue,
  (value) => {
    if (typeof window === 'undefined') return
    if (value) {
      lockScroll()
    } else {
      restoreScroll()
    }
  }
)
</script>
