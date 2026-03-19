<script>
  import { settings, saveSettings } from '../stores/pomodoro';
  
  let localSettings = { ...$settings };
  
  $: if ($settings) {
    localSettings = { ...$settings };
  }
  
  async function handleChange() {
    await saveSettings(localSettings);
  }
  
  function handleToggle(key) {
    localSettings[key] = !localSettings[key];
    handleChange();
  }
  
  function handleSlider(key, value) {
    localSettings[key] = parseInt(value);
    handleChange();
  }
</script>

<div class="space-y-6">
  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
  
  <div class="space-y-6">
    <div>
      <div class="flex justify-between items-center mb-2">
        <label for="workDuration" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Focus Duration
        </label>
        <span class="text-sm font-bold text-blue-600 dark:text-blue-400">
          {localSettings.workDuration || 25} min
        </span>
      </div>
      <input
        id="workDuration"
        type="range"
        min="1"
        max="60"
        value={localSettings.workDuration || 25}
        on:input={(e) => handleSlider('workDuration', e.target.value)}
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>1 min</span>
        <span>60 min</span>
      </div>
    </div>
    
    <div>
      <div class="flex justify-between items-center mb-2">
        <label for="shortBreakDuration" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Short Break
        </label>
        <span class="text-sm font-bold text-green-600 dark:text-green-400">
          {localSettings.shortBreakDuration || 5} min
        </span>
      </div>
      <input
        id="shortBreakDuration"
        type="range"
        min="1"
        max="30"
        value={localSettings.shortBreakDuration || 5}
        on:input={(e) => handleSlider('shortBreakDuration', e.target.value)}
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
      />
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>1 min</span>
        <span>30 min</span>
      </div>
    </div>
    
    <div>
      <div class="flex justify-between items-center mb-2">
        <label for="longBreakDuration" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Long Break
        </label>
        <span class="text-sm font-bold text-purple-600 dark:text-purple-400">
          {localSettings.longBreakDuration || 15} min
        </span>
      </div>
      <input
        id="longBreakDuration"
        type="range"
        min="1"
        max="60"
        value={localSettings.longBreakDuration || 15}
        on:input={(e) => handleSlider('longBreakDuration', e.target.value)}
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
      />
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>1 min</span>
        <span>60 min</span>
      </div>
    </div>
    
    <div>
      <div class="flex justify-between items-center mb-2">
        <label for="sessionsBeforeLongBreak" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sessions Before Long Break
        </label>
        <span class="text-sm font-bold text-orange-600 dark:text-orange-400">
          {localSettings.sessionsBeforeLongBreak || 4}
        </span>
      </div>
      <input
        id="sessionsBeforeLongBreak"
        type="range"
        min="1"
        max="10"
        value={localSettings.sessionsBeforeLongBreak || 4}
        on:input={(e) => handleSlider('sessionsBeforeLongBreak', e.target.value)}
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
      />
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  </div>
  
  <div class="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
      Notifications
    </h3>
    
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium text-gray-700 dark:text-gray-300">Sound</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Play sound when timer ends</p>
      </div>
      <button
        on:click={() => handleToggle('soundEnabled')}
        class="relative w-12 h-6 rounded-full transition-colors {localSettings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}"
      >
        <span
          class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform {localSettings.soundEnabled ? 'translate-x-6' : ''}"
        ></span>
      </button>
    </div>
    
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium text-gray-700 dark:text-gray-300">Vibration</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Vibrate when timer ends</p>
      </div>
      <button
        on:click={() => handleToggle('vibrationEnabled')}
        class="relative w-12 h-6 rounded-full transition-colors {localSettings.vibrationEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}"
      >
        <span
          class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform {localSettings.vibrationEnabled ? 'translate-x-6' : ''}"
        ></span>
      </button>
    </div>
  </div>
  
  <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
      Changes apply to the next session
    </p>
  </div>
</div>
