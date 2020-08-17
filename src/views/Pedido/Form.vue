<script>
    import { fieldsProdutosPesquisa, fieldsItem, fieldsPessoaPesquisa } from '../../components/fields'
    import VcPesquisa from '../../components/Pesquisa'
    import VcParcela from '../../components/Parcela'

    export default {
        components: {
            VcPesquisa,
            VcParcela
        },
        data() {
            return {
                modal: {
                    title: 'Atenção!',
                    type: 'danger',
                    show: false,
                    mensagem: '',
                    redirect: false
                },
                fieldsProdutosPesquisa,
                fieldsItem,
                fieldsPessoaPesquisa,
                item: {
                    produto: {}
                },
                pedido: {
                    status: 0,
                    valor_liquido: '0,00',
                    valor_total: '0,00',
                    valor_desconto: '0,00',
                    faturado: false,
                    pessoa: {},
                    formaPagamento: {
                        valor_pago: '0,00',
                        array_parcelas: [],
                        tipo: 'VISTA'
                    },
                    itens: []
                },
                totalForm: '0,00',
                editando: false,
                editandoItem: false,
                valoresRestantes: {
                    valorBruto: '0,00',
                    valorForm: '0,00'
                }
            }
        },

        computed: {
            podeAdicionarProduto() {
                return this.$formatForCalc(this.item.valor_total) > 0
            },
            podeAdicionarPedido() {
                if (this.pedido.faturado) {
                    if (this.pedido.formaPagamento.tipo == 'VISTA') {
                        return this.$formatForCalc(this.pedido.formaPagamento.valor_pago) > 0
                    } else {
                        return this.$formatForCalc(this.pedido.formaPagamento.valor_pago) > 0 && this.pedido.formaPagamento.array_parcelas.length > 0 && this.pedido.pessoa_id !== undefined
                    }
                } else {
                    return this.$formatForCalc(this.totalForm) > 0
                }
            }
        },

        methods: {
            setaItem(produto) {
                this.$set(this, 'item', {
                    produto,
                    'nome': produto.apelido_produto,
                    'produto_id': produto.id,
                    'valor_total': produto.valor_venda,
                    'quantidade': '1,00',
                    'valor_unitario': produto.valor_venda
                })
            },

            adicionaProduto() {
                if (this.editandoItem) {
                    this.pedido.itens.splice(this.item.index, 1)
                }

                this.pedido.itens.push(this.item)
                this.$set(this, 'item', {produto: {}, 'produto_id': undefined})
                this.atualizaValorTotal()
            },

            calculaValorItem() {
                let valorTotal = this.$formatMoney(this.$formatForCalc(this.item.quantidade) * this.$formatForCalc(this.item.valor_unitario))
                this.$set(this.item, 'valor_total', valorTotal)
                this.atualizaValorTotal()
            },

            atualizaValorTotal() {
                let total = 0
                this.pedido.itens.forEach(item => {
                    total += this.$formatForCalc(item.valor_total)
                })
                total = this.$formatMoney(total, 2, ',', '.')
                this.$set(this, 'totalForm', total)
                this.$set(this.pedido, 'valor_liquido', total)
                this.$set(this.pedido, 'valor_total', total)
                this.$set(this, 'valoresRestantes', {valorForm: total, valorBruto: total})
            },

            setaDesconto() {
                let valor = this.$formatMoney(this.$formatForCalc(this.pedido.valor_total) - this.$formatForCalc(this.pedido.valor_desconto), 2, ',', '.')
                this.$set(this.pedido, 'valor_liquido', valor)
                this.$set(this, 'valoresRestantes', {valorForm: valor, valorBruto: valor})
            },

            setaValorRestante() {
                let valorForma = this.$formatForCalc(this.pedido.formaPagamento.valor_pago)
                let valorRestante = this.$formatForCalc(this.valoresRestantes.valorBruto)
                let resultado = valorRestante - valorForma

                if (resultado < 0) resultado = valorRestante

                this.$set(this.valoresRestantes, 'valorForm', this.$formatMoney(resultado, 2, ',', '.'))
            },

            operacaoItem(index, excluir) {
                if (excluir) {
                    this.pedido.itens.splice(index, 1)
                } else {
                    this.$set(this, 'item', this.pedido.itens[index])
                    this.$set(this.item, 'index', index)
                    this.$set(this, 'editandoItem', true)
                }
            },

            gravarPedido () {
                this.$http.post(`/api/pedidos/${this.editando ? 'update' : 'gravar'}`, this.pedido).then(resp => {
                    if (resp.data.erro) {
                        this.modal = {mensagem: resp.data.mensagem, show: true, title: 'Atenção!', type: 'danger'}
                    } else {
                        this.modal = {mensagem: resp.data.mensagem, show: true, title: 'Sucesso!', type: 'success', redirect: true}
                    }
                })
            },
              
            fechaModal() {
                if (this.modal.redirect) {
                    return this.$router.push('/pedidos/listar')
                } else {
                    this.modal.show = false
                }
            },
        },

        mounted() {
            const self = this

            if (self.$route.params.idPedido != undefined) {
                self.$set(self, 'editando', true)

                self.$http.post(`/api/pedidos/get/${self.$route.params.idPedido}`).then(resp => {
                    let pedidoResp = resp.data
                    pedidoResp.formaPagamento = {valor_pago: '0,00', array_parcelas: [], tipo: 'VISTA'}
                    pedidoResp.itens.forEach((item, index) => {
                        pedidoResp.itens[index].nome = item.produto.apelido_produto
                    })
                    pedidoResp.faturado = pedidoResp.faturado ===  '1'

                    self.$set(self, 'pedido', pedidoResp)
                })
            }
        }
    }

