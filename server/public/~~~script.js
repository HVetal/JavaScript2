const API_URL = 'http://localhost:3000/api/v1'
// const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

new Vue({
    el: "#app",
    data: {
        showcase: [],
        filteredGoods: [],
        cart: [],
        isCartVisible: false,
        searchLine: ''
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

        // getBuy() {
        //     console.log('click add');
        //     fetch(`${API_URL}/cart`, {
        //             method: 'POST',
        //             headers: {
        //                 "Content-Type": 'application/json'
        //             },
        //             body: JSON.stringify(this.good)
        //         })
        //         .then((data) => {
        //             this.cart.push(data);
        //         })
        // },

        // getDel() {
        //     console.log('click del');
        //     fetch(`${API_URL}/cart`, {
        //             method: 'DELETE',
        //             headers: {
        //                 "Content-Type": 'application/json'
        //             },
        //             body: JSON.stringify(this.good)
        //         })
        //         .then((data) => {
        //             this.cart.pop(data);
        //         })
        // }

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

    computed: {

    }
})

