Vue.component('filtered', {
    template: `
    <div>
        <input type="text" v-model="searchline">
        <button type="button" v-on:click="setFilter(list, searchline)">Искать</button>
    </div>
    `,
    props: ['list', 'searchline'],
    data() {
        return {
            filteredGoods: [],

        }
    },
    methods: {
        setFilter(list, searchline) {
            const search = new RegExp(searchline, 'i');
            filteredGoods = list.filter((good) => search.test(good.title));
            searchline = '';
        }

    }
})