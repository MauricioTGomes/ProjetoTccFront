const fieldsProdutosPesquisa = [
    { key: 'codigo', label: 'Código', _style:'width: 10%' },
    { key: 'nome', label: 'Nome', _style:'width: 40%' },
    { key: 'qtd_estoque', label: 'Estoque', _style:'width: 18%' },
    { key: 'valor_venda', label: 'Venda (R$)', _style:'width: 17%' },
]

const fieldsProdutos = [
    ...fieldsProdutosPesquisa,
    { key: 'mostrar_detalhe',  label: '',  _style: 'width: 15%',  sorter: false, filter: false }
    ]

const fieldsConta = [
    { key: 'data_emissao', label: 'Data emissão', _style:'width: 10%' },
    { key: 'nome_pessoa', label: 'Cliente', _style:'width: 30%' },
    { key: 'titulo', label: 'Título', _style:'width: 10%' },
    { key: 'vlr_total', label: 'Total (R$)', _style:'width: 20%' },
    { key: 'vlr_restante', label: 'Restante (R$)', _style:'width: 17%' },
    { key: 'mostrar_detalhe',  label: '',  _style: 'width: 13%',  sorter: false, filter: false }
]

const fieldsPessoaPesquisa = [
    { key: 'nome_completo', label: 'Nome / Razão Social', _style:'width: 40%' },
    { key: 'documento_completo', label: 'CPF / CNPJ', _style:'width: 30%' },
    { key: 'nome_cidade_completo', label: 'Cidade', _style:'width: 15%' }
]

const fieldsPessoa = [
    ...fieldsPessoaPesquisa,
    { key: 'mostrar_detalhe',  label: '',  _style: 'width: 15%',  sorter: false, filter: false }
]

const fieldsItem = [
    { key: 'nome', label: 'Apelido', _style:'width: 40%' },
    { key: 'valor_unitario', label: 'Unitário (R$)', _style:'width: 15%' },
    { key: 'quantidade', label: 'Quantidade', _style:'width: 15%' },
    { key: 'valor_total', label: 'Total (R$)', _style:'width: 15%' },
    { key: 'mostrar_detalhe',  label: '',  _style: 'width: 15%',  sorter: false, filter: false }
]

const fieldsPedido = [
    { key: 'created_at_f', label: 'Emissão', _style:'width: 10%' },
    { key: 'status_entrega', label: 'Entrega', _style:'width: 10%', filter: false },
    { key: 'numero', label: 'Número', _style:'width: 10%' },
    { key: 'nome_pessoa', label: 'Cliente', _style:'width: 35%' },
    { key: 'status_faturamento', label: 'Status', _style:'width: 8%', sorter: false, filter: false },
    { key: 'valor_liquido', label: 'Valor (R$)', _style:'width: 13%' },
    { key: 'mostrar_detalhe',  label: '',  _style: 'width: 14%', sorter: false, filter: false }
]

const fieldsUser = [
    { key: 'name', label: 'Nome', _style:'width: 40%' },
    { key: 'email', label: 'E-mail', _style:'width: 30%' },
    { key: 'tipo', label: 'Tipo', _style:'width: 15%' },
    { key: 'mostrar_detalhe',  label: '',  _style: 'width: 15%',  sorter: false, filter: false }
]

const fieldsMovimentacao = [
    { key: 'created_at', label: 'Data e Hora', _style:'width: 10%' },
    { key: 'descricao', label: 'Descrição', _style:'width: 55%' },
    { key: 'status_movimentacao', label: 'Operação', _style:'width: 15%',  sorter: false, filter: false  },
    { key: 'valor', label: 'Valor (R$)', _style:'width: 10%' },
    { key: 'valor_desconto', label: 'Desconto (R$)', _style:'width: 10%' },
]

export { fieldsProdutos, fieldsConta, fieldsPessoa, fieldsPessoaPesquisa, fieldsProdutosPesquisa, fieldsItem, fieldsPedido, fieldsUser, fieldsMovimentacao }
