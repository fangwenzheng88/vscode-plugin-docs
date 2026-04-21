<script setup lang="ts">
import VueEditor from "./components/vue-editor.vue";
import { inject } from "vue";

const vscode: any = inject("vscode");
</script>

<template>
  <VueEditor></VueEditor>
</template>

<style scoped></style>
