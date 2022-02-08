<template>
        <div class="modal">
        <button id="close-btn" v-on:click="onClick">Close</button>
        <div class="cart-list">
            <card v-for="item in list" :good="item" :key="item.id" :actionname='"Удалить"' v-on:get-del="getDel(list, item)"></card>
            
        </div>
    </div>
</template>

<script>
const API_URL = 'http://localhost:3000/api/v1'
import card from './Card.vue'

export default {
    name: 'cart',
    components: {
        card,
    },
        data() {
        return {
            cart: [],
        };
    },
    props: ['list'],
    methods: {
        onClick() {
            this.$emit('cart-close');
        },

        getDel(cart, good) {
            const idx = cart.findIndex((stack) => stack.id == good.id);

            if (idx >= 0) {
                fetch(`${API_URL}/cart`, {
                        method: 'DELETE',
                        headers: {
                            "Content-Type": 'application/json'
                        },
                        body: JSON.stringify(good)
                    })
                    .then((data) => {
                        cart[idx].count--;
                        if (cart[idx].count <= 0) {
                            cart.splice(idx, 1)
                        }
                    })
            }
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