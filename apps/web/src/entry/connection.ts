import { defineStore } from "pinia";
import { ref } from "vue";
import { assertContract } from "@telltale/contracts";

export const useConnection = defineStore("connection", () => {
  const status = ref<"idle" | "loading" | "connected" | "unavailable">("idle");
  const requestId = ref<string | null>(null);
  const reason = ref<string | null>(null);

  async function check(): Promise<void> {
    if (status.value === "loading") return;
    status.value = "loading";
    requestId.value = null;
    reason.value = null;
    let response: Response;
    try {
      response = await fetch("/health/live");
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      status.value = "unavailable";
      reason.value = error.message;
      return;
    }
    if (!response.ok) {
      status.value = "unavailable";
      reason.value = `HTTP ${response.status}`;
      return;
    }
    const value: unknown = await response.json();
    assertContract("LiveResponse", value);
    requestId.value = value.requestId;
    status.value = "connected";
  }

  return { status, requestId, reason, check };
});
