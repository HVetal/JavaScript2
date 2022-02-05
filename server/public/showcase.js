Vue.component('showcase', {
    template: `
    <div class="goods-list">
        <card v-for="item in list" :good="item" :key="item.id" :actionname='"Купить"' v-on:get-buy="getBuy(item, cart)"></card>
    </div>
    `,
    date() {
        return {
            cart: [],
        }
    },
    props: ['list', 'cart'],
    methods: {
        getBuy(good, cart) {
            let goodInc = good;
            const idx = this.cart.findIndex((stack) => stack.id == good.id);

            fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(good)
                })
                .then((data) => {

                    if (idx >= 0) {
                        goodInc.count += 1;
                    } else {
                        goodInc.count = 1;
                        cart.push(goodInc);
                    }
                })
        }
    },
})