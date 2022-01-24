// window.Event = new Vue();

Vue.component(`card`, {
    template: `
    <div class="goods-item">
        <h3>{{ good.title }}</h3>
        <p>{{ good.price }}</p>
        <button :data-id="good.id" v-if="actionname === 'Купить'" @click="getBuy">{{ actionname }}</button>
        <button :data-id="good.id" v-if="actionname === 'Удалить'" @click="getDel">{{ actionname }}</button>
    </div>
    `,
    data() {
        return {
            cart: [],
        }
    },
    props: ['good', 'actionname'],
    methods: {

        // onEvent() {
        //     Event.$emit('')
        // }

        getBuy() {
            console.log('click add');
            fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(this.good)
                })
                .then((data) => {
                    this.cart.push(data);
                })
        },

        getDel() {
            console.log('click del');
            fetch(`${API_URL}/cart`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify(this.good)
                })
                .then((data) => {
                    this.cart.pop(data);
                })
        }
        // getBuyProd() {
        //     console.log('getBuyProd');
        //     this.$emit('get-buy');
        // },
        // getDelProd() {
        //     console.log('getDelProd');
        //     this.$emit('get-del');
        // },
    }
})