Vue.component(`showcase`, {
    template: `
    <div class="goods-list">
        <card v-for="item in list" :good="item" :key="item.id" :actionname='"Купить"'></card>
    </div>
    `,
    props: ['list'],
})

