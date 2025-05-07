<script lang="ts">
export default {
  name: 'addDatasourceButton'
}
</script>

<template>
    <svg width="80" height="40" viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
      <rect class="button" x="0" y="0" width="80" height="40" rx="8" fill="#e8f5e9" stroke="#6aaf49"
            stroke-width="1.5"/>
      <g class="button" transform="translate(12, 10)" fill="#6aaf49">
        <rect x="0" y="0" width="16" height="3" rx="1"/>
        <rect x="0" y="7" width="20" height="3" rx="1"/>
        <rect x="0" y="14" width="16" height="3" rx="1"/>
      </g>

      <g class="button" transform="translate(50, 11)">
        <line x1="9" y1="0" x2="9" y2="18" stroke="#6aaf49" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="0" y1="9" x2="18" y2="9" stroke="#6aaf49" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </svg>
</template>

<style scoped>
.button {
  transition: all 0.2s ease-in-out;
}

.button:hover {
  filter: brightness(90%);;
}

.button:active {
  transform: scale(0.95);
  filter: brightness(80%);
  stroke-width: 2;
}
</style>