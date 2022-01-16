Vue.component(`showcase`, {
    template: `
    <div class="goods-list"></div>
    <card v-for="item of list" :good="item" :action-name="`
    Купить `"></card>
    `,
    props: ['list']
})