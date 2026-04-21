<script setup lang="ts">
import VueEditor from "./components/vue-editor.vue";
import { inject } from "vue";

const vscode: any = inject("vscode");
const _saveProject = () => {
  vscode.postMessage({
    command: "alert",
    text: "🐛  on line111 ",
  });
};
</script>

<template>
  <VueEditor></VueEditor>
</template>

<style scoped></style>
