import {defineStore} from "pinia";
import {ref} from "vue";

export let useCreateStore = defineStore('createStatus', () => {
    let createDatasource = ref(false);
    let createSQL = ref(false);
    let createReports = ref(false);

    let editDatasource = ref(false);
    let editSQL = ref(false);
    let editReports = ref(false);

    function toCreateDatasource() {
        createDatasource.value = true;
        createSQL.value = false;
        createReports.value = false;

        editDatasource.value = false;
        editSQL.value = false;
        editReports.value = false;
    }

    function toEditDatasource() {
        createDatasource.value = false;
        createSQL.value = false;
        createReports.value = false;

        editDatasource.value = true;
        editSQL.value = false;
        editReports.value = false;
    }

    function toCreateSQL() {
        createDatasource.value = false;
        createSQL.value = true;
        createReports.value = false;

        editDatasource.value = false;
        editSQL.value = false;
        editReports.value = false;
    }

    function toEditSQL() {
        createDatasource.value = false;
        createSQL.value = false;
        createReports.value = false;

        editDatasource.value = false;
        editSQL.value = true;
        editReports.value = false;
    }

    function toCreateReports() {
        createDatasource.value = false;
        createSQL.value = false;
        createReports.value = true;

        editDatasource.value = false;
        editSQL.value = false;
        editReports.value = false;
    }

    function toEditReports() {
        createDatasource.value = false;
        createSQL.value = false;
        createReports.value = false;

        editDatasource.value = false;
        editSQL.value = false;
        editReports.value = true;
    }

    return {
        toCreateDatasource, toCreateSQL, toCreateReports, toEditDatasource, toEditSQL, toEditReports,
        createDatasource,
        createSQL,
        createReports,
        editDatasource,
        editSQL,
        editReports,
    }

})