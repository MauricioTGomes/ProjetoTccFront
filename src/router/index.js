import Vue from 'vue'
import Router from 'vue-router'

const TheContainer = () => import('@/containers/TheContainer')

// Views
import FormPessoa from '../views/Pessoa/Form'
import ListarPessoa from '../views/Pessoa/Listar'
import FormProduto from '../views/Produto/Form'
import ListarProduto from '../views/Produto/Listar'
import ListarContas from '../views/Financeiro/Conta/Listar'
import FormContas from '../views/Financeiro/Conta/Form'
import Login from '../views/Login'
const Dashboard = () => import('@/views/Dashboard')

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
    return [
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/',
            redirect: '/',
            name: 'home',
            component: TheContainer,
            children: [
                {
                    path: '/',
                    name: 'Dashboard',
                    component: Dashboard
                },
                {
                    path: '/pessoas/listar',
                    name: 'listar.pessoa',
                    component: ListarPessoa
                },
                {
                    path: '/pessoas/adicionar',
                    name: 'form.pessoa',
                    component: FormPessoa
                },
                {
                    path: '/produtos/listar',
                    name: 'listar.produto',
                    component: ListarProduto
                },
                {
                    path: '/produtos/adicionar',
                    name: 'form.produto',
                    component: FormProduto
                },
                {
                    path: '/contas/listar/:tipo',
                    name: 'listar.contas',
                    component: ListarContas
                },
                {
                    path: '/contas/adicionar/:tipo',
                    name: 'form.contas',
                    component: FormContas
                },
            ]
        },
    ]
}

