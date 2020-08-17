<template>
    <div class="c-app flex-row align-items-center">
        <CModal class="text-center" title="Atenção!" color="danger" :show.sync="controlaModal.show">
            {{ controlaModal.mensagem }}
             <template #footer>
                <CButton @click="controlaModal.show = false"  color="danger">OK</CButton>
            </template>
        </CModal>

        <CContainer>
            <CRow class="justify-content-center">
                <CCol md="8">
                <CCard class="p-4">
                    <CCardBody>
                        <CForm>
                            <h1>Entrar</h1>
                            <p class="text-muted">Insira seus dados</p>
                            <CInput placeholder="E-mail" autocomplete="username email" v-model="user.email">
                                <template #prepend-content><CIcon name="cil-user"/></template>
                            </CInput>
                            <CInput placeholder="Senha" type="password" autocomplete="curent-password" v-model="user.password">
                                <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                            </CInput>
                            
                            <CRow>
                                <CCol col="6" class="text-left">
                                    <CButton color="primary" @click="login" class="px-4">Entrar</CButton>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
                </CCol>
            </CRow>
        </CContainer>
    </div>
</template>
<script>

export default {
    name: 'Login',

    data () {
        return {
            controlaModal: {
                show: false,
                mensagem: ''
            },
            user: {
                password: '',
                email: ''
            }
        }
    },
    methods: {
        login() {
            this.$http.post('api/auth/login', this.user).then(resp => {
                if (resp.data.error) {
                    this.$set(this, 'controlaModal', {
                        show: true, mensagem: resp.data.mensagem
                    })
                } else {
                    this.$store.dispatch('setUserToken', resp.data);
                    this.$http.defaults.headers.common['Authorization'] = "Bearer " + resp.data.access_token
                    return this.$router.push({name: 'home'})
                }
            })
        }
    },

    mounted() {
        this.$store.dispatch('logout');
        this.$http.defaults.headers.common['Authorization'] = ""
        return this.$router.push({name: 'login'})
    }
}

</script>
<style scoped>


#login-container {
    position: absolute;
    width: 300px;
    height: 300px;
    top: 30px;
    left: 50%;
    margin-left: -150px;
    z-index: 1000;
}

.block {
    -webkit-box-shadow: 0 2px 0 rgba(218, 229, 232, .5);
    box-shadow: 0 2px 0 rgba(218, 229, 232, .5);
}

.block {
    margin: 0 0 10px;
    padding: 20px 15px 1px;
    background-color: #ffffff;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    -webkit-box-shadow: 0 2px 0 rgba(218, 224, 232, .5);
    box-shadow: 0 2px 0 rgba(218, 224, 232, .5);
}

.block-title {
    background: rgba(218, 229, 232, .15);
    margin: -20px -15px 20px;
    border-bottom: 2px solid #dae0e8;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
}

.block-title:hover {
    border-bottom-color: #dae5e8;
}

.block-title h1, .block-title h2, .block-title h3, .block-title h4, .block-title h5, .block-title h6 {
    display: inline-block;
    font-size: 14px;
    line-height: 1.4;
    margin: 0;
    padding: 10px 15px 9px;
    font-weight: 600;
    text-transform: uppercase;
}

body {
    overflow: hidden;
}
</style>
