<script setup lang="ts">
defineProps<{
    width: number
}>()
</script>

<template>
    <div class="key-separator">
    </div>
</template>

<style scoped>
.key-separator {
    height: 50px;
    width: calc(v-bind(width) * 50px);
}
</style>