Vue.component(`showcase`, {
    template: `
    <div class="goods-list">
        <card v-for="item in list" :good="item" :key="item.id" :actionname='"Купить"' v-on:click="getBuyProd"></card>
    </div>
    `,
    props: ['list'],
    methods: {
        getBuyProd() {
            this.$emit('get-buy');
        },
    }
})

