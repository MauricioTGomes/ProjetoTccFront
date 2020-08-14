<script>
    export default {
        props: {dias: 0, nro: 0, primeiraCobranca: null, vlr: 0},
        data() {
            return {
                parcelas: [],
            }
        },

        methods: {
            alterar(index, valor) {
                this.$set(this.parcelas[index], 'data_vencimentio', valor)
                this.$emit('parcelasCalculadas', this.parcelas)
            },

            calculaParcelas() {
                if (this.dias > 0 && this.nro > 0 && this.primeiraCobranca !== null && this.vlr != 0) {
                    this.$http.post('/api/contas/calculaParcelas', {
                        'vlr_total': this.vlr,
                        'qtd_dias': this.dias,
                        'qtd_parcelas': this.nro,
                        'primeira_cobranca': this.primeiraCobranca
                    }).then(resp => {
                        this.$set(this, 'parcelas', resp.data)
                        this.$emit('parcelasCalculadas', resp.data)
                    })
                } else {
                    //Erro
                }
            }
        },
        mouted() {
            
        }
    }
</script>

<template>
    <CCol sm="12">
        <CCard>
            <CCardHeader>
                <strong>Parcelas</strong>
                <div class="card-header-actions">
                    <CButton size="sm" color="success" @click="calculaParcelas">
                        Calcular parcelas
                    </CButton>
                </div>
            </CCardHeader>
            <CCardBody>
                <div class="row" v-if="parcelas.length > 0" v-for="(parcela, index) in parcelas">
                    <div class="col-sm-4">
                        <input :value="parcela.nro_parcela" class="form-control" disabled />
                    </div>

                    <div class="col-sm-4">
                        <CInput @input="(valor) => alterar(index, valor)" :value="`${parcela.data_vencimento}`" type="date"/>
                    </div>

                    <div class="col-sm-4">
                        <input disabled :value="parcela.valor" class="form-control" />
                    </div>
                </div>
            </CCardBody>
        </CCard>
    </CCol>
</template>