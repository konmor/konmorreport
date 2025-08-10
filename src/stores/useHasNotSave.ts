import { defineStore } from 'pinia'
import {ref} from "vue";

export let useHasNotSave = defineStore('notSave', () => {
  let hasNotSave = ref(false)

  function getHasNotSaveStatus(): boolean {
    return hasNotSave.value
  }

  function reset() {
    hasNotSave.value = false
  }

  function change(status: boolean) {
    hasNotSave.value = status
  }

  return { getHasNotSaveStatus, reset, change }
})
