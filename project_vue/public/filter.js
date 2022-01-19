Vue.component('filtered', {
    template: `
    <div>
        <input type="text" v-model="searchLine">
        <button type="button" v-on:click="setFilter">Искать</button>
    </div>
    `,
    props: ['list'],
    data() {
        return {
            filteredGoods: [],

        }
    },
    methods: {
        setFilter() {
            const search = new RegExp(searchLine, 'i');
            this.filteredGoods = this.list.filter((good) => search.test(good.title));
            const searchLine = '';
        }

    }
})