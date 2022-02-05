Vue.component('cart', {
    template: `
    <div class="modal">
        <button id="close-btn" v-on:click="onClick">Close</button>
        <div class="cart-list">
            <card v-for="item in list" :good="item" :key="item.id" :actionname='"Удалить"' v-on:get-del="getDel(list, item)"></card>
            
        </div>
    </div>
            `,
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
})