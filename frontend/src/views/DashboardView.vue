<template>
  <section class="grid gap-10">
    <header class="space-y-3">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Hello, {{ formattedName }}!</h1>
      <p class="max-w-2xl text-base leading-relaxed text-slate-600">
        Here's a quick look at what's happening with your account today.
      </p>
    </header>

    <section class="grid gap-4 lg:grid-cols-3">
      <article class="grid gap-3 rounded-3xl bg-white p-7 shadow-2xl shadow-slate-900/5">
        <h2 class="text-lg font-semibold text-slate-800">Projects in progress</h2>
        <p class="text-4xl font-bold text-brand-600">3</p>
        <p class="text-sm leading-relaxed text-slate-600">Keep up the great work—two milestones are due this week.</p>
      </article>
      <article class="grid gap-3 rounded-3xl bg-white p-7 shadow-2xl shadow-slate-900/5">
        <h2 class="text-lg font-semibold text-slate-800">New messages</h2>
        <p class="text-4xl font-bold text-brand-600">5</p>
        <p class="text-sm leading-relaxed text-slate-600">Clients have shared fresh feedback. Take a look when you have a moment.</p>
      </article>
      <article class="grid gap-3 rounded-3xl bg-white p-7 shadow-2xl shadow-slate-900/5">
        <h2 class="text-lg font-semibold text-slate-800">Upcoming meetings</h2>
        <p class="text-4xl font-bold text-brand-600">2</p>
        <p class="text-sm leading-relaxed text-slate-600">Your next strategy call kicks off tomorrow at 10:00 AM.</p>
      </article>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '../stores/auth.js'

const { user } = useAuth()

const formattedName = computed(() => user.value?.name ?? 'there')
</script>
