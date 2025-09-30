<template>
  <section class="dashboard">
    <header>
      <h1>Hello, {{ formattedName }}!</h1>
      <p>Here's a quick look at what's happening with your account today.</p>
    </header>

    <section class="cards">
      <article class="card">
        <h2>Projects in progress</h2>
        <p class="card-number">3</p>
        <p>Keep up the great work—two milestones are due this week.</p>
      </article>
      <article class="card">
        <h2>New messages</h2>
        <p class="card-number">5</p>
        <p>Clients have shared fresh feedback. Take a look when you have a moment.</p>
      </article>
      <article class="card">
        <h2>Upcoming meetings</h2>
        <p class="card-number">2</p>
        <p>Your next strategy call kicks off tomorrow at 10:00 AM.</p>
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

<style scoped>
.dashboard {
  display: grid;
  gap: 2.5rem;
}

header h1 {
  margin: 0;
  font-size: clamp(2.25rem, 4vw, 3rem);
  color: #0f172a;
}

header p {
  margin: 0.75rem 0 0;
  color: #475569;
  line-height: 1.7;
}

.cards {
  display: grid;
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  padding: 1.75rem;
  border-radius: 1.5rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 0.75rem;
}

.card h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #1e293b;
}

.card-number {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
}

.card p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

@media (min-width: 900px) {
  .cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
