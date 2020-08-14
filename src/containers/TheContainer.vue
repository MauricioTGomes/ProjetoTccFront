<template>
    <div class="c-app">

        <CSidebar fixed :minimize="minimize" :show="show" 
            @update:show="(value) => $store.commit('set', ['sidebarShow', value])">
            
            <CSidebarBrand class="d-md-down-none" to="/">
                <CIcon class="c-sidebar-brand-full"  name="logo" size="custom-size"  :height="35" viewBox="0 0 556 134"/>
                <CIcon class="c-sidebar-brand-minimized"  name="logo"  size="custom-size" :height="35" viewBox="0 0 110 134"/>
            </CSidebarBrand>

            <CRenderFunction flat :content-to-render="$options.nav"/>
        
            <CSidebarMinimizer class="d-md-down-none" @click.native="$store.commit('set', ['sidebarMinimize', !minimize])"/>
        </CSidebar>

        <CWrapper>
             <CHeader fixed with-subheader light>
                <CToggler in-header class="ml-3 d-lg-none" @click="$store.commit('toggleSidebarMobile')"/>
                <CToggler in-header class="ml-3 d-md-down-none" @click="$store.commit('toggleSidebarDesktop')"/>
            
                <CHeaderNav class="mr-4">
                    <CDropdown inNav class="c-header-nav-items" placement="bottom-end" add-menu-classes="pt-0" >
                        <template #toggler>
                            <CHeaderNavLink>
                                <div class="c-avatar">
                                <img src="img/avatars/6.jpg" class="c-avatar-img " />
                                </div>
                            </CHeaderNavLink>
                        </template>
                        
                        <CDropdownItem>
                            <CIcon name="cil-shield-alt" /> Perfil
                        </CDropdownItem>
                        <CDropdownItem  @click="logout">
                            <CIcon name="cil-lock-locked"/> Sair
                        </CDropdownItem>
                    </CDropdown>
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
