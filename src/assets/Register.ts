import type {App} from 'vue'
import SyncToDataWarehouse from "@/assets/icon/SyncToDataWarehouse.vue";

export default function registerCustomIcon(app: App): void {

    app.component('SyncToDataWarehouse', SyncToDataWarehouse)
}