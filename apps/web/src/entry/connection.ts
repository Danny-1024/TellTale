import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LiveResponse } from '@telltale/contracts'

export const useConnection = defineStore('connection', () => {
  const status = ref<'idle' | 'loading' | 'connected' | 'unavailable'>('idle')
  const requestId = ref<string | null>(null)
  const reason = ref<string | null>(null)

  async function check(): Promise<void> {
    if (status.value === 'loading') return
    status.value = 'loading'
    requestId.value = null
    reason.value = null
    let response: Response
    try {
      response = await fetch('/health/live')
    } catch (error) {
      if (!(error instanceof TypeError)) throw error
      status.value = 'unavailable'
      reason.value = error.message
      return
    }
    if (!response.ok) {
      status.value = 'unavailable'
      reason.value = `HTTP ${response.status}`
      return
    }
    const value: unknown = await response.json()
    if (
      typeof value !== 'object' ||
      value === null ||
      !('status' in value) ||
      value.status !== 'alive' ||
      !('service' in value) ||
      value.service !== 'telltale-api' ||
      !('requestId' in value) ||
      typeof value.requestId !== 'string' ||
      !value.requestId
    )
      throw new Error('服务存活响应不符合入口合同')
    const live: LiveResponse = value as LiveResponse
    requestId.value = live.requestId
    status.value = 'connected'
  }

  return { status, requestId, reason, check }
})
