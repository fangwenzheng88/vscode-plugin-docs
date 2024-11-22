<script setup lang="ts">
import { ref, onMounted } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";

const rootRef = ref<HTMLDivElement>();
onMounted(() => {
  const contentEditor = new Vditor(rootRef.value, {
    height: 360,
    toolbarConfig: {
      pin: true,
    },
    preview: {
      delay: -1,
      hljs: {
        lineNumber: true,
        enable: false,
      },
    },
    cache: {
      enable: false,
    },
    after: () => {
      contentEditor.setValue("hello, Vditor + Vue!");
    },
  });
});
</script>

<template>
  <div ref="rootRef" class="editor-layout"></div>
</template>

<style scoped>
.editor-layout {
  width: 100%;
  height: 100%;
}
</style>
