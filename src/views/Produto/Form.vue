<script>
    export default {
        data() {
            return {
                 modal: {
                    title: 'Atenção!',
                    type: 'danger',
                    show: false,
                    mensagem: '',
                    redirect: false
                },
                produto: {
                    ativo: 1,
                },
                editando: false
            }
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
                let valido = this.validaCampos([
                    {value: this.produto.nome, nome: 'Nome'},
                    {value: this.produto.apelido_produto, nome: 'Apelido'},
                    {value: this.produto.codigo, nome: 'Código'},
                    {value: this.produto.qtd_estoque, nome: 'Estoque'},
                ])

                if (valido) {
                    this.$http.post(`/api/produtos/${this.editando ? 'update' : 'gravar'}`, this.produto).then(resp => {
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
                    return this.$router.push('/produtos/listar')
                } else {
                    this.modal.show = false
                }
            },

        },

        mounted() {
            const self = this

            self.$store.dispatch('setTitle', 'Adicionar produto')

            if (self.$route.params.idProduto != undefined) {
                self.$set(self, 'editando', true)

                self.$http.post(`/api/produtos/get/${self.$route.params.idProduto}`).then(resp => {
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
                        <strong>Adicionar Produto</strong>
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
                                    <CSelect label="Ativa" @update:value="(value) => produto.ativo = value" :value="produto.ativo" :horizontal="false" :options="[{value: 1, label: 'Sim'},{value: 0, label: 'Não'}]" placeholder="Selecione uma opção.."/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Nome" v-model="produto.nome" @keyup="$set(produto, 'apelido_produto', produto.nome)" placeholder="Nome produto"/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Apelido produto" v-model="produto.apelido_produto" placeholder="Apelido produto"/>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-4">
                                    <CInput label="Código" v-model="produto.codigo" placeholder="Código" type="number"/>
                                </div>

                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label>Estoque</label>
                                        <input v-model="produto.qtd_estoque" class="form-control" v-money="produto.qtd_estoque" placeholder="Quantidade estoque"/>
                                    </div>
                                </div>

                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label>Valor venda (R$)</label>
                                        <input v-model="produto.valor_venda" v-money="produto.valor_venda" class="form-control" placeholder="Valor venda (R$)"/>
                                    </div>
                                </div>
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