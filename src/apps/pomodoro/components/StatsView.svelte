<script>
  import { sessions, settings } from '../stores/pomodoro';
  
  $: allSessions = $sessions;
  $: currentSettings = $settings;
  
  $: todaySessions = getTodaySessions(allSessions);
  $: weekSessions = getWeekSessions(allSessions);
  $: streak = calculateStreak(allSessions);
  $: history = allSessions.slice(0, 20);
  
  function getTodaySessions(sess) {
    const today = new Date().toISOString().split('T')[0];
    return sess.filter(s => {
      const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
      return sessionDate === today && s.type === 'work' && s.completed;
    });
  }
  
  function getWeekSessions(sess) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    return sess.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= startOfWeek && s.type === 'work' && s.completed;
    });
  }
  
  function calculateStreak(sess) {
    const workSessions = sess.filter(s => s.type === 'work' && s.completed);
    if (workSessions.length === 0) return 0;
    
    const uniqueDays = [...new Set(
      workSessions.map(s => new Date(s.startTime).toISOString().split('T')[0])
    )].sort().reverse();
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
      return 0;
    }
    
    let streakCount = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const current = new Date(uniqueDays[i - 1]);
      const prev = new Date(uniqueDays[i]);
      const diffDays = Math.floor((current - prev) / 86400000);
      
      if (diffDays === 1) {
        streakCount++;
      } else {
        break;
      }
    }
    
    return streakCount;
  }
  
  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  }
  
  function getSessionTypeLabel(type) {
    if (type === 'work') return 'Focus';
    if (type === 'short_break') return 'Short Break';
    if (type === 'long_break') return 'Long Break';
    return type;
  }
</script>

<div class="space-y-6">
  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Statistics</h2>
  
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
      <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{todaySessions.length}</div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Today</div>
    </div>
    
    <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
      <div class="text-3xl font-bold text-green-600 dark:text-green-400">{weekSessions.length}</div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">This Week</div>
    </div>
    
    <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
      <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{streak}</div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Day Streak</div>
    </div>
  </div>
  
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Session History</h3>
    
    {#if history.length === 0}
      <div class="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No sessions yet</p>
        <p class="text-sm mt-1">Complete your first focus session!</p>
      </div>
    {:else}
      <div class="space-y-2">
        {#each history as session}
          <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">
                {session.name}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(session.startTime)}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs px-2 py-1 rounded-full {session.type === 'work' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}">
                {getSessionTypeLabel(session.type)}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {formatDuration(session.duration)}
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
