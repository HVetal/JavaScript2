<template>
<div class="featured__items-item">
    <div class="featured__items-wrapper">
        <img class="featured__items-img" :src="good.img" alt="product 6">
        <div class="featured__items-overlay"></div>
        <button type="button" class="featured__cart_button" @click="onClick">{{ actionname }}</button>
        <h3 class="featured__items-title">{{ good.title }}</h3>
                        <p class="featured__items-desc">{{ good.discription }}</p>
                        <p class="featured__items-price">${{ good.price }}</p>
    </div>
    </div>
</template>

<script>
export default {
    name: 'card',
    props: ['good', 'actionname'],
    methods: {
        onClick() {
          this.$emit('cardaction', this.good);
        },
    }
}
</script>