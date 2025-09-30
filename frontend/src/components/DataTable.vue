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

const resolveAlign = (align) => {
  if (align === 'right') return 'text-right'
  if (align === 'center') return 'text-center'
  return 'text-left'
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[640px] border-separate border-spacing-0">
        <thead v-if="normalizedColumns.length">
          <tr class="bg-gradient-to-br from-brand-50/70 to-blue-100/70 text-brand-700">
            <th
              v-for="column in normalizedColumns"
              :key="column.key"
              :class="['px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 border-b border-blue-200', resolveAlign(column.align)]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="hasRows" class="text-sm text-slate-900">
          <tr v-for="(row, index) in rows" :key="resolveRowKey(row, index)" class="even:bg-slate-50/60 last:[&_td]:border-b-0">
            <td
              v-for="column in normalizedColumns"
              :key="column.key"
              :class="['px-5 py-4 align-top border-b border-slate-100', resolveAlign(column.align)]"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :column="column">
                {{ row[column.key] ?? '—' }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="normalizedColumns.length || 1" class="px-4 py-12 text-center text-sm text-slate-500">
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
