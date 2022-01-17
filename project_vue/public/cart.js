Vue.component('cart', {
    template: `
    <div class="modal">
        <button v-on:click="onClick">Close</button>
        <div class="cart-list">
            <card v-for="item in list" :good="item" :actionname='"Удалить"'></card>
        </div>
    </div>
            `,
    props: ['list'],
    methods: {
        onClick() {
            this.$emit('cart-close');
        }
    }
})