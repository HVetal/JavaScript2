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
                // console.log(res);
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
             //   console.log(data);
            })

            // fetch(`${API_URL}/cart`, {
            //     metod: 'DELETE',
            //     headers: {
            //         "Content-Type": 'application/json',
            //     body: JSON.parse(data)
            //     }
            // })
            // .then((data) => {
            //     console.log(data);
            //     cart.pop(data);
            // })

    }
})