</script>

<template>
    <div>
         <CRow>
            <CCol md="12">
                <CCard>
                    <CCardHeader>
                        <strong>Adicionar pedido</strong>
                    </CCardHeader>

                    <CCardBody>
                        <CModal class="text-center" :title="modal.title" :color="modal.type" :show.sync="modal.show">
                            {{ modal.mensagem }}
                            <template #footer>
                                <CButton @click="fechaModal"  :color="modal.type" class="text-center">OK</CButton>
                            </template>
                        </CModal>

                        <CForm>
                            <div class="row">
                                <div class="col-sm-8">
                                    <vc-pesquisa
                                        url="/api/produtos/listar"
                                        label="Produto"
                                        :value="item.produto.apelido_produto"
                                        @input="setaItem"
                                        :fields="fieldsProdutosPesquisa">
                                    </vc-pesquisa>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label>Unitário (R$)</label>
                                        <input @keyup="calculaValorItem" :disabled="item.produto_id == undefined" v-model="item.valor_unitario" class="form-control" v-money="item.valor_unitario" placeholder="Unitário R$"/>
                                    </div>
                                </div>

                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label>Quantidade</label>
                                        <input @keyup="calculaValorItem" :disabled="item.produto_id == undefined" v-model="item.quantidade" class="form-control" v-money="item.quantidade" placeholder="Quantidade"/>
                                    </div>
                                </div>

                                <div class="col-sm-2">
                                    <div class="form-group">
                                        <label>Total (R$)</label>
                                        <input v-model="item.valor_total" disabled class="form-control" v-money="item.valor_total" placeholder="Valor total R$"/>
                                    </div>
                                </div>

                                <div class="col-sm-2" style="margin-top: 30px">
                                    <CButton size="sm" pill color="success" :disabled="!podeAdicionarProduto" @click="adicionaProduto">
                                        Adicionar
                                    </CButton>&nbsp;
                                </div>
                            </div>

                            <CCol sm="12">
                                <CCard>
                                    <CCardHeader>
                                        <strong>Produtos</strong>
                                    </CCardHeader>

                                    <CCardBody>
                                        <CDataTable :noItemsView="{noResults: 'Nenhum produto cadastrado', noItems: 'Nenhum produto cadastrado'}"
                                            :items="pedido.itens" :fields="fieldsItem" hover>
                                            <template #mostrar_detalhe="{_, index}">
                                                <td class="py-2">
                                                    <CButton class="ml-1" color="success" square size="sm" @click="operacaoItem(index, false)">Editar</CButton>
                                                    <CButton class="ml-1" color="danger" square size="sm" @click="operacaoItem(index, true)">Excluir</CButton>
                                                </td>
                                            </template>
                                        </CDataTable>
                                    </CCardBody>

                                    <CCardFooter>
                                        <CRow class="text-center">
                                            <CCol md sm="12" class="mb-sm-2 mb-0">
                                                <strong><div class="text-muted">Total (R$)</div>{{ totalForm }}</strong>
                                            </CCol>
                                        </CRow>
                                    </CCardFooter>
                                </CCard>
                            </CCol>

                            <div class="row" v-if="$formatForCalc(pedido.valor_total) > 0">
                                <div class="col-sm-4">
                                    <vc-pesquisa
                                        url="/api/pessoas/listar"
                                        label="Pessoa"
                                        :value="pedido.pessoa.nome_documento_completo"
                                        @input="(pessoaSelecionada) => {
                                            this.$set(this.pedido, 'pessoa', pessoaSelecionada)
                                            this.$set(this.pedido, 'pessoa_id', pessoaSelecionada.id)
                                        }"
                                        :fields="fieldsPessoaPesquisa">
                                    </vc-pesquisa>
                                </div>

                                <div class="col-sm-4" v-if="pedido.faturado">
                                    <CInput label="Data de entrega" type="date" v-model="pedido.data_entrega"/>
                                </div>

                                <div class="col-sm-4 col-xs-4" style="margin-top: 35px">
                                    <label class="csscheckbox csscheckbox-danger">
                                        <input v-model="pedido.faturado" name="fornecedor"
                                               type="checkbox"> <span></span>&nbsp;&nbsp;Faturar
                                    </label>
                                </div>
                            </div>

                            <CCol sm="12" v-if="pedido.faturado">
                                <CCard>
                                    <CCardHeader>
                                        <strong>Faturamento</strong>
                                    </CCardHeader>

                                    <CCardBody>
                                        <div class="row">
                                            <div class="col-sm-4">
                                                <div class="form-group">
                                                    <label>Total (R$)</label>
                                                    <input disabled v-model="pedido.valor_total" class="form-control" v-money="pedido.valor_total"/>
                                                </div>
                                            </div>

                                            <div class="col-sm-4">
                                                <div class="form-group">
                                                    <label>Desconto (R$)</label>
                                                    <input v-model="pedido.valor_desconto" class="form-control" v-money="pedido.valor_desconto" @keyup="setaDesconto"/>
                                                </div>
                                            </div>

                                            <div class="col-sm-4">
                                                <div class="form-group">
                                                    <label>Liquidio (R$)</label>
                                                    <input v-model="pedido.valor_liquido" class="form-control" v-money="pedido.valor_liquido" disabled/>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-4">
                                                <div class="form-group">
                                                    <label>Restante (R$)</label>
                                                    <input v-model="valoresRestantes.valorForm" :class="{'inputNegative': $formatForCalc(valoresRestantes.valorForm) != 0, 'inputPositive': $formatForCalc(valoresRestantes.valorForm) === 0}" class="form-control" v-money="valoresRestantes.valorForm" disabled/>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-sm-4">
                                                <CSelect label="Forma de pagamento" @update:value="(value) => pedido.formaPagamento.tipo = value" :value="pedido.formaPagamento.tipo" :horizontal="false" :options="[{value: 'VISTA', label: 'Á vista'},{value: 'PRAZO', label: 'Á prazo'}]"/>
                                            </div>

                                            <div class="col-sm-4">
                                                <div class="form-group">
                                                    <label>Valor pago (R$)</label>
                                                    <input v-model="pedido.formaPagamento.valor_pago" @keyup="setaValorRestante" class="form-control" v-money="pedido.formaPagamento.valor_pago" />
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="pedido.formaPagamento.tipo === 'PRAZO'">
                                            <div class="row">
                                                <div class="col-sm-4">
                                                    <CInput label="Dias entre parcelas" v-model="pedido.formaPagamento.qtd_dias" type="number"/>
                                                </div>

                                                <div class="col-sm-4">
                                                    <CInput label="Número de parcelas" v-model="pedido.formaPagamento.nro_parcelas" type="number"/>
                                                </div>

                                                <div class="col-sm-4">
                                                    <CInput label="Primeira cobrança" type="date" v-model="pedido.formaPagamento.primeira_cobranca"/>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <vc-parcela @parcelasCalculadas="(parcelas) => pedido.formaPagamento.array_parcelas = parcelas" :dias="pedido.formaPagamento.qtd_dias" :nro="pedido.formaPagamento.nro_parcelas" :primeira-cobranca="pedido.formaPagamento.primeira_cobranca" :vlr="pedido.formaPagamento.valor_pago"/>
                                            </div>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CForm>
                    </CCardBody>

                    <CCardFooter>
                        <CButton size="sm" color="success" :disabled="!podeAdicionarPedido" @click="gravarPedido">
                            <CIcon name="cil-check-circle"/> Salvar
                        </CButton>&nbsp;
                        <CButton size="sm" color="danger" to="/produtos/listar">
                            <CIcon name="cil-ban"/> Cancelar
                        </CButton>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>

<style>
    .inputNegative {
        border-color: red
    }

    .inputPositive {
        border-color: green;
    }
</style>