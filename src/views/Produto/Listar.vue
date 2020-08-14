<template>
    <CCard>
        <CCardHeader>
            <CCol col="6" sm="4" md="2" xl class="mb-3 mb-xl-0">
                <CButton pressed block color="success" aria-pressed="true" to="/produtos/adicionar">
                   Adicionar
                </CButton>
            </CCol>

            <slot name="header">
                <CIcon name="cil-grid"/> Produto
            </slot>
        </CCardHeader>
        
        <CModal class="text-center" :title="modal.title" :color="modal.type" :show.sync="modal.showModal">
            {{ modal.mensagem }}
            <template #footer>
                <CButton @click="modal.showModal = false" :color="modal.type" class="text-center">{{ modal.produto != null ? 'Não' : 'Ok' }}</CButton>
                <CButton v-if="modal.produto != null" @click="deletar" color="success">Sim</CButton>
            </template>
        </CModal>

        <CCardBody>
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="arrayProdutos" :fields="fields" column-filter 
                :table-filter="{label: 'Filtro: ', placeholder: 'Pesquisar...'}"
                :items-per-page-select="{label: 'Registros por página'}" 
                :items-per-page="5" hover sorter pagination>
                <template #mostrar_detalhe="{_, index}">
                    <td class="py-2">
                        <CButton color="primary" variant="outline" square size="sm" @click="controlaDetalhes(index)">
                            {{ arrayProdutos[index].mostrar_detalhe ? 'Esconder' : 'Mostrar' }}
                        </CButton>
                    </td>
                </template>

                <template #details="{_, index}">
                    <CCollapse :show="arrayProdutos[index].mostrar_detalhe" :duration="collapseDuration">
                        <CCardBody>
                            <h4>{{ arrayProdutos[index].nome }}</h4>
                            
                            <CButton size="sm" color="success" class="ml-1" @click="$router.push({name: 'form.produto', params: {idProduto: arrayProdutos[index].id}})">
                                Editar
                            </CButton>
                            <CButton size="sm" color="danger" class="ml-1" @click="modal = 
                                {
                                    mensagem: 'Deseja realmente eliminar este produto? Esta operação não podera ser desfeita.',
                                    showModal: true, 
                                    produto: arrayProdutos[index],
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
    { key: 'codigo', label: 'Código', _style:'width: 10%' },
    { key: 'nome', label: 'Nome', _style:'width: 40%' },
    { key: 'qtd_estoque', label: 'Estoque', _style:'width: 20%' },
    { key: 'valor_venda', label: 'Venda (R$)', _style:'width: 20%' },
    { key: 'mostrar_detalhe',  label: '',  _style: 'width: 10%',  sorter: false, filter: false }
]
export default {
    name: "Listar",
    data () {
        return {
            arrayProdutos: [],
            fields,
            collapseDuration: 0,
            modal: {
                showModal: false,
                produto: {},
                type: '',
                mensagem: '',
                title: ''
            }
        }
    },

    methods: {
        deletar() {
            const self = this
            self.$http.post(`/api/produtos/deletar/${self.modal.produto.id}`).then(resp => {
                if (resp.data.erro) {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, produto: null, title: 'Atenção!', type: 'danger'}
                } else {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, produto: null, title: 'Sucesso!', type: 'success'}
                    self.$http.post('/api/produtos/listar').then(resp => self.$set(self, 'arrayProdutos', resp.data))
                }
            })
        },
        
        controlaDetalhes(index) {
            this.$set(this.arrayProdutos[index], 'mostrar_detalhe', !this.arrayProdutos[index].mostrar_detalhe)
            this.collapseDuration = 300
            this.$nextTick(() => { this.collapseDuration = 0})
        },
    },

    mounted() {
        this.$http.post('/api/produtos/listar').then(resp => this.$set(this, 'arrayProdutos', resp.data))
    }
}
</script>

