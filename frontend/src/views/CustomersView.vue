<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

const customers = ref([])
const loading = ref(false)
const fetchError = ref('')
const isModalOpen = ref(false)
const modalRef = ref(null)
const submitError = ref('')
const submitting = ref(false)

const customerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  status: 'active',
})

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Prospect', value: 'prospect' },
  { label: 'Inactive', value: 'inactive' },
]

const resetForm = () => {
  customerForm.firstName = ''
  customerForm.lastName = ''
  customerForm.email = ''
  customerForm.phone = ''
  customerForm.company = ''
  customerForm.status = 'active'
  submitError.value = ''
}

watch(isModalOpen, async (open) => {
  if (open) {
    await nextTick()
    modalRef.value?.focus()
  } else {
    resetForm()
  }
})

const normalizeName = (customer) => {
  if (customer.name) return customer.name
  const first = customer.firstName ?? customer.first_name ?? ''
  const last = customer.lastName ?? customer.last_name ?? ''
  return [first, last].filter(Boolean).join(' ') || '—'
}

const normalizeStatus = (customer) => {
  return (
    customer.status ??
    customer.customerStatus ??
    customer.customer_status ??
    'unknown'
  )
}

const normalizeDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const normalizedCustomers = computed(() =>
  customers.value.map((customer, index) => ({
    id: customer.id ?? customer.uuid ?? customer._id ?? index,
    name: normalizeName(customer),
    email:
      customer.email ??
      customer.emailAddress ??
      customer.email_address ??
      '—',
    phone:
      customer.phone ??
      customer.phoneNumber ??
      customer.phone_number ??
      '—',
    company: customer.company ?? customer.organisation ?? customer.organization ?? '—',
    status: normalizeStatus(customer),
    createdAt: normalizeDate(
      customer.createdAt ?? customer.created_at ?? customer.joinedAt ?? customer.joined_at
    ),
  }))
)

