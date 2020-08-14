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
            icon: 'cil-drop'
        },
        {
            _name: 'CSidebarNavItem',
            name: 'Produtos',
            to: '/produtos/listar',
            icon: 'cil-pencil'
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Movimentação']
        },
        {
            _name: 'CSidebarNavTitle',
            _children: ['Financeiro']
        },
        {
            _name: 'CSidebarNavDropdown',
            name: 'Contas',
            route: '/contas',
            icon: 'cil-puzzle',
            items: [
                {
                    name: 'Receber',
                    to: '/contas/listar/receber'
                },
                {
                    name: 'Pagar',
                    to: '/contas/listar/pagar'
                },
            ]
        },
        
        ]
    }
]