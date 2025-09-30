<script setup>
import { computed, ref } from 'vue'

import DataTable from '../components/DataTable.vue'

const contacts = ref([
  {
    id: 'contact-1',
    name: 'Amelia Chen',
    title: 'Director of Operations',
    email: 'amelia.chen@northwind.com',
    phone: '(555) 293-4821',
    company: 'Northwind Logistics',
    relationship: {
      type: 'customer',
      name: 'Northwind Logistics',
    },
    lastActivity: 'Reviewed implementation timeline · 2 days ago',
    initials: 'AC',
  },
  {
    id: 'contact-2',
    name: 'Luis Fernandez',
    title: 'Procurement Lead',
    email: 'luis.fernandez@solara.com',
    phone: '(555) 651-8804',
    company: 'Solara Manufacturing',
    relationship: {
      type: 'supplier',
      name: 'Solara Manufacturing',
    },
    lastActivity: 'Shared updated compliance documents · 5 hours ago',
    initials: 'LF',
  },
  {
    id: 'contact-3',
    name: 'Priya Natarajan',
    title: 'Head of Client Success',
    email: 'priya.natarajan@brightwave.com',
    phone: '(555) 770-1920',
    company: 'Brightwave Studios',
    relationship: {
      type: 'customer',
      name: 'Brightwave Studios',
    },
    lastActivity: 'Scheduled quarterly business review · Yesterday',
    initials: 'PN',
  },
  {
    id: 'contact-4',
    name: 'Dmitri Volkov',
    title: 'Strategic Partnerships',
    email: 'd.volkov@atlaspartners.io',
    phone: '(555) 488-9066',
    company: 'Atlas Partners',
    relationship: {
      type: 'supplier',
      name: 'Atlas Partners',
    },
    lastActivity: 'Discussed expansion opportunities · 4 days ago',
    initials: 'DV',
  },
  {
    id: 'contact-5',
    name: 'Isabella Rossi',
    title: 'Marketing Director',
    email: 'isabella.rossi@lumenbrands.com',
    phone: '(555) 402-1178',
    company: 'Lumen Brands',
    relationship: {
      type: 'customer',
      name: 'Lumen Brands',
    },
    lastActivity: 'Approved updated creative concepts · 3 hours ago',
    initials: 'IR',
  },
  {
    id: 'contact-6',
    name: 'Noah Patel',
    title: 'Supply Chain Analyst',
    email: 'noah.patel@vertexsupplies.com',
    phone: '(555) 980-4432',
    company: 'Vertex Supplies',
    relationship: {
      type: 'supplier',
      name: 'Vertex Supplies',
    },
    lastActivity: 'Flagged shipment delay · 1 day ago',
    initials: 'NP',
  },
])

const columns = [
  { key: 'name', label: 'Contact' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'company', label: 'Company' },
  { key: 'relationship', label: 'Assigned To' },
  { key: 'lastActivity', label: 'Last Activity' },
]

const totalContacts = computed(() => contacts.value.length)

const relationshipBreakdown = computed(() =>
  contacts.value.reduce(
    (acc, contact) => {
      const type = contact.relationship?.type ?? 'other'
      acc[type] = (acc[type] ?? 0) + 1
      return acc
    },
    { customer: 0, supplier: 0 },
  ),
)

const summary = computed(() => [
  {
    label: 'Total contacts',
    value: totalContacts.value,
    helper: 'People across every account',
  },
  {
    label: 'Customers',
    value: relationshipBreakdown.value.customer,
    helper: 'Contacts aligned to customer teams',
  },
  {
    label: 'Suppliers',
    value: relationshipBreakdown.value.supplier,
    helper: 'Contacts aligned to supplier teams',
  },
])
</script>

<template>
  <section class="grid gap-10">
    <header class="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">Directory</p>
        <h1 class="text-4xl font-bold text-slate-900 sm:text-5xl">Contacts</h1>
        <p class="max-w-2xl text-base leading-relaxed text-slate-600">
          View every person connected to your accounts. Use this list to understand who is supporting your customers and
          suppliers at a glance.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/40 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/50"
      >
        Add contact
      </button>
    </header>

    <section class="grid gap-4 md:grid-cols-3" aria-label="Contact overview">
      <article
        v-for="item in summary"
        :key="item.label"
        class="grid gap-1.5 rounded-2xl border border-brand-600/10 bg-gradient-to-br from-brand-600/10 to-brand-600/5 p-6 shadow-soft"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">{{ item.label }}</p>
        <p class="text-3xl font-bold text-slate-900">{{ item.value }}</p>
        <p class="text-sm text-slate-600">{{ item.helper }}</p>
      </article>
    </section>

    <DataTable :columns="columns" :rows="contacts" row-key="id" empty-message="No contacts yet">
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-600/15 to-brand-700/30 font-semibold text-brand-700" aria-hidden="true">
            {{ row.initials }}
          </span>
          <div>
            <p class="font-semibold text-slate-900">{{ row.name }}</p>
            <p class="text-sm text-slate-500">{{ row.title }}</p>
          </div>
        </div>
      </template>

      <template #cell-email="{ value }">
        <a class="font-semibold text-brand-600 hover:underline" :href="`mailto:${value}`">{{ value }}</a>
      </template>

      <template #cell-phone="{ value }">
        <a class="font-semibold text-brand-600 hover:underline" :href="`tel:${value}`">{{ value }}</a>
      </template>

      <template #cell-relationship="{ row }">
        <span
          class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold capitalize"
          :class="row.relationship?.type === 'customer'
            ? 'bg-green-100 text-green-700'
            : row.relationship?.type === 'supplier'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-200 text-slate-700'"
        >
          {{ row.relationship?.name ?? 'Unassigned' }}
        </span>
      </template>

      <template #cell-lastActivity="{ value }">
        <span class="text-sm text-slate-500">{{ value }}</span>
      </template>
    </DataTable>
  </section>
</template>
