<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  emptyMessage: {
    type: String,
    default: 'No data available',
  },
})

const normalizedColumns = computed(() =>
  props.columns.map((column) => ({
    align: 'left',
    ...column,
  })),
)

const hasRows = computed(() => props.rows.length > 0)

const resolveRowKey = (row, index) =>
  row?.[props.rowKey] ?? `${props.rowKey}-${index}`
</script>

<template>
  <div class="data-table">
    <div class="table-scroll">
      <table>
        <thead v-if="normalizedColumns.length">
          <tr>
            <th v-for="column in normalizedColumns" :key="column.key" :class="[`is-${column.align}`]">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="hasRows">
          <tr v-for="(row, index) in rows" :key="resolveRowKey(row, index)">
            <td
              v-for="column in normalizedColumns"
              :key="column.key"
              :class="[`is-${column.align}`]"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :column="column">
                {{ row[column.key] ?? '—' }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="normalizedColumns.length" class="empty-state">
              <slot name="empty">
                {{ emptyMessage }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.data-table {
  border-radius: 1rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.table-scroll {
  overflow-x: auto;
  scrollbar-width: thin;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 640px;
}

thead {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0.16));
}

thead th {
  text-align: left;
  padding: 0.85rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #1d4ed8;
  border-bottom: 1px solid rgba(37, 99, 235, 0.15);
}

tbody td {
  padding: 1.1rem 1.25rem;
  vertical-align: top;
  color: #0f172a;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  background: #fff;
}

tbody tr:nth-child(even) td {
  background: rgba(248, 250, 252, 0.7);
}

tbody tr:last-child td {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #475569;
  font-size: 0.95rem;
}

.is-right {
  text-align: right;
}

.is-center {
  text-align: center;
}
</style>
