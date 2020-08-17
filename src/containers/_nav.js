export default [
    {
        _name: 'CSidebarNav',
        _children: [
        {
            _name: 'CSidebarNavItem',
            name: 'Inicial',
            to: '/',
            icon: 'cil-speedometer'
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Funcional']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Pessoas',
            to: '/pessoas/listar',
            icon: 'cil-user'
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Produtos',
            to: '/produtos/listar',
            icon: 'cil-inbox'
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Movimentação']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Pedidos',
            to: '/pedidos/listar',
            icon: 'cil-file'
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Financeiro']
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'Contas',
            route: '/contas',
            icon: 'cil-swap-horizontal',
            items: [
                {
                    name: 'Receber',
                    to: '/contas/listar/receber',
                    icon: 'cil-plus',
                },
                {
                    name: 'Pagar',
                    to: '/contas/listar/pagar',
                    icon: 'cil-minus',
                },
            ]
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Movimentação financeira',
            to: '/financeiro/listar',
            icon: 'cil-money'
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Gerenciar']
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Cadastro usuário',
            to: '/usuarios/listar',
            icon: 'cil-user-plus'
        },
        ]
    }
]