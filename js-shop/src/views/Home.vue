<template>
  <div class="home">
     <header>
            <input type="text" v-model="searchLine">
            <button type="button" id="search-btn" v-on:click="setFilter">Искать</button>

            <button class="cart-button" v-on:click="onCartOpen" type="button">Корзина</button>

        </header>

        <main>
            <showcase :list="filteredGoods" :cart="cart"></showcase>

        </main>
        <cart v-if="isCartVisible" :list="cart" v-on:cart-close="onCartOpen"></cart>
  </div>
</template>

<script>
const API_URL = 'http://localhost:3000/api/v1'

import cart from '../components/Cart.vue'
import showcase from '../components/Showcase.vue'

export default {
  name: 'Home',
  components: {
    cart,
    showcase,
  },
  data() {
        return {
        showcase: [],
        filteredGoods: [],
        cart: [],
        isCartVisible: false,
        searchLine: '',
        }
    },
    mounted() {
        fetch(`${API_URL}/showcase`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.showcase = data;
                this.filteredGoods = data;
            })
        fetch(`${API_URL}/cart`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.cart = data;
            })
    },
    methods: {
        onCartOpen() {
            this.isCartVisible = !this.isCartVisible;
        },
        setFilter() {
            const search = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.showcase.filter((good) => search.test(good.title));
            this.searchLine = '';
        },

        onClick() {
            this.$emit('cart-close');
        },
    }

}
</script>
