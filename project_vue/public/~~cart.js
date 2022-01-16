Vue.component(`cart`, {
    template: `
    <div class="popupBasket">
    <div class="ProductMarkup basketHeader">
        <div>Название товара</div>
        <div>Количество</div>
        <div>Цена за шт.</div>
        <div>Итого</div>
    </div>
    <div class="basketProductList"></div>
    <div class="basketTotal">
        Товаров в корзине на сумму:
        <span class="basketTotalValue">0</span>
    </div>
    <button id='close-btn'>Close</button>
</div>
// <div class="modal">
// <button id='close-btn'>Close</button>
// <div class="cart-list"></div>
// <card v-for="item of list" :good="item" :action-name="`
    Удалить `"></card>
            // </div>
            `,
    props: ['list']
})