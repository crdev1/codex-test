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
  <section class="contact-listing">
    <header class="page-header">
      <div>
        <p class="eyebrow">Directory</p>
        <h1>Contacts</h1>
        <p class="lede">
          View every person connected to your accounts. Use this list to understand who is supporting
          your customers and suppliers at a glance.
        </p>
      </div>
      <button type="button" class="action-button">Add contact</button>
    </header>

    <section class="summary-grid" aria-label="Contact overview">
      <article v-for="item in summary" :key="item.label" class="summary-card">
        <p class="summary-label">{{ item.label }}</p>
        <p class="summary-value">{{ item.value }}</p>
        <p class="summary-helper">{{ item.helper }}</p>
      </article>
    </section>

    <DataTable :columns="columns" :rows="contacts" row-key="id" empty-message="No contacts yet">
      <template #cell-name="{ row }">
        <div class="contact-cell">
          <span class="avatar" aria-hidden="true">{{ row.initials }}</span>
          <div>
            <p class="contact-name">{{ row.name }}</p>
            <p class="contact-title">{{ row.title }}</p>
          </div>
        </div>
      </template>

      <template #cell-email="{ value }">
        <a class="link" :href="`mailto:${value}`">{{ value }}</a>
      </template>

      <template #cell-phone="{ value }">
        <a class="link" :href="`tel:${value}`">{{ value }}</a>
      </template>

      <template #cell-relationship="{ row }">
        <span class="chip" :class="[`chip--${row.relationship?.type ?? 'other'}`]">
          {{ row.relationship?.name ?? 'Unassigned' }}
        </span>
      </template>

      <template #cell-lastActivity="{ value }">
        <span class="activity">{{ value }}</span>
      </template>
    </DataTable>
  </section>
</template>

<style scoped>
.contact-listing {
  display: grid;
  gap: 2.5rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
}

.eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #2563eb;
  margin: 0 0 0.25rem;
  font-weight: 700;
}

.page-header h1 {
  margin: 0;
  font-size: clamp(2.5rem, 4vw, 3.25rem);
  color: #0f172a;
}

.lede {
  margin: 1rem 0 0;
  color: #475569;
  line-height: 1.8;
  max-width: 48ch;
}

.action-button {
  align-self: center;
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 18px 30px rgba(37, 99, 235, 0.4);
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 36px rgba(37, 99, 235, 0.5);
}

.summary-grid {
  display: grid;
  gap: 1rem;
}

.summary-card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(37, 99, 235, 0.08);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.02));
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 0.35rem;
}

.summary-label {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #1d4ed8;
}

.summary-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
}

.summary-helper {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
}

.contact-cell {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(29, 78, 216, 0.25));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #1d4ed8;
}

.contact-name {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
}

.contact-title {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  background: rgba(148, 163, 184, 0.2);
  color: #0f172a;
}

.chip--customer {
  background: rgba(34, 197, 94, 0.16);
  color: #166534;
}

.chip--supplier {
  background: rgba(251, 191, 36, 0.2);
  color: #92400e;
}

.activity {
  color: #475569;
  font-size: 0.95rem;
}

@media (min-width: 720px) {
  .page-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .action-button {
    align-self: flex-end;
  }

  .summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
