Vue.component(`card`, {
    template: `
    <div class="goods-item">
        <h3>{{ good.title }}</h3>
        <p>{{ good.price }}</p>
        <p v-if="actionname === 'Удалить'">{{ good.count }}</p>
        <button :data-id="good.id" v-if="actionname === 'Купить'" @click="getBuyProd">{{ actionname }}</button>
        <button :data-id="good.id" v-if="actionname === 'Удалить'" @click="getDelProd">{{ actionname }}</button>
    </div>
    `,
    props: ['good', 'actionname'],
    methods: {
        getBuyProd() {
            this.$emit('get-buy');
        },
        getDelProd() {
            this.$emit('get-del');
        },
    }
})