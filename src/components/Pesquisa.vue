<script>
    export default {
        props: {
            url: '', label: '', selecionado: {}, fields: Array, value: ''
        },
        data() {
            return {
                itens: [],
                modal: false
            }
        },
        methods: {
           abreModal() {
               this.$http.post(this.url).then(resp => this.$set(this, 'itens', resp.data))
               this.modal = true
            },

            selecionar(item) {
                this.$emit('input', item)
                this.modal = false
            }
        },
    }
</script>

<template>
    <div>
        <CInput :placeholder="label" :value="value" :label="label" disabled>
            <template #prepend>
            <CButton color="primary" @click="abreModal">
                <CIcon name="cil-magnifying-glass"/>
            </CButton>
            </template>
        </CInput>

        <CModal class="text-center" :title="label" color="primary" size="lg" :show.sync="modal">
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="itens" :fields="fields"
                :table-filter="{label: 'Filtro: ', placeholder: 'Pesquisar...'}"
                :items-per-page="5" hover sorter pagination
                @row-clicked="selecionar">
            </CDataTable>

            <template #footer>
                <CButton @click="modal = false" color="primary" class="text-center">OK</CButton>
            </template>
        </CModal>


    </div>
</template>