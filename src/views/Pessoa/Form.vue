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
                pessoa: {
                    cliente: true,
                    fornecedor: false,
                    ativo: 1,
                    tipo: 'FISICO',
                    nome: '',
                    razao_social: '',
                    fantasia: '',
                    cnpj: '',
                    cpf: '',
                },
                editando: false
            }
        },

        methods: {
            validaCampos (arrayDados) {
                let valido = true

                arrayDados.forEach(element => {
                    if (element.value === undefined || !element.value || element.value == '') {
                        this.modal = {
                            mensagem: `Campo: ${element.nome} não informado ou incorreto.`,
                            show: true,
                            title: 'Atenção!',
                            type: 'danger'
                        }
                        valido = false
                        return false
                    }
                });

                return valido
            },

            fechaModal() {
                if (this.modal.redirect) {
                    return this.$router.push('/pessoas/listar')
                } else {
                    this.modal.show = false
                }
            },
            
            validarDados () {
                let camposValidar = [
                    {value: this.pessoa.endereco, nome: 'Endereço'},
                    {value: this.pessoa.endereco_nro, nome: 'Número'},
                    {value: this.pessoa.cep, nome: 'CEP'},
                    {value: this.pessoa.cidade_id, nome: 'Cidade'},
                    {value: this.pessoa.fone, nome: 'Telefone'}
                ]

                if (this.pessoa.tipo == 'FISICO') {
                    camposValidar.push({value: this.pessoa.nome, nome: 'Nome'})
                    camposValidar.push({value: this.pessoa.cpf, nome: 'CPF'})
                } else {
                    camposValidar.push({value: this.pessoa.razao_social, nome: 'Razão social'})
                    camposValidar.push({value: this.pessoa.fantasia, nome: 'Fantasia'})
                    camposValidar.push({value: this.pessoa.cnpj, nome: 'CNPJ'})
                }


                let valido = this.validaCampos(camposValidar)

                if (valido) {
                    this.$http.post(`/api/pessoas/${this.editando ? 'update' : 'gravar'}`, this.pessoa).then(resp => {
                        if (resp.data.erro) {
                            this.modal = {mensagem: resp.data.mensagem, show: true, title: 'Atenção!', type: 'danger'}
                        } else {
                            this.modal = {mensagem: resp.data.mensagem, show: true, title: 'Sucesso!', type: 'success', redirect: true}
                        }
                    })
                }
            },

            gerenciaConsultaCep() {
                const self = this
                let cep = self.pessoa.cep === undefined ? '' : self.pessoa.cep.replace('.', '').replace('-', '');

                if (cep == '') {
                    self.modal.show = true
                    self.modal.mensagem = 'O campo CEP não foi informado.'
                    self.modal.title = 'Aviso!'
                    self.modal.type = 'warning'
                    return null;
                }

                $.getJSON("//viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                    if (!("erro" in dados)) {
                        self.$set(self.pessoa, 'endereco', dados.logradouro)
                        self.$set(self.pessoa, 'bairro', dados.bairro)

                        self.$http.post('/api/getCidade', {
                            campo: "codigo_ibge",
                            valor: dados.ibge
                        }).then(resp => {
                            self.$set(self.pessoa, 'cidade_id', resp.data.id)
                            self.$set(self.pessoa, 'cidade', resp.data.nome_completo)
                        })
                    } else {
                        self.modal.show = true
                        self.modal.mensagem = 'CEP não localizado.'
                    }
                });
            },
        },

        mounted() {
            const self = this

            self.$store.dispatch('setTitle', 'Adicionar pessoa')
            
            if (self.$route.params.idPessoa != undefined) {
                self.$set(self, 'editando', true)

                self.$http.post(`/api/pessoas/get/${self.$route.params.idPessoa}`).then(resp => {
                    let pessoa = resp.data

                    pessoa.cidade = pessoa.cidade.nome_completo
                    pessoa.fornecedor = pessoa.fornecedor == '1'
                    pessoa.cliente = pessoa.cliente == '1'
                    self.$set(self, 'pessoa', pessoa)
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
                        <strong>Adicionar pessoa</strong>
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
                                    <div class="row">
                                        <div class="col-sm-6 col-xs-6">
                                            <label class="csscheckbox csscheckbox-danger">
                                                <input v-model="pessoa.cliente" name="cliente" type="checkbox">
                                                <span></span>&nbsp;&nbsp;Cliente
                                            </label>
                                        </div>

                                        <div class="col-sm-6 col-xs-6">
                                            <label class="csscheckbox csscheckbox-danger">
                                                <input v-model="pessoa.fornecedor" name="fornecedor"
                                                    type="checkbox"> <span></span>&nbsp;&nbsp;Fornecedor
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-4">
                                    <CSelect label="Tipo" @update:value="(value) => pessoa.tipo = value" :value="pessoa.tipo" :horizontal="false" :options="[{value: 'FISICO', label: 'Física'},{value: 'JURIDICO', label: 'Jurídica'}]" placeholder="Selecione o tipo de pessoa"/>
                                </div>

                                <div class="col-sm-4">
                                    <CSelect label="Ativo" @update:value="(value) => pessoa.ativo = value" :value="pessoa.ativo" :horizontal="false" :options="[{value: 1, label: 'Sim'},{value: 0, label: 'Não'}]" placeholder="Selecione se a pessoa esta ativa"/>
                                </div>
                            </div>

                            <div v-show="pessoa.tipo == 'FISICO'">
                                <div class="row">
                                    <div class="col-sm-4">
                                        <CInput label="Nome" v-model="pessoa.nome"/>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="form-group">
                                            <label>CPF</label>
                                            <the-mask type="text" class="form-control" :mask="'###.###.###-##'" :masked="true"
                                                v-model="pessoa.cpf"/>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <CInput label="RG" v-model="pessoa.rg" type="number"/>
                                    </div>
                                </div>
                            </div>

                            <div class="row" v-show="pessoa.tipo == 'JURIDICO'">
                                <div class="col-sm-4">
                                    <CInput label="Razão social" v-model="pessoa.razao_social"/>
                                </div>
                                <div class="col-sm-4">
                                    <CInput label="Fantasia" v-model="pessoa.fantasia"/>
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label>CNPJ</label>
                                        <the-mask type="text" class="form-control" :mask="'##.###.###/####-##'" :masked="true"
                                                v-model="pessoa.cnpj"/>
                                    </div>
                                </div>
                            </div>

                             <div class="row">
                                <div class="col-sm-4" v-if="pessoa.tipo == 'JURIDICO'">
                                    <CInput label="Inscrição estadual" v-model="pessoa.ie"/>
                                </div>
                            
                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <label>Telefone</label>
                                        <the-mask type="text" class="form-control" :mask="['(##) #####-####', '(##) ####-####']"
                                                v-model="pessoa.fone" name="fone"/>
                                    </div>
                                </div>
                            
                                <div class="col-sm-4">
                                    <div class="form-group">
                                        <CInput label="E-mail" v-model="pessoa.email"/>
                                    </div>
                                </div>
                            </div>
                            
                            <h3>Endereço</h3>
                            <div class="row">
                                <div class="col-sm-4">
                                    <label>CEP</label>
                                    <the-mask type="text" class="form-control" v-model="pessoa.cep" :mask="'##.###-###'" @blur.native="gerenciaConsultaCep"/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Endereço" v-model="pessoa.endereco"/>
                                </div>
                                <div class="col-sm-4">
                                    <CInput label="Número" v-model="pessoa.endereco_nro"/>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-4">
                                    <CInput label="Cidade" v-model="pessoa.cidade" disabled/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Complemento" v-model="pessoa.complemento"/>
                                </div>
                                <div class="col-sm-4">
                                    <CInput label="Bairro" v-model="pessoa.bairro"/>
                                </div>
                            </div>
                        </CForm>
                    </CCardBody>
                    <CCardFooter>
                        <CButton size="sm" color="success" @click="validarDados">
                            <CIcon name="cil-check-circle"/> Salvar
                        </CButton>&nbsp;
                        <CButton size="sm" color="danger" to="/pessoas/listar">
                            <CIcon name="cil-ban"/> Cancelar
                        </CButton>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>