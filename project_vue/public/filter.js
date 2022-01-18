Vue.component('filtered', {
    template: `
    <div>
        <input type="text"  v-model="searchLine">
        <button type="button" v-on:click="setFilter">Искать</button>
    </div>
    `,
    props: ['list', 'searchLine'],
    computed: {
        setFilter() {
            filteredGoods = list.RegExp(searchLine, 'i').test;
        }

    }
})