import type {DefineComponent} from "vue";

export interface DiagramIconComponent {
    component: DefineComponent,
    meta: {
        instance: {
            id: string,
        },
        type: string,
        name: string,
        description?: string,
        title?: string,
    }
}