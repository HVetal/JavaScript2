Vue.component(`card`, {
    template: `
    <div class="goods-item">
        <h3>{{ good.title }}</h3>
        <p>{{ good.price }}</p>
        <button class="addToCart">Add to Cart</button>
        <button class="deleteFromCart">Delete from Cart</button>
        <button :data-id="good.id">{{ action-name }}</button>
    </div>
    `,
    props: ['good', 'action-name']
})