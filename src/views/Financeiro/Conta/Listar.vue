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
                            {{ arrayContas[index].mostrar_detalhe ? 'Esconder' : 'Mostrar' }}
                        </CButton>
                    </td>
                </template>

                <template #details="{_, index}">
                    <CCollapse :show="arrayContas[index].mostrar_detalhe" :duration="collapseDuration">
                        <CCardBody>
                            <h4>{{ arrayContas[index].nome }}</h4>
                            <CButton size="sm" class="ml-1" color="primary" @click="controlaOperacaoParcela(index, 'BAIXAR')">Baixar</CButton>

                            <CButton color="warning" class="ml-1" size="sm" @click="controlaOperacaoParcela(index, 'ESTORNAR')">Estornar</CButton>

                            <CButton size="sm" color="success" class="ml-1" :disabled="arrayContas[index].vlr_total !== arrayContas[index].vlr_restante" @click="$router.push({name: 'form.contas', params: {idConta: arrayContas[index].id}})">
                                Editar
                            </CButton>

                            <CButton size="sm" color="danger" :disabled="arrayContas[index].vlr_total !== arrayContas[index].vlr_restante" class="ml-1" @click="modal =
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
    { key: 'nome_pessoa', label: 'Cliente', _style:'width: 30%' },
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
                    self.$http.post('/api/contas/listar', {tipo: this.operacaoReceber ? 'R' : 'P'}).then(resp => self.$set(self, 'arrayContas', resp.data))
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
                self.$http.post('/api/contas/listar', {tipo: this.operacaoReceber ? 'R' : 'P'}).then(resp => self.$set(self, 'arrayContas', resp.data))
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
        }
    },

    mounted() {
        this.$http.post('/api/contas/listar', {tipo: this.$route.params.tipo == 'receber' ? 'R' : 'P'}).then(resp => this.$set(this, 'arrayContas', resp.data))
    }
}
</script>

