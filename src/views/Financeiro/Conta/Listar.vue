<template>
    <CCard>
        <CCardHeader>
            <slot name="header">
                <CIcon name="cil-grid"/> Contas {{ operacaoReceber ? 'receber' : 'pagar' }}
                <div class="card-header-actions">
                    <div class="row">
                        <div class="col-sm-6">
                            <CSwitch @update:checked="atualizaListagem" color="primary" variant="3d"/> Já fechada
                        </div>

                        <div class="col-sm-6">
                            <CButton size="sm" pressed block color="success" aria-pressed="true" :to="`/contas/adicionar/${this.$route.params.tipo}`">
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
                <CButton @click="modal.showModal = false" :color="modal.parcela != null ? 'danger' : modal.type" class="text-center">{{ modal.conta != null || modal.parcela != null ? 'Não' : 'Ok' }}</CButton>
                <CButton v-if="modal.conta != null" @click="deletar" color="success">Sim</CButton>
                <CButton v-if="modal.parcela != null" @click="controlaEstornoBaixaParcela" color="success">Sim</CButton>
            </template>
        </CModal>

        <CModal class="text-center" :title="modalParcelas.operacao == 'BAIXAR' ? 'Baixar parcela' : 'Estornar parcela'" :color="modalParcelas.operacao == 'BAIXAR' ? 'primary' : 'warning'" size="lg" :show.sync="modalParcelas.showModal">
            <h2>{{ modalParcelas.conta.nome_pessoa }}</h2>
            <h3>{{ modalParcelas.conta.titulo }}</h3>
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="modalParcelas.parcelas" :fields="fieldsParcela"
                :items-per-page="5" hover pagination>
                <template #mostrar_detalhe="{_, index}">
                    <td class="py-2">
                        <CButton :color="modalParcelas.operacao == 'BAIXAR' ? 'success' : 'warning'" square size="sm"  @click="realizarOperacaoParcela(index)">
                            {{ modalParcelas.operacao == 'BAIXAR' ? 'Baixar' : 'Estornar' }}
                        </CButton>
                    </td>
                </template>
            </CDataTable>

            <template #footer>
                <CButton @click="modal = false" :color="modalParcelas.operacao == 'BAIXAR' ? 'primary' : 'warning'" class="text-center">OK</CButton>
            </template>
        </CModal>

        <CCardBody>
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="arrayContas" :fields="fields"
                :table-filter="{label: 'Filtro: ', placeholder: 'Pesquisar...'}"
                :items-per-page-select="{label: 'Registros por página'}" 
                :items-per-page="5" hover sorter pagination>
                <template #mostrar_detalhe="{_, index}">
                    <td class="py-2">
                        <CButton color="primary" variant="outline" square size="sm" @click="controlaDetalhes(index)">
                            <CIcon :name="arrayContas[index].mostrar_detalhe ? 'cil-minus' : 'cil-plus'"/> {{ arrayContas[index].mostrar_detalhe ? 'Esconder' : 'Mostrar' }}
                        </CButton>
                    </td>
                </template>

                <template #details="{_, index}">
                    <CCollapse :show="arrayContas[index].mostrar_detalhe" :duration="collapseDuration">
                        <CCardBody>
                            <h4>{{ arrayContas[index].nome }}</h4>
                            <CButton size="sm" class="ml-1" color="primary" @click="controlaOperacaoParcela(index, 'BAIXAR')">
                                <CIcon name="cil-plus"/>&nbsp;Baixar
                            </CButton>

                            <CButton color="warning" class="ml-1" size="sm" @click="controlaOperacaoParcela(index, 'ESTORNAR')">
                                <CIcon name="cil-minus"/>&nbsp;Estornar
                            </CButton>

                            <CButton size="sm" color="success" class="ml-1" :disabled="arrayContas[index].vlr_total !== arrayContas[index].vlr_restante" @click="$router.push({name: 'form.contas', params: {idConta: arrayContas[index].id}})">
                                <CIcon name="cil-pencil"/>&nbsp;Editar
                            </CButton>

                            <CButton size="sm" color="danger" :disabled="arrayContas[index].vlr_total !== arrayContas[index].vlr_restante" class="ml-1" @click="modal =
                                {
                                    mensagem: 'Deseja realmente eliminar este conta? Esta operação não podera ser desfeita.',
                                    showModal: true, 
                                    conta: arrayContas[index],
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

import { fieldsConta } from '../../../components/fields'

export default {
    name: "Listar",
    data () {
        return {
            arrayContas: [],
            fields: fieldsConta,
            fieldsParcela: [],
            collapseDuration: 0,
            modalParcelas: {
                showModal: false,
                conta: {},
                parcelas: [],
                operacao: 'BAIXAR'
            },
            modal: {
                showModal: false,
                conta: {},
                parcela: {},
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
        controlaOperacaoParcela(index, operacao = 'BAIXAR') {
            this.fieldsParcela = [
                { key: 'nro_parcela', label: 'Parcela', _style:'width: 20%' },
                { key: 'valor', label: 'Valor (R$)', _style:'width: 30%' },
                { key: 'data_vencimento', label: 'Vencimento', _style:'width: 20%' },
            ]
            let parcelas = this.arrayContas[index].parcelas_abertas

            if (operacao !== 'BAIXAR') {
                parcelas = this.arrayContas[index].parcelas_pagas
                this.fieldsParcela.push({ key: 'data_pagamento', label: 'Pagamento', _style:'width: 20%' })
            }

            this.fieldsParcela.push({ key: 'mostrar_detalhe',  label: '',  _style: 'width: 10%',  sorter: false, filter: false })
            this.modalParcelas = {showModal: true, conta: this.arrayContas[index], parcelas: parcelas, operacao}
        },

        deletar() {
            const self = this
            self.$http.post(`/api/contas/deletar/${self.modal.conta.id}`).then(resp => {
                if (resp.data.erro) {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, conta: null, title: 'Atenção!', type: 'danger'}
                } else {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, conta: null, title: 'Sucesso!', type: 'success'}
                    self.atualizaListagem()
                }
            })
        },
        
        controlaDetalhes(index) {
            this.$set(this.arrayContas[index], 'mostrar_detalhe', !this.arrayContas[index].mostrar_detalhe)
            this.collapseDuration = 300
            this.$nextTick(() => { this.collapseDuration = 0})
        },

        controlaEstornoBaixaParcela() {
            const self = this
            self.$http.post(`/api/contas/${self.modalParcelas.operacao == 'BAIXAR' ? 'baixarParcela' : 'estornarParcela'}/${self.modal.parcela.id}`).then(resp => {
                if (resp.data.erro) {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, parcela: null, title: 'Atenção!', type: 'danger'}
                } else {
                    self.modal = {mensagem: resp.data.mensagem, showModal: true, parcela: null, title: 'Sucesso!', type: 'success'}
                }
                self.atualizaListagem(self.modalParcelas.operacao !== 'BAIXAR')
            })
        },

        realizarOperacaoParcela(index) {
            this.modal = {
                mensagem: `Deseja realmente ${this.modalParcelas.operacao.toLowerCase()} este parcela? Esta operação não podera ser desfeita.`,
                showModal: true,
                conta: null,
                parcela: this.modalParcelas.parcelas[index],
                title: 'Atenção!',
                type:  this.modalParcelas.operacao == 'BAIXAR' ? 'success' : 'danger'
            }
            this.modalParcelas.showModal = false
        },

        atualizaListagem(valorZerado = false) {
            this.$http.post('/api/contas/listar', {tipo: this.$route.params.tipo == 'receber' ? 'R' : 'P', valorZerado}).then(resp => this.$set(this, 'arrayContas', resp.data))
        }
    },

    mounted() {
        this.atualizaListagem()
    }
}
</script>

