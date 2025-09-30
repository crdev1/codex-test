<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="modelValue"
        class="modal-overlay"
        role="presentation"
        @click="onBackdrop"
      >
        <div
          class="modal-container"
          role="dialog"
          :aria-modal="true"
          :aria-label="computedAriaLabel"
          @click.stop
        >
          <header v-if="$slots.header || title" class="modal-header">
            <slot name="header">
              <h2 class="modal-title">{{ title }}</h2>
            </slot>
            <button
              type="button"
              class="modal-close"
              aria-label="Close dialog"
              @click="close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>

          <section class="modal-body">
            <slot />
          </section>

          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { Teleport, computed, onBeforeUnmount, onMounted, watch } from 'vue'

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

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 150ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 1.5rem;
  z-index: 1000;
}

.modal-container {
  width: min(560px, 100%);
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 32px 64px rgba(15, 23, 42, 0.25);
  display: grid;
  gap: 1.25rem;
  padding: 2rem;
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  color: #0f172a;
}

.modal-close {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  transition: color 150ms ease, transform 150ms ease;
}

.modal-close:hover {
  color: #1d4ed8;
  transform: scale(1.05);
}

.modal-body {
  color: #475569;
  line-height: 1.7;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 520px) {
  .modal-container {
    padding: 1.5rem;
  }
}
</style>
