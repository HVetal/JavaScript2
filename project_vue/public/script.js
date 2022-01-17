const API_URL = 'http://localhost:3000/api/v1'
// const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

new Vue({
    el: "#app",
    data: {
        showcase: [],
        cart: [],
        addToCart: {},
        isCartVisible: false
    },
    methods: {
        onCartOpen() {
            this.isCartVisible = !this.isCartVisible
        }

    },
    mounted() {

        fetch(`${API_URL}/showcase`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.showcase = data;
            })

        fetch(`${API_URL}/cart`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.cart = data;
            })

    }
})