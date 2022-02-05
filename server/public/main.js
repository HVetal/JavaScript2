const API_URL = 'http://localhost:3000/api/v1'

new Vue({
    el: "#app",
    data: {
        showcase: [],
        filteredGoods: [],
        cart: [],
        isCartVisible: false,
        searchLine: ''
    },
    mounted() {
        fetch(`${API_URL}/showcase`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.showcase = data;
                this.filteredGoods = data;
            })
        fetch(`${API_URL}/cart`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.cart = data;
            })
    },
    methods: {
        onCartOpen() {
            this.isCartVisible = !this.isCartVisible;
        },
        setFilter() {
            const search = new RegExp(this.searchLine, 'i');
            this.filteredGoods = this.showcase.filter((good) => search.test(good.title));
            this.searchLine = '';
        },

        onClick() {
            this.$emit('cart-close');
        },
    },

})