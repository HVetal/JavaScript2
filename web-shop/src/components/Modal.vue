<template>
        <div class="modal">
        <button id="close-btn" v-on:click="onClick">Close</button>
        <div class="cart-list">
            <card v-for="item in list" :good="item" :key="item.id" :actionname='"Удалить"' v-on:cardaction="onRemove"></card>
            
        </div>
    </div>
</template>

<script>
// const API_URL = 'http://localhost:3000/api/v1'

import card from './Card.vue'

export default {
    name: 'cart',
    components: {
        card,
    },
    computed: {
    list() {
        return this.$store.getters.getCart
    }
},
    methods: {
        onClick() {
            this.$emit('cart-close');
        },

        onRemove(product) {
            this.$store.dispatch('removeFromCart', product)
        }
    }
}
</script>

<style lang="scss" scoped>
  .modal {
    width: 700px;
    min-height: 400px;
    position: absolute;
    top: 350px;
    left: calc(50% - 400px);
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 3px;
    padding: 20px;
    }
</style>