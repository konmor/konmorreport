import type {DefineComponent} from "vue";

export interface IconComponent {
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

export interface DiagramIconComponent extends IconComponent{

}