<template>
        <li class="featured__items-container">
        <card v-for="item in list" :good="item" :key="item.id" @cardaction="onAdd" :actionname='"Купить"'></card>
    </li>
</template>

<script>

import card from './Card.vue'

export default {
    name: 'showcase',
    components: {
        card,
    },
computed: {
    list() {
        return this.$store.getters.getShowcase
    }
},
methods: {
    onAdd(product) {
        this.$store.dispatch('addToCart', product)
    }
}
}
</script>