<template>
    <div class="c-app">

        <CSidebar fixed :minimize="minimize" :show="show" 
            @update:show="(value) => $store.commit('set', ['sidebarShow', value])">
            <CRenderFunction flat :content-to-render="$options.nav"/>
        
            <CSidebarMinimizer class="d-md-down-none" @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"/>
        </CSidebar>

        <CWrapper>
             <CHeader fixed with-subheader light>
                <CToggler in-header class="ml-3 d-lg-none" @click="$store.commit('toggleSidebarMobile')"/>
                <CToggler in-header class="ml-3 d-md-down-none" @click="$store.commit('toggleSidebarDesktop')"/>
                 <CHeaderBrand class="mx-auto d-lg-none" to="/"></CHeaderBrand>

                 <CHeaderNav class="d-md-down-none mr-auto">
                     <CHeaderNavItem class="px-3">
                         <CHeaderNavLink to="/">
                             Inicial
                         </CHeaderNavLink>
                     </CHeaderNavItem>
                     <CHeaderNavItem class="px-3">
                         <CHeaderNavLink to="/pedidos/listar" exact>
                             Pedidos
                         </CHeaderNavLink>
                     </CHeaderNavItem>
                     <CHeaderNavItem class="px-3">
                         <CHeaderNavLink to="/pessoas/listar" exact>
                             Pessoas
                         </CHeaderNavLink>
                     </CHeaderNavItem>
                     <CHeaderNavItem class="px-3">
                         <CHeaderNavLink to="/produtos/listar" exact>
                             Produtos
                         </CHeaderNavLink>
                     </CHeaderNavItem>
                 </CHeaderNav>

                 <CHeaderNav class="mr-4">
                     <CHeaderNavItem class="d-md-down-none mx-2">
                         <CHeaderNavLink href="/api/auth/logout">
                             <CIcon name="cil-lock-locked"/>
                         </CHeaderNavLink>
                     </CHeaderNavItem>
                 </CHeaderNav>
            </CHeader>


            <div class="c-body">
                <main class="c-main">
                <CContainer fluid>
                    <transition name="fade">
                        <router-view></router-view>
                    </transition>
                </CContainer>
                </main>
            </div>
            
            <CFooter :fixed="false">
                <div>
                    <span class="ml-1">&copy; {{new Date().getFullYear()}}</span>
                </div>
                <div class="ml-auto">
                    <span class="mr-1">Desenvolvido por Mauricio Treviso Gomes</span>
                </div>
            </CFooter>
        </CWrapper>
    </div>
</template>

<script>
import nav from './_nav'
export default {
    name: 'TheContainer',
    nav,
    methods: {
        logout() {
            this.$http.post('/api/auth/logout').then(resp => {
                this.$store.dispatch('logout');
                this.$http.defaults.headers.common['Authorization'] = ""
                return this.$router.push({name: 'login'})
            })
        }
    },
    computed: {
        show () {
            return this.$store.state.Layout.sidebarShow 
        },
        minimize () {
            return this.$store.state.Layout.sidebarMinimize 
        }
    }
}
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