const fetchCustomers = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const response = await fetch('/api/customers', {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Unable to load customers. Please try again later.')
    }

    const payload = await response.json()
    if (Array.isArray(payload)) {
      customers.value = payload
    } else if (Array.isArray(payload?.data)) {
      customers.value = payload.data
    } else {
      customers.value = []
    }
  } catch (error) {
    console.error(error)
    fetchError.value = error instanceof Error ? error.message : 'Unable to load customers.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCustomers()
})

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  submitting.value = true
  submitError.value = ''
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        firstName: customerForm.firstName,
        lastName: customerForm.lastName,
        email: customerForm.email,
        phone: customerForm.phone,
        company: customerForm.company,
        status: customerForm.status,
      }),
    })

    if (!response.ok) {
      let errorMessage = 'Unable to create customer. Please review the form and try again.'
      try {
        const errorPayload = await response.json()
        errorMessage = errorPayload?.message ?? errorMessage
      } catch (error) {
        console.warn('Unable to parse error response', error)
      }
      throw new Error(errorMessage)
    }

    closeModal()
    await fetchCustomers()
  } catch (error) {
    console.error(error)
    submitError.value = error instanceof Error ? error.message : 'Unable to create customer.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <header class="flex flex-col gap-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-3xl font-bold text-slate-800">Customers</h1>
        <button
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-600/40 transition duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/60"
          type="button"
          @click="openModal"
        >
          New customer
        </button>
      </div>
      <p class="max-w-3xl text-sm leading-relaxed text-slate-500">
        Keep track of everyone you do business with in one place.
      </p>
    </header>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div v-if="loading" class="flex flex-col items-center justify-center gap-4 px-6 py-16 text-slate-500">
        <span class="h-8 w-8 animate-spin rounded-full border-2 border-brand-600/30 border-t-brand-600" aria-hidden="true"></span>
        <p>Loading customers…</p>
      </div>

      <div v-else-if="fetchError" class="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center text-red-600">
        <p>{{ fetchError }}</p>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 font-semibold text-red-600 transition duration-150 hover:border-red-300 hover:bg-red-50"
          @click="fetchCustomers"
        >
          Try again
        </button>
      </div>

      <div v-else-if="!normalizedCustomers.length" class="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center text-slate-500">
        <p>No customers yet. Start by adding your first customer.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[720px] border-separate border-spacing-0">
          <thead class="bg-slate-50 text-left">
            <tr>
              <th class="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Name</th>
              <th class="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</th>
              <th class="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Phone</th>
              <th class="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Company</th>
              <th class="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</th>
              <th class="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Joined</th>
            </tr>
          </thead>
          <tbody class="text-sm text-slate-900">
            <tr
              v-for="customer in normalizedCustomers"
              :key="customer.id"
              class="border-b border-slate-100 even:bg-slate-50/70 hover:bg-brand-600/10"
            >
              <td class="px-5 py-4 align-top">{{ customer.name }}</td>
              <td class="px-5 py-4 align-top">{{ customer.email }}</td>
              <td class="px-5 py-4 align-top">{{ customer.phone }}</td>
              <td class="px-5 py-4 align-top">{{ customer.company }}</td>
              <td class="px-5 py-4 align-top">
                <span
                  class="inline-flex min-w-[7rem] items-center justify-center rounded-full px-3 py-1 text-sm font-semibold capitalize"
                  :class="customer.status.toLowerCase() === 'inactive'
                    ? 'bg-slate-200 text-slate-600'
                    : customer.status.toLowerCase() === 'prospect'
                      ? 'bg-purple-100 text-purple-700'
                      : customer.status.toLowerCase() === 'unknown'
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-blue-100 text-blue-700'"
                >
                  {{ customer.status }}
                </span>
              </td>
              <td class="px-5 py-4 align-top">{{ customer.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal-fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-10 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div
          class="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-modal"
          role="document"
          tabindex="-1"
          ref="modalRef"
          @keydown.esc="closeModal"
        >
          <header class="flex items-center justify-between border-b border-slate-200 px-8 py-6">
            <h2 class="text-xl font-semibold text-slate-900">New customer</h2>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full text-2xl text-slate-500 transition duration-150 hover:scale-105 hover:text-blue-600"
              @click="closeModal"
              aria-label="Close"
            >
              ×
            </button>
          </header>
          <form class="flex flex-col gap-5 px-8 py-6" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-5 lg:flex-row">
              <label class="flex flex-1 flex-col gap-2 text-slate-700">
                <span class="text-sm font-semibold text-slate-900">First name</span>
                <input
                  v-model="customerForm.firstName"
                  type="text"
                  name="firstName"
                  autocomplete="given-name"
                  class="rounded-xl border border-slate-200 px-3 py-2.5 text-base shadow-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </label>
              <label class="flex flex-1 flex-col gap-2 text-slate-700">
                <span class="text-sm font-semibold text-slate-900">Last name</span>
                <input
                  v-model="customerForm.lastName"
                  type="text"
                  name="lastName"
                  autocomplete="family-name"
                  class="rounded-xl border border-slate-200 px-3 py-2.5 text-base shadow-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </label>
            </div>

            <div class="flex flex-col gap-5 lg:flex-row">
              <label class="flex flex-1 flex-col gap-2 text-slate-700">
                <span class="text-sm font-semibold text-slate-900">Email</span>
                <input
                  v-model="customerForm.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  required
                  class="rounded-xl border border-slate-200 px-3 py-2.5 text-base shadow-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </label>
              <label class="flex flex-1 flex-col gap-2 text-slate-700">
                <span class="text-sm font-semibold text-slate-900">Phone</span>
                <input
                  v-model="customerForm.phone"
                  type="tel"
                  name="phone"
                  autocomplete="tel"
                  class="rounded-xl border border-slate-200 px-3 py-2.5 text-base shadow-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </label>
            </div>

            <label class="flex flex-col gap-2 text-slate-700">
              <span class="text-sm font-semibold text-slate-900">Company</span>
              <input
                v-model="customerForm.company"
                type="text"
                name="company"
                autocomplete="organization"
                class="rounded-xl border border-slate-200 px-3 py-2.5 text-base shadow-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
            </label>

            <label class="flex flex-col gap-2 text-slate-700">
              <span class="text-sm font-semibold text-slate-900">Status</span>
              <select
                v-model="customerForm.status"
                name="status"
                class="rounded-xl border border-slate-200 px-3 py-2.5 text-base shadow-sm transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              >
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>

            <p v-if="submitError" class="text-sm font-semibold text-red-600">{{ submitError }}</p>

            <footer class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-600 transition duration-150 hover:border-slate-300 hover:bg-slate-100"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-600/40 transition duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/60 disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="submitting"
              >
                <span
                  v-if="submitting"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
                  aria-hidden="true"
                ></span>
                <span>{{ submitting ? 'Saving…' : 'Save customer' }}</span>
              </button>
            </footer>
          </form>
        </div>
      </div>
    </transition>
  </section>
</template>
