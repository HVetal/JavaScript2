<template>
  <div id="nav">
    <nav>
      <!-- <router-link to="/">Главная</router-link>
      <router-link to="/cart">Корзина</router-link> -->
    </nav>
      <router-view/>

  </div>

</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('loadShowcase'),
    this.$store.dispatch('loadCart')
  }
}
</script>

<style lang="scss">

</style>
