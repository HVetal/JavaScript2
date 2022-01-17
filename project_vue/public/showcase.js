Vue.component(`showcase`, {
    template: `
    <div class="goods-list">
    <card v-for="item in list" :good="item" :actionname='"Купить"'></card>
    </div>
    `,
    props: ['list']
})