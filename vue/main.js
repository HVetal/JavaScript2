Vue.component('cart', {
    template: `
    <ul>
    <li v-bind:data-id="good.id" v-for="good of cart"><strong>{{ good.title }}</strong> {{ good.price }}$</li>
</ul>
    `,
    props: [
        'cart'
    ]
})

new Vue({
    el: '#app',
    data: {
        name: 'Jack',
        isVisible: true,
        list: [{
                id: 1,
                title: 'Shirt',
                price: 20
            },
            {
                id: 2,
                title: 'Hat',
                price: 15
            },
            {
                id: 3,
                title: 'Glass',
                price: 58
            }
        ]
    },
    methods: {
        hide() {
            this.isVisible = !this.isVisible
        }
    }
})