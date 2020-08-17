<template>
    <CCard>
        <CCardHeader>
            <slot name="header">
                <CIcon name="cil-grid"/> Produto
                <div class="card-header-actions">
                    <div class="row">
                        <div class="col-sm-6">
                            <CSwitch @update:checked="atualizaListagem" color="primary" variant="3d"/> Inativos
                        </div>

                        <div class="col-sm-6">
                            <CButton size="sm" pressed block color="success" aria-pressed="true" to="/produtos/adicionar">
                                <CIcon name="cil-plus"/> Adicionar
                            </CButton>
                        </div>
                    </div>
                </div>
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
                            <CIcon :name="arrayProdutos[index].mostrar_detalhe ? 'cil-minus' : 'cil-plus'"/> {{ arrayProdutos[index].mostrar_detalhe ? 'Esconder' : 'Mostrar' }}
                        </CButton>
                    </td>
                </template>

                <template #details="{_, index}">
                    <CCollapse :show="arrayProdutos[index].mostrar_detalhe" :duration="collapseDuration">
                        <CCardBody>
                            <h4>{{ arrayProdutos[index].nome }}</h4>
                            
                            <CButton size="sm" color="success" class="ml-1" @click="$router.push({name: 'form.produto', params: {idProduto: arrayProdutos[index].id}})">
                                <CIcon name="cil-pencil"/>&nbsp;Editar
                            </CButton>
                            <CButton size="sm" color="danger" class="ml-1" @click="modal = 
                                {
                                    mensagem: 'Deseja realmente eliminar este produto? Esta operação não podera ser desfeita.',
                                    showModal: true, 
                                    produto: arrayProdutos[index],
                                    title: 'Atenção!',
                                    type: 'danger'
                                }">
                                <CIcon name="cil-delete"/>&nbsp;Excluir
                            </CButton>
                        </CCardBody>
                    </CCollapse>
                </template>
            </CDataTable>
        </CCardBody>
    </CCard>
</template>

<script>

import { fieldsProdutos } from '../../components/fields'
export default {
    name: "Listar",
    data () {
        return {
            arrayProdutos: [],
            fields: fieldsProdutos,
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
                    this.atualizaListagem()
                }
            })
        },
        
        controlaDetalhes(index) {
            this.$set(this.arrayProdutos[index], 'mostrar_detalhe', !this.arrayProdutos[index].mostrar_detalhe)
            this.collapseDuration = 300
            this.$nextTick(() => { this.collapseDuration = 0})
        },

        atualizaListagem(inativo = false) {
            this.$http.post('/api/produtos/listar', {inativo}).then(resp => this.$set(this, 'arrayProdutos', resp.data))
        }
    },

    mounted() {
        this.atualizaListagem()
    }
}
</script>

