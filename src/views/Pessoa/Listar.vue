<template>
    <CCard>
        <CCardHeader>
            <slot name="header">
                <CIcon name="cil-grid"/> Pessoa
                <div class="card-header-actions">
                    <div class="row">
                        <div class="col-sm-6">
                            <CSwitch @update:checked="atualizaListagem" color="primary" variant="3d"/> Inativos
                        </div>

                        <div class="col-sm-6">
                            <CButton size="sm" pressed block color="success" aria-pressed="true" to="/pessoas/adicionar">
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
                <CButton @click="modal.showModal = false" :color="modal.type" class="text-center">{{ modal.pessoa != null ? 'Não' : 'Ok' }}</CButton>
                <CButton v-if="modal.pessoa != null" @click="deletar" color="success">Sim</CButton>
            </template>
        </CModal>

        <CCardBody>
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="arrayPessoas" :fields="fields" column-filter 
                :table-filter="{label: 'Filtro: ', placeholder: 'Pesquisar...'}"
                :items-per-page-select="{label: 'Registros por página'}" 
                :items-per-page="5" hover sorter pagination>
                <template #mostrar_detalhe="{_, index}">
                    <td class="py-2">
                        <CButton size="sm" color="primary" variant="outline" square @click="controlaDetalhes(index)">
                            <CIcon :name="arrayPessoas[index].mostrar_detalhe ? 'cil-minus' : 'cil-plus'"/> {{ arrayPessoas[index].mostrar_detalhe ? 'Esconder' : 'Mostrar' }}
                        </CButton>
                    </td>
                </template>

                <template #details="{_, index}">
                    <CCollapse :show="arrayPessoas[index].mostrar_detalhe" :duration="collapseDuration">
                        <CCardBody>
                            <h4>{{ arrayPessoas[index].nome_documento_completo }}</h4>
                            
                            <CButton size="sm" color="success" class="ml-1" @click="$router.push({name: 'form.pessoa', params: {idPessoa: arrayPessoas[index].id}})">
                                <CIcon name="cil-pencil"/>&nbsp;Editar
                            </CButton>
                            <CButton size="sm" color="danger" class="ml-1" @click="modal = 
                                {
                                    mensagem: 'Deseja realmente eliminar esta pessoa? Esta operação não podera ser desfeita.',
                                    showModal: true, 
                                    pessoa: arrayPessoas[index],
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

import { fieldsPessoa } from '../../components/fields'

export default {
    name: "Listar",
    data () {
        return {
            arrayPessoas: [],
            fields: fieldsPessoa,
            collapseDuration: 0,
            modal: {
                showModal: false,
                pessoa: {},
                type: '',
                mensagem: '',
                title: ''
            }
        }
    },

    methods: {
        controlaDetalhes(index) {
            this.$set(this.arrayPessoas[index], 'mostrar_detalhe', !this.arrayPessoas[index].mostrar_detalhe)
            this.collapseDuration = 300
            this.$nextTick(() => { this.collapseDuration = 0})
        },
        
        deletar() {
            const self = this
            self.$http.post(`/api/pessoas/deletar/${self.modal.pessoa.id}`).then(resp => {
                if (resp.data.erro) {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, pessoa: null, title: 'Atenção!', type: 'danger'}
                } else {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, pessoa: null, title: 'Sucesso!', type: 'success'}
                    this.atualizaListagem()
                }
            })
        },

        atualizaListagem(inativo = false) {
            this.$http.post('/api/pessoas/listar', {inativo}).then(resp => this.$set(this, 'arrayPessoas', resp.data))
        }
    },

    mounted() {
        this.atualizaListagem()
    }
}
</script>

