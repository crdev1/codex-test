<template>
  <section class="contact">
    <header>
      <h1>Contact Us</h1>
      <p>
        Ready to start a project or just want to say hello? Tell us a little about
        yourself and we'll be in touch soon.
      </p>
    </header>

    <form class="contact-form" @submit.prevent>
      <label>
        Name
        <input type="text" name="name" autocomplete="name" placeholder="Jane Doe" />
      </label>
      <label>
        Email
        <input
          type="email"
          name="email"
          autocomplete="email"
          placeholder="you@example.com"
        />
      </label>
      <label>
        Message
        <textarea name="message" rows="4" placeholder="How can we help?"></textarea>
      </label>
      <button type="submit">Send message</button>
    </form>

    <aside class="contact-details">
      <h2>Prefer to talk?</h2>
      <p>Email us at <a href="mailto:hello@acme.co">hello@acme.co</a> or call (555) 123-4567.</p>
    </aside>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  gap: 2.5rem;
}

header h1 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  margin: 0 0 0.75rem;
  color: #0f172a;
}

header p {
  margin: 0;
  color: #475569;
  font-size: 1.05rem;
  max-width: 38rem;
  line-height: 1.7;
}

.contact-form {
  display: grid;
  gap: 1.5rem;
  background: #ffffff;
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08);
}

label {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
  color: #1e293b;
}

input,
textarea {
  width: 100%;
  font: inherit;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

button {
  justify-self: start;
  padding: 0.75rem 1.75rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.35);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(37, 99, 235, 0.45);
}

.contact-details {
  background: #0f172a;
  color: rgba(255, 255, 255, 0.8);
  padding: 1.75rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.1);
}

.contact-details h2 {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
}

.contact-details a {
  color: #93c5fd;
  font-weight: 600;
}

@media (min-width: 900px) {
  .contact {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }

  .contact-details {
    position: sticky;
    top: 2rem;
  }
}
</style>
