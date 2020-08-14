<template>
    <router-view></router-view>
</template>

<script>
export default {
    name: 'App',
    mounted() {
        if (!this.$store.state.Auth.check) {
            return this.$router.push({name: 'login'})
        }
    }
}
</script>

<style lang="scss">
    @import 'assets/scss/style';
</style>
