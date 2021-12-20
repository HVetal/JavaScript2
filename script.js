// 
function getCounter() {
  let last = 0;

  return () => ++last;
}

const stackIDGenerator = getCounter()

// Функция-конструктор товара
class Good {
  constructor({
    id,
    title,
    price
  }) {
    this.id = id;
    this.title = title;
    this.price = price;
  }

  getId() {
    return this.id;
  }

  getPrice() {
    return this.price;
  }

  getTitle() {
    return this.title;
  }
}

// Функция-конструктор 
class GoodStack {
  constructor(good) {
    this.id = stackIDGenerator();
    this.good = good;
    this.count = 1;
  }

  getGoodId() {
    return this.good.id
  }

  getGood() {
    return this.good;
  }

  getCount() {
    return this.count;
  }

  add() {
    this.count++;
    return this.count;
  }

  remove() {
    this.count--;
    return this.count;
  }
}

//Функция-конструктор корзины
class Cart {
  constructor() {
    this.list = []
  }

  add(good) {
    const idx = this.list.findIndex((stack) => stack.getGoodId() == good.id)

    if (idx >= 0) {
      this.list[idx].add()
    } else {
      this.list.push(new GoodStack(good))
    }
  }

  remove(id) {
    const idx = this.list.findIndex((stack) => stack.getGoodId() == id)

    if (idx >= 0) {
      this.list[idx].remove()

      if (this.list[idx].getCount() <= 0) {
        this.list.splice(idx, 1)
      }
    }
  }
}
// Функция-конструктор витрины
class Showcase {
  constructor(cart) {
    this.list = [];
    this.cart = cart;
  }

  fetchGoods() {
    this.list = [
      new Good({
        id: 1,
        title: 'Футболка',
        price: 140
      }),
      new Good({
        id: 2,
        title: 'Брюки',
        price: 320
      }),
      new Good({
        id: 3,
        title: 'Галстук',
        price: 24
      })
    ]
  }

  addToCart(id) {
    const idx = this.list.findIndex((good) => id == good.id)

    if (idx >= 0) {
      this.cart.add(this.list[idx])
    }
  }
}
// Класс отрисовки всей витрины
class drawShowcaseAll {
  constructor(showcase) {
    this.list = showcase.list;
  }
  drawShowcase() {
    let listHtml = '';
    this.list.forEach(list => {
      const goodItem = new Draw(list.title, list.price);
      listHtml += goodItem.drawShowcaseEl();
    });
    document.querySelector('.goods-list').innerHTML = listHtml;
  }
}

// Класс отрисовки одного товара витрины
class Draw {
  constructor(title, price) {
    this.title = title;
    this.price = price;
  }

  drawShowcaseEl() {
    return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p><button class="addToCart">Add to Cart</button><button class="deleteFromCart">Delete from Cart</button></div>`;
  }
}

// Класс отрисовки корзины
class drawCartAll {
  constructor(cart) {
    this.list = cart.list;
  }
  drawCart() {
    let listHtml = '';
    sum = 0;
    this.list.forEach(list => {
      const goodItem = new DrawCartOne(list.good.getTitle(), list.getCount(), list.good.getPrice());
      sum += list.getCount() * list.good.getPrice();
      listHtml += goodItem.drawCartEl();
    });
    document.querySelector('.basketProductList').innerHTML = listHtml;
  }
}
// Класс отрисовки элемента корзины
class DrawCartOne {
  constructor(title, count, price) {
    this.title = title;
    this.count = count;
    this.price = price;
  }
  drawCartEl() {
    return `<div class="ProductMarkup"><div>${this.title}</div><div>${this.count}</div><div>${this.price}</div><div>${this.price * this.count}</div></div>`;
  }
}

const cart = new Cart();
const showcase = new Showcase(cart);
let sum = 0;
showcase.fetchGoods();
let productInCart = 0;

// renderGoodsList(showcase.list);
// showcase.addToCart(1);
// showcase.addToCart(1);
// showcase.addToCart(2);
// showcase.addToCart(3);
// cart.remove(1);
const draw = new drawShowcaseAll(showcase);
draw.drawShowcase();

const delbtns = document.querySelectorAll('.deleteFromCart');
for (i = 0; i < delbtns.length; i++) {
  delbtns[i].classList.add("unvisible");
}

const buttonDEl = document.querySelector('.goods-list');
buttonDEl.addEventListener('click', event => {
  const btn = event.target;
  //const delbtns = document.querySelectorAll('.deleteFromCart');
  if (btn.tagName !== "BUTTON") {
    return;
  }
  for (i = 0; i < delbtns.length; i++) {
    if (event.target === delbtns[i]) {
      cart.remove(showcase.list[i].getId());
      //document.querySelector('.deleteFromCart').classList.add("visible");
    }
  }
  document.querySelector('.basketCount').textContent = productInCart--;
})

const buttonEl = document.querySelector('.goods-list');
buttonEl.addEventListener('click', event => {
  const btn = event.target;
  const btns = document.querySelectorAll('.addToCart');
  if (btn.tagName !== "BUTTON") {
    return;
  }
  for (i = 0; i < btns.length; i++) {
    if (event.target === btns[i]) {
      showcase.addToCart(showcase.list[i].getId());
      delbtns[i].classList.add("visible");
      //document.querySelector('.deleteFromCart').classList.add("visible");
    }
  }
  document.querySelector('.basketCount').textContent = ++productInCart;
})

//console.log(showcase, cart)

//выбираем div, куда будем выводить содержимое корзины
const basketProductList = document.querySelector('.basketProductList');
// при клике по корзине
document.querySelector('.cartIcon').addEventListener('click', event => {
  //если окно корзины видно на экране
  if (document.querySelector('.popupBasket').style.display === "block") {
    //то убрать его
    document.querySelector('.popupBasket').style.display = "none";
  } else { //иначе, если окно корзины было скрыто
    // очистить, что выводилось в предыдущий раз
    basketProductList.innerHTML = ' ';
    //показать окно корзины
    document.querySelector('.popupBasket').style.display = "block";
    const drawCart = new drawCartAll(cart);
    drawCart.drawCart();
    //вывести общую стоимость покупок
    document.querySelector('.basketTotalValue').textContent = sum;
  }
});