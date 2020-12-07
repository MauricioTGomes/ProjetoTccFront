<template>
    <CCard>
        <CCardHeader>
            <slot name="header">
                <CIcon name="cil-grid"/> Pedidos

                <div class="card-header-actions">
                    <div class="row">
                        <div class="col-sm-6">
                            <CSwitch @update:checked="atualizaListagem" color="primary" variant="3d"/> Estornados
                        </div>

                        <div class="col-sm-6">
                            <CButton size="sm" pressed block color="success" aria-pressed="true" to="/pedidos/adicionar">
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
                <CButton @click="modal.showModal = false" :color="modal.type" class="text-center">{{ modal.pedido != null ? 'Não' : 'Ok' }}</CButton>
                <CButton v-if="modal.pedido != null" @click="deletar" color="success">Sim</CButton>
            </template>
        </CModal>

        <CCardBody>
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="arrayPedidos" :fields="fieldsPedido" column-filter
                :table-filter="{label: 'Filtro: ', placeholder: 'Pesquisar...'}"
                :items-per-page-select="{label: 'Registros por página'}"
                :items-per-page="5" hover sorter pagination>

                <template #status_faturamento="{_, index}">
                    <td class="py-2">
                        <CBadge shape="pill" :color="arrayPedidos[index].faturado == '1' ? 'success' : 'danger'">{{ arrayPedidos[index].faturado == '1' ? 'Faturado' : 'Não faturado' }}</CBadge>
                    </td>
                </template>

                <template #status_entrega="{_, index}">
                    <td class="py-2">
                        {{ arrayPedidos[index].faturado == 0 ? 'Não informado' : ( `Previsto em (${arrayPedidos[index].data_entrega_f})\n${ (arrayPedidos[index].data_entrega_realizada_f == null ? 'Não entregue' : 'Entregue em (' + arrayPedidos[index].data_entrega_realizada_f + ')') }`) }}
                    </td>
                </template>

                <template #mostrar_detalhe="{_, index}">
                    <td class="py-2">
                        <CButton color="primary" variant="outline" square size="sm" @click="controlaDetalhes(index)">
                            <CIcon :name="arrayPedidos[index].mostrar_detalhe ? 'cil-minus' : 'cil-plus'"/> {{ arrayPedidos[index].mostrar_detalhe ? 'Esconder' : 'Mostrar' }}
                        </CButton>
                    </td>
                </template>

                <template #details="{_, index}">
                    <CCollapse :show="arrayPedidos[index].mostrar_detalhe" :duration="collapseDuration">
                        <CCardBody>
                            <h4>{{ arrayPedidos[index].nome }}</h4>

                            <CButton :disabled="arrayPedidos[index].faturado == '0'" size="sm" :color="arrayPedidos[index].status == 0 ? 'warning' : 'primary'" class="ml-1" @click="entregarPedido(arrayPedidos[index])">
                                <CIcon :name="arrayPedidos[index].status == 0 ? 'cil-calendar' : 'cil-calendar-check'"/>&nbsp;{{ arrayPedidos[index].status == 0 ? 'Marcar como entregue' : 'Marcar como não entregue' }}
                            </CButton>

                            <CButton size="sm" color="danger" class="ml-1" @click="modal =
                                {
                                    mensagem: 'Deseja realmente eliminar este pedido? Esta operação não podera ser desfeita.',
                                    showModal: true,
                                    pedido: arrayPedidos[index],
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

import {fieldsPedido} from '../../components/fields'
export default {
    name: "Listar",
    data () {
        return {
            arrayPedidos: [],
            fieldsPedido,
            collapseDuration: 0,
            modal: {
                showModal: false,
                pedido: {},
                type: '',
                mensagem: '',
                title: ''
            }
        }
    },

    methods: {
        entregarPedido(pedido) {
            this.$http.post(`/api/pedidos/alteraStatus/${pedido.id}`).then(resp => {
                this.modal = {mensagem: `Pedido marcado como ${pedido.status == 0 ? '' : 'não'} entregue com sucesso.`, showModal: true, pedido: null, title: 'Sucesso!', type: 'success'}
                this.atualizaListagem()
            })
        },

        deletar() {
            const self = this
            self.$http.post(`/api/pedidos/deletar/${self.modal.pedido.id}`).then(resp => {
                if (resp.data.erro) {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, pedido: null, title: 'Atenção!', type: 'danger'}
                } else {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, pedido: null, title: 'Sucesso!', type: 'success'}
                    this.atualizaListagem()
                }
            })
        },

        controlaDetalhes(index) {
            this.$set(this.arrayPedidos[index], 'mostrar_detalhe', !this.arrayPedidos[index].mostrar_detalhe)
            this.collapseDuration = 300
            this.$nextTick(() => { this.collapseDuration = 0})
        },

        atualizaListagem(estornado = false) {
            this.$http.post('/api/pedidos/listar', {estornado}).then(resp => this.$set(this, 'arrayPedidos', resp.data))
        },
    },

    mounted() {
        this.atualizaListagem()
    }
}
</script>

