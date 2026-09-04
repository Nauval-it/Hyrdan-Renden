<script>
  let name = '';
  let email = '';
  let phone = '';
  let message = '';
  let status = 'idle';

  async function handleSubmit(e) {
    e.preventDefault();
    status = 'sending';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (res.ok) {
        status = 'success';
        name = ''; email = ''; phone = ''; message = '';
      } else {
        status = 'error';
      }
    } catch {
      status = 'error';
    }
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
    <input id="name" type="text" bind:value={name} required
      class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
  </div>

  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
    <input id="email" type="email" bind:value={email} required
      class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
  </div>

  <div>
    <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
    <input id="phone" type="tel" bind:value={phone}
      class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
  </div>

  <div>
    <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
    <textarea id="message" bind:value={message} required rows="5"
      class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
  </div>

  <button type="submit" disabled={status === 'sending'}
    class="w-full bg-brand hover:bg-brand-dark text-white font-heading font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50">
    {status === 'sending' ? 'Sending...' : 'Send Message'}
  </button>

  {#if status === 'success'}
    <p class="text-green-600 dark:text-green-400 text-sm text-center">Message sent! We'll be in touch soon.</p>
  {/if}
  {#if status === 'error'}
    <p class="text-red-600 dark:text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
  {/if}
</form>