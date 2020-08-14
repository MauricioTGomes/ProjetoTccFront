<script>
    import VcPesquisa from '../../../components/Pesquisa';
    import VcParcela from '../../../components/Parcela';

    const fields = [
        { key: 'nome_completo', label: 'Nome / Razão Social', _style:'width: 40%' },
        { key: 'documento_completo', label: 'CPF / CNPJ', _style:'width: 30%' },
        { key: 'nome_cidade_completo', label: 'Cidade', _style:'width: 30%' }
    ]
    export default {
        data() {
            return {
                fields,
                modal: {
                    title: 'Atenção!',
                    type: 'danger',
                    show: false,
                    mensagem: '',
                    redirect: false
                },
                conta: {
                    ativo: 1,
                    pessoa: {},
                    qtd_dias: 30,
                    nro_parcela: 1,
                    parcelas: []
                },
                editando: false
            }
        },
        components: {
            VcPesquisa,
            VcParcela
        },
        methods: {
            validaCampos (arrayDados) {
                arrayDados.forEach(element => {
                    if (element.value === undefined || !element.value || element.value == '') {
                        this.modal = {mensagem: `Campo: ${element.nome} não informado ou incorreto.`, show: true, title: 'Atenção!', type: 'danger'}
                        return false
                    }
                });
                return true
            },
            
            validarDados () {
                let valido = this.validaCampos([{value: this.conta.titulo, nome: 'Título'}, {value: this.conta.pessoa_id, nome: 'Pessoa'}, {value: this.conta.vlr_total, nome: 'Valor total'}])
                
                if (this.conta.parcelas.length <= 0) {
                    this.modal = {mensagem: `Calcule as parcelas antes de prosseguir.`, show: true, title: 'Atenção!', type: 'danger'}
                    valido = false
                }

                if (valido) {
                    let conta = this.conta
                    conta.tipo_operacao = this.$route.params.tipo == 'receber' ? 'R' : 'P'
                    this.$http.post(`/api/contas/${this.editando ? 'update' : 'gravar'}`, conta).then(resp => {
                        if (resp.data.erro) {
                            this.modal = {mensagem: resp.data.mensagem, show: true, title: 'Atenção!', type: 'danger'}
                        } else {
                            this.modal = {mensagem: resp.data.mensagem, show: true, title: 'Sucesso!', type: 'success', redirect: true}
                        }
                    })
                }
            },
              
            fechaModal() {
                if (this.modal.redirect) {
                    return this.$router.push('/contas/listar/'+this.$route.params.tipo)
                } else {
                    this.modal.show = false
                }
            },
        },

        mounted() {
            const self = this

            if (self.$route.params.idConta != undefined) {
                self.$set(self, 'editando', true)

                self.$http.post(`/api/contas/get/${self.$route.params.idConta}`).then(resp => {
                    self.$set(self, 'produto', resp.data)
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
                        <strong>Adicionar conta à {{ this.$route.params.tipo }}</strong>
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
                                <div class="col-sm-4">
                                    <vc-pesquisa
                                        url="/api/pessoas/listar"
                                        label="Pessoa"
                                        :value="conta.pessoa.nome_documento_completo"
                                        @input="(pessoa) => {
                                            this.conta.pessoa = pessoa
                                            this.conta.pessoa_id = pessoa.id
                                        }"
                                        :fields="fields">
                                    </vc-pesquisa>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Título" v-model="conta.titulo"/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Primeira cobrança" type="date" v-model="conta.primeira_cobranca"/>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label>Valor total (R$)</label>
                                        <input v-model="conta.vlr_total" class="form-control" v-money="conta.vlr_total" placeholder="Valor total R$"/>
                                    </div>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Dias entre parcelas" v-model="conta.qtd_dias" type="number"/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Número de parcelas" v-model="conta.nro_parcelas" type="number"/>
                                </div>
                            </div>

                            <div class="row">
                                <vc-parcela @parcelasCalculadas="(parcelas) => conta.parcelas = parcelas" :dias="conta.qtd_dias" :nro="conta.nro_parcelas" :primeira-cobranca="conta.primeira_cobranca" :vlr="conta.vlr_total"/>
                            </div>
                        </CForm>
                    </CCardBody>
                    
                    <CCardFooter>
                        <CButton size="sm" color="success" @click="validarDados">
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