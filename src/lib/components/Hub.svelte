<script>
  import { apps } from '../stores/apps';
  import { onMount } from 'svelte';
  import AppCard from './AppCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  onMount(() => {
    apps.loadApps();
  });
</script>

<div class="p-6">
  <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-8">Brain Workouts</h2>
  
  {#if $apps.length === 0}
    <div class="text-center p-12">
      <p class="text-gray-500">No workout apps registered.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each $apps as app (app.id)}
        <AppCard {app} />
      {/each}
    </div>
  {/if}
</div>
