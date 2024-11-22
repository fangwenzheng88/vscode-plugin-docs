import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Vant from "vant";
import "vant/lib/index.css";

const app = createApp(App);

try {
  const vscode = acquireVsCodeApi();
  app.provide("vscode", vscode);
} catch (error) {
  console.log("🚀 ~ error:", error);
}

app.use(Vant);

app.mount("#app");
