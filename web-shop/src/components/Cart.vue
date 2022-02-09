<template>
        <div class="featured__items-item">
        <card v-for="item in list" :good="item" :key="item.id" @cardaction="onRemove" :actionname='"Удалить"'></card>
    </div>
</template>

<script>

import card from './Card.vue'

export default {
    name: 'cartlist',
    components: {
        card,
    },

methods: {
    onRemove(product) {
        this.$store.dispatch('removeFromCart', product)
    }
},
computed: {
    list() {
        return this.$store.getters.getCart
    }
},
}
</script>