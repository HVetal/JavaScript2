Vue.component(`card`, {
    template: `
    <div class="goods-item">
        <h3>{{ good.title }}</h3>
        <p>{{ good.price }}</p>
        <button :data-id="good.id">{{ actionname }}</button>
    </div>
    `,
    props: ['good', 'actionname'],
    methods: {
        getBy() {
            this.$emit('cart-close')
        }
    }
})