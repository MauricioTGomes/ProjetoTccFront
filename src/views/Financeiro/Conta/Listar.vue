<template>
    <CCard>
        <CCardHeader>
            <CCol col="6" sm="4" md="2" xl class="mb-3 mb-xl-0">
                <CButton pressed block color="success" aria-pressed="true" :to="`/contas/adicionar/${this.$route.params.tipo}`">
                   Adicionar
                </CButton>
            </CCol>

            <slot name="header">
                <CIcon name="cil-grid"/> Contas {{ operacaoReceber ? 'receber' : 'pagar' }}
            </slot>
        </CCardHeader>
        
        <CModal class="text-center" :title="modal.title" :color="modal.type" :show.sync="modal.showModal">
            {{ modal.mensagem }}
            <template #footer>
                <CButton @click="modal.showModal = false" :color="modal.type" class="text-center">{{ modal.conta != null ? 'Não' : 'Ok' }}</CButton>
                <CButton v-if="modal.conta != null" @click="deletar" color="success">Sim</CButton>
            </template>
        </CModal>

        <CCardBody>
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="arrayContas" :fields="fields" column-filter 
                :table-filter="{label: 'Filtro: ', placeholder: 'Pesquisar...'}"
                :items-per-page-select="{label: 'Registros por página'}" 
                :items-per-page="5" hover sorter pagination>
                <template #mostrar_detalhe="{_, index}">
                    <td class="py-2">
                        <CButton color="primary" variant="outline" square size="sm" @click="controlaDetalhes(index)">
                            {{ arrayContas[index].mostrar_detalhe ? 'Esconder' : 'Mostrar' }}
                        </CButton>
                    </td>
                </template>

                <template #details="{_, index}">
                    <CCollapse :show="arrayContas[index].mostrar_detalhe" :duration="collapseDuration">
                        <CCardBody>
                            <h4>{{ arrayContas[index].nome }}</h4>
                            
                            <CButton size="sm" color="success" class="ml-1" @click="$router.push({name: 'form.conta', params: {idconta: arrayContas[index].id}})">
                                Editar
                            </CButton>
                            <CButton size="sm" color="danger" class="ml-1" @click="modal = 
                                {
                                    mensagem: 'Deseja realmente eliminar este conta? Esta operação não podera ser desfeita.',
                                    showModal: true, 
                                    conta: arrayContas[index],
                                    title: 'Atenção!',
                                    type: 'danger'
                                }">
                                Excluir
                            </CButton>
                        </CCardBody>
                    </CCollapse>
                </template>
            </CDataTable>
        </CCardBody>
    </CCard>
</template>

<script>

const fields = [
    { key: 'data_emissao', label: 'Data emissão', _style:'width: 10%' },
    { key: 'nomePessoa', label: 'Cliente', _style:'width: 30%' },
    { key: 'titulo', label: 'Título', _style:'width: 10%' },
    { key: 'vlr_total', label: 'Total (R$)', _style:'width: 20%' },
    { key: 'vlr_restante', label: 'Restante (R$)', _style:'width: 20%' },
    { key: 'mostrar_detalhe',  label: '',  _style: 'width: 10%',  sorter: false, filter: false }
]
export default {
    name: "Listar",
    data () {
        return {
            arrayContas: [],
            fields,
            collapseDuration: 0,
            modal: {
                showModal: false,
                conta: {},
                type: '',
                mensagem: '',
                title: ''
            }
        }
    },

    computed: {
        operacaoReceber() {
            return this.$route.params.tipo == 'receber';
        },
    },
    methods: {
        deletar() {
            const self = this
            self.$http.post(`/api/contas/deletar/${self.modal.conta.id}`).then(resp => {
                if (resp.data.erro) {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, conta: null, title: 'Atenção!', type: 'danger'}
                } else {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, conta: null, title: 'Sucesso!', type: 'success'}
                    self.$http.post('/api/contas/listar').then(resp => self.$set(self, 'arrayContas', resp.data))
                }
            })
        },
        
        controlaDetalhes(index) {
            this.$set(this.arrayContas[index], 'mostrar_detalhe', !this.arrayContas[index].mostrar_detalhe)
            this.collapseDuration = 300
            this.$nextTick(() => { this.collapseDuration = 0})
        },
    },

    mounted() {
        this.$http.post('/api/contas/listar', {tipo: this.operacaoReceber ? 'R' : 'P'}).then(resp => this.$set(this, 'arrayContas', resp.data))
    }
}
</script>

