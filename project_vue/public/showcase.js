Vue.component(`showcase`, {
    template: `
    <div class="goods-list">
    <card v-for="item of list" :good="item" :actionname='"Купить"'></card>
    </div>
    `,
    props: ['list']
})