Vue.component(`filter`, {
    template: `
    <div>
        <input type="text" id="search-input" v-model="searchLine">
        <button type="button" v-on:click="setFilter">Искать</button>
    </div>
    `,
    props: ['list'],
    // computed: {
    //     setFilter() {
    //         return list.RegExp(searchLine, i).test;
    //     }

    // }
})