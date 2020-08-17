<template>
    <CCard>
        <CCardHeader>
            <slot name="header">
                <CIcon name="cil-grid"/> Movimentação de caixa
            </slot>

            <div class="card-header-actions">
                <CSelect label="Filtrar movimentação" @update:value="getMovimentacoes" :horizontal="false" :options="[{value: 0, label: 'Hoje'},{value: 7, label: 'Últimos 7 dias'},{value: 30, label: 'Últimos 30 dias'},{value: null, label: 'Total'}]"/>
            </div>
        </CCardHeader>

        <CCardBody>
            <CDataTable
                :noItemsView="{noResults: 'Nenhum resultado encontrado', noItems: 'Nenhum resultado encontrado' }"
                :items="parametrosMovimentacao.movimentacoes" :fields="fields"
                :table-filter="{label: 'Filtro: ', placeholder: 'Pesquisar...'}"
                :items-per-page-select="{label: 'Registros por página'}" 
                :items-per-page="5" hover sorter pagination>
                <template #status_movimentacao="{_, index}">
                    <td class="py-2">
                        <CBadge shape="pill" :color="parametrosMovimentacao.movimentacoes[index].movimentacao == 'ENTRADA' ? 'success' : 'danger'">{{ parametrosMovimentacao.movimentacoes[index].movimentacao == 'ENTRADA' ? 'Entrada' : 'Saída' }}</CBadge>
                    </td>
                </template>
            </CDataTable>

            <CRow>
                <CCol md="12">
                    <CCard>
                        <CCardHeader>
                            <CIcon name="cil-justify-center"/>
                            <strong> Totalizadores </strong>
                        </CCardHeader>
                        <CCardBody>
                            <CListGroup>
                                <CListGroupItem to="/pedidos/listar">Total de vendas: <strong> R$ {{ $formatMoney(parametrosMovimentacao.totalVendas, 2, ',', '.') }}</strong></CListGroupItem>
                                <CListGroupItem href="#" color="success">Total de entradas: <strong> R$ {{ $formatMoney(parametrosMovimentacao.entradas, 2, ',', '.') }}</strong></CListGroupItem>
                                <CListGroupItem href="#" color="warning">Total de saidas: <strong> R$ {{ $formatMoney(parametrosMovimentacao.saidas, 2, ',', '.') }}</strong></CListGroupItem>
                                <br>
                                <CListGroupItem href="#" :color="parametrosMovimentacao.total < 0 ? 'danger' : 'success'">Total: <strong> R$ {{ $formatMoney(parametrosMovimentacao.total, 2, ',', '.') }}</strong></CListGroupItem>
                            </CListGroup>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CCardBody>
    </CCard>
</template>

<script>

import { fieldsMovimentacao } from '../../components/fields'

export default {
    name: "Listar",
    data () {
        return {
            parametrosMovimentacao: {},
            fields: fieldsMovimentacao,
            fieldsParcela: [],
            dias: 0
        }
    },

    methods: {
        getMovimentacoes(dias = 0) {
            this.$http.post('/api/movimentacaoCaixa/getAll', {dias}).then(resp => this.$set(this, 'parametrosMovimentacao', resp.data))
        }
    },

    mounted() {
        this.getMovimentacoes()
    }
}
</script>

