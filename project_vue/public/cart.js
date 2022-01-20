Vue.component('cart', {
    template: `
    <div class="modal">
        <button v-on:click="onClick">Close</button>
        <div class="cart-list">
            <card v-for="item in list" :good="item" :key="item.id" :actionname='"Удалить"' ></card>
        </div>
    </div>
            `,
    // data() {
    //     return {
    //         componentKey: 0,
    //     };
    // },
    props: ['list'],
    methods: {
        onClick() {
            this.$emit('cart-close');
        },
    //     getDelProd() {
    //         console.log('getDelProd');
    //         this.$emit('get-del');
    //     },

    // },
    // computed: {
    //     forceRerender() {
    //         console.log('get');
    //         this.componentKey += 1;  
    //       }
    }
 })

