<template>
    <CCard>
        <CCardHeader>
            <slot name="header">
                <CIcon name="cil-grid"/> Usuários
                <div class="card-header-actions">
                    <CButton pressed block color="success" size="sm" aria-pressed="true" to="/usuarios/adicionar">
                        <CIcon name="cil-plus"/> Adicionar
                    </CButton>
                </div>
            </slot>
        </CCardHeader>
        
        <CModal class="text-center" :title="modal.title" :color="modal.type" :show.sync="modal.showModal">
            {{ modal.mensagem }}
            <template #footer>
                <CButton @click="modal.showModal = false" :color="modal.type" class="text-center">{{ modal.usuario != null ? 'Não' : 'Ok' }}</CButton>
                <CButton v-if="modal.usuario != null" @click="deletar" color="success">Sim</CButton>
            </template>
        </CModal>

        <CCardBody>
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="arrayUsuarios" :fields="fieldsUser" column-filter
                :table-filter="{label: 'Filtro: ', placeholder: 'Pesquisar...'}"
                :items-per-page-select="{label: 'Registros por página'}" 
                :items-per-page="5" hover sorter pagination>
                <template #mostrar_detalhe="{_, index}">
                    <td class="py-2">
                        <CButton color="primary" variant="outline" square size="sm" @click="controlaDetalhes(index)">
                            <CIcon :name="arrayUsuarios[index].mostrar_detalhe ? 'cil-minus' : 'cil-plus'"/> {{ arrayUsuarios[index].mostrar_detalhe ? 'Esconder' : 'Mostrar' }}
                        </CButton>
                    </td>
                </template>

                <template #details="{_, index}">
                    <CCollapse :show="arrayUsuarios[index].mostrar_detalhe" :duration="collapseDuration">
                        <CCardBody>
                            <h4>{{ arrayUsuarios[index].nome }}</h4>
                            
                            <CButton size="sm" color="success" class="ml-1" @click="$router.push({name: 'form.usuario', params: {idUsuario: arrayUsuarios[index].id}})">
                                <CIcon name="cil-pencil"/>&nbsp;Editar
                            </CButton>
                            <CButton :disabled="arrayUsuarios[index].id === 1" size="sm" color="danger" class="ml-1" @click="modal =
                                {
                                    mensagem: 'Deseja realmente eliminar este usuário? Esta operação não podera ser desfeita.',
                                    showModal: true, 
                                    usuario: arrayUsuarios[index],
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

import { fieldsUser } from '../../components/fields'
export default {
    name: "Listar",
    data () {
        return {
            arrayUsuarios: [],
            fieldsUser,
            collapseDuration: 0,
            modal: {
                showModal: false,
                usuario: {},
                type: '',
                mensagem: '',
                title: ''
            }
        }
    },

    methods: {
        deletar() {
            const self = this
            self.$http.post(`/api/usuarios/deletar/${self.modal.usuario.id}`).then(resp => {
                if (resp.data.erro) {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, usuario: null, title: 'Atenção!', type: 'danger'}
                } else {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, usuario: null, title: 'Sucesso!', type: 'success'}
                    self.getUsers()
                }
            })
        },

        getUsers() {
            this.$http.post('/api/usuarios/listar').then(resp => this.$set(this, 'arrayUsuarios', resp.data))
        },

        controlaDetalhes(index) {
            this.$set(this.arrayUsuarios[index], 'mostrar_detalhe', !this.arrayUsuarios[index].mostrar_detalhe)
            this.collapseDuration = 300
            this.$nextTick(() => { this.collapseDuration = 0})
        },
    },

    mounted() {
        this.getUsers()
    }
}
</script>

