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
  <section class="customers-page">
    <header class="page-header">
      <div class="header-bar">
        <h1>Customers</h1>
        <button class="primary" type="button" @click="openModal">New customer</button>
      </div>
      <p class="subtitle">Keep track of everyone you do business with in one place.</p>
    </header>

    <div class="table-card">
      <div v-if="loading" class="table-state">
        <span class="loader" aria-hidden="true"></span>
        <p>Loading customers…</p>
      </div>

      <div v-else-if="fetchError" class="table-state error">
        <p>{{ fetchError }}</p>
        <button type="button" class="secondary" @click="fetchCustomers">Try again</button>
      </div>

      <div v-else-if="!normalizedCustomers.length" class="table-state">
        <p>No customers yet. Start by adding your first customer.</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Company</th>
              <th scope="col">Status</th>
              <th scope="col">Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in normalizedCustomers" :key="customer.id">
              <td data-title="Name">{{ customer.name }}</td>
              <td data-title="Email">{{ customer.email }}</td>
              <td data-title="Phone">{{ customer.phone }}</td>
              <td data-title="Company">{{ customer.company }}</td>
              <td data-title="Status">
                <span class="status-pill" :data-status="customer.status.toLowerCase()">{{
                  customer.status
                }}</span>
              </td>
              <td data-title="Joined">{{ customer.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal">
      <div
        v-if="isModalOpen"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div class="modal" role="document" tabindex="-1" ref="modalRef" @keydown.esc="closeModal">
          <header class="modal-header">
            <h2>New customer</h2>
            <button type="button" class="icon-button" @click="closeModal" aria-label="Close">
              ×
            </button>
          </header>
          <form class="modal-body" @submit.prevent="handleSubmit">
            <div class="form-row">
              <label class="form-field">
                <span>First name</span>
                <input v-model="customerForm.firstName" type="text" name="firstName" autocomplete="given-name" />
              </label>
              <label class="form-field">
                <span>Last name</span>
                <input v-model="customerForm.lastName" type="text" name="lastName" autocomplete="family-name" />
              </label>
            </div>

            <div class="form-row">
              <label class="form-field">
                <span>Email</span>
                <input v-model="customerForm.email" type="email" name="email" autocomplete="email" required />
              </label>
              <label class="form-field">
                <span>Phone</span>
                <input v-model="customerForm.phone" type="tel" name="phone" autocomplete="tel" />
              </label>
            </div>

            <label class="form-field">
              <span>Company</span>
              <input v-model="customerForm.company" type="text" name="company" autocomplete="organization" />
            </label>

            <label class="form-field">
              <span>Status</span>
              <select v-model="customerForm.status" name="status">
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>

            <p v-if="submitError" class="form-error">{{ submitError }}</p>

            <footer class="modal-footer">
              <button type="button" class="secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="primary" :disabled="submitting">
                <span v-if="submitting" class="button-spinner" aria-hidden="true"></span>
                <span>{{ submitting ? 'Saving…' : 'Save customer' }}</span>
              </button>
            </footer>
          </form>
        </div>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.customers-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.header-bar h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.subtitle {
  color: #64748b;
  max-width: 36rem;
}

.primary {
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: filter 150ms ease, transform 150ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.primary:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary {
  border: 1px solid #cbd5f5;
  background: #fff;
  color: #1e3a8a;
  font-weight: 600;
  padding: 0.6rem 1.1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}

.secondary:hover {
  background: #eff6ff;
}

.table-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

.data-table thead {
  background: #eff6ff;
  text-align: left;
}

.data-table th,
.data-table td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.95rem;
}

.data-table tbody tr:nth-child(even) {
  background: rgba(241, 245, 249, 0.5);
}

.data-table tbody tr:hover {
  background: rgba(59, 130, 246, 0.08);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: capitalize;
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
}

.status-pill[data-status='inactive'] {
  background: rgba(148, 163, 184, 0.35);
  color: #475569;
}

.status-pill[data-status='prospect'] {
  background: rgba(147, 51, 234, 0.15);
  color: #6b21a8;
}

.status-pill[data-status='unknown'] {
  background: rgba(148, 163, 184, 0.35);
  color: #475569;
}

.table-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  gap: 1rem;
  text-align: center;
  color: #475569;
}

.table-state.error {
  color: #b91c1c;
}

.loader {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top-color: #2563eb;
  animation: spin 900ms linear infinite;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 50;
}

.modal {
  background: #fff;
  border-radius: 1rem;
  width: min(640px, 100%);
  max-height: min(90vh, 720px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 60px rgba(15, 23, 42, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.icon-button {
  border: none;
  background: none;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  color: #334155;
}

.icon-button:hover {
  color: #1d4ed8;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.75rem;
  overflow-y: auto;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 720px) {
  .form-row {
    flex-direction: row;
  }

  .form-row .form-field {
    flex: 1;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: #1f2937;
}

.form-field span {
  font-weight: 600;
  color: #0f172a;
}

.form-field input,
.form-field select {
  border-radius: 0.75rem;
  border: 1px solid #cbd5f5;
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.form-field input:focus,
.form-field select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}

.form-error {
  color: #b91c1c;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 0.75rem;
}

.button-spinner {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-top-color: #fff;
  animation: spin 900ms linear infinite;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 150ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .data-table {
    min-width: 100%;
  }

  .data-table thead {
    display: none;
  }

  .data-table tr {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.35rem;
    padding: 0.85rem 1rem;
  }

  .data-table td {
    border: none;
    padding: 0.35rem 0;
    font-size: 0.95rem;
  }

  .data-table td::before {
    content: attr(data-title);
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #94a3b8;
    margin-bottom: 0.15rem;
  }
}
</style>
