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
                usuario: {
                    tipo: 'GERENTE',
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
                    {value: this.usuario.name, nome: 'Nome'},
                    {value: this.usuario.email, nome: 'E-mail'},
                    {value: this.usuario.password, nome: 'Senha'},
                    {value: this.usuario.password_confirm, nome: 'Confirmção da senha'},
                ])

                if (this.usuario.password !== this.usuario.password_confirm) {
                    this.modal = {mensagem: `As senhas não conferem`, show: true, title: 'Atenção!', type: 'danger'}
                    this.usuario.password = ''
                    this.usuario.password_confirm = ''
                } else if (valido) {
                    this.$http.post(`/api/usuarios/${this.editando ? 'update' : 'gravar'}`, this.usuario).then(resp => {
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
                    return this.$router.push('/usuarios/listar')
                } else {
                    this.modal.show = false
                }
            },

        },

        mounted() {
            const self = this

            self.$store.dispatch('setTitle', 'Adicionar produto')

            if (self.$route.params.idUsuario != undefined) {
                self.$set(self, 'editando', true)

                self.$http.post(`/api/usuarios/get/${self.$route.params.idUsuario}`).then(resp => {
                    self.$set(self, 'usuario', resp.data)
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
                        <strong>Adicionar usuário</strong>
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
                                    <CSelect label="Tipo" @update:value="(value) => usuario.tipo = value" :value="usuario.tipo" :horizontal="false" :options="[{value: 'VENDEDOR', label: 'Vendedor'},{value: 'GERENTE', label: 'Gerente'}]" placeholder="Selecione uma opção.."/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Nome" v-model="usuario.name" placeholder="Nome usuário" :autocomplete="false"/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="E-mail" v-model="usuario.email" placeholder="Digite o e-mail" type="email" autocomplete="email"/>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-4">
                                    <CInput label="Senha" v-model="usuario.password" placeholder="Digite a senha" type="password"/>
                                </div>

                                <div class="col-sm-4">
                                    <CInput label="Confirmação da senha" v-model="usuario.password_confirm" placeholder="Digite a confirmação da senha" type="password"/>
                                </div>
                            </div>
                        </CForm>
                    </CCardBody>

                    <CCardFooter>
                        <CButton size="sm" color="success" @click="validarDados">
                            <CIcon name="cil-check-circle"/> Salvar
                        </CButton>&nbsp;
                        <CButton size="sm" color="danger" to="/usuarios/listar">
                            <CIcon name="cil-ban"/> Cancelar
                        </CButton>
                    </CCardFooter>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>