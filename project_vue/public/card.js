Vue.component(`card`, {
    template: `
    <div class="goods-item">
        <h3>{{ good.title }}</h3>
        <p>{{ good.price }}</p>
        <button :data-id="good.id" v-if="actionname === 'Купить'" v-on:click="getBuy">{{ actionname }}</button>
        <button :data-id="good.id" v-if="actionname === 'Удалить'" v-on:click="getDel">{{ actionname }}</button>
    </div>
    `,
    props: ['good', 'actionname'],
    methods: {
        getBuy() {
            console.log('click buy');
//            console.log(good);
            fetch(`${API_URL}/cart`, {
                metod: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                body: {"id":6,"title":"Xiaomi","price":100}
                }
            })
            .then((good) => {
                console.log(good);
                this.cart.push(good);
            })
        },
        getDel() {
            console.log('click del');
        }
    }
})