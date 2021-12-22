"use strict"
// 
const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';

function send(onError, onSuccess, url, method = 'GET', data = '', headers = {}, timeout = 60000) {

  let xhr;

  if (window.XMLHttpRequest) {
    // Chrome, Mozilla, Opera, Safari
    xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    // Internet Explorer
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  for ([key, value] of Object.entries(headers)) {
    xhr.setRequestHeader(key, value)
  }

  xhr.timeout = timeout;

  xhr.ontimeout = onError;

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status < 400) {
        onSuccess(xhr.responseText)
      } else if (xhr.status >= 400) {
        onError(xhr.status)
      }
    }
  }

  xhr.open(method, url, true);

  xhr.send(data);
}

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

  _onSuccess(response) {
    console.log(response);
    const data = JSON.parse(response);
    console.log(data);
    data.contents.forEach(product => {
      this.list.push(
        new GoodStack({
          good: product.contents,
        })
      );
    });
  }

  _onError(err) {
    console.log(err);
  }

  fetchGoods() {
    send(this._onError, this._onSuccess, `${API_URL}getBasket.json`)
  }
  // send((err) => console.log(err), (response) => console.log(response), `${API_URL}getBasket.json`);
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

  _onSuccess(response) {
    const data = JSON.parse(response)
    data.forEach(product => {
      this.list.push(
        new Good({
          id: product.id_product,
          title: product.product_name,
          price: product.price
        })
      )
    });
  }

  _onError(err) {
    console.log(err);
  }

  fetchGoods() {
    send(this._onError, this._onSuccess.bind(this), `${API_URL}catalogData.json`);
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
showcase.fetchGoods();
let productInCart = 0;
let sum = 0;
// renderGoodsList(showcase.list);
// showcase.addToCart(1);
// showcase.addToCart(1);
// showcase.addToCart(2);
// showcase.addToCart(3);
// cart.remove(1);
setTimeout(() => {
  const draw = new drawShowcaseAll(showcase);
  draw.drawShowcase();
  //console.log(showcase, cart)



  // Убрали все кнопки удаления товара из корзины
  const delbtns = document.querySelectorAll('.deleteFromCart');
  for (let i = 0; i < delbtns.length; i++) {
    delbtns[i].classList.add("unvisible");
  }

  const buttonEl = document.querySelector('.goods-list');
  buttonEl.addEventListener('click', event => {
    const btn = event.target;
    //const delbtns = document.querySelectorAll('.deleteFromCart');
    if (btn.tagName !== "BUTTON") {
      return;
    } else if (btn.classList.contains('deleteFromCart')) {
      for (let i = 0; i < delbtns.length; i++) {
        // если мы нажали именно на эту кнопку удаления товара
        if ((btn === delbtns[i])) { // && (showcase.list[i].getId())
          // если это последний такой товар, то убираем кнопку
          for (let j = 0; j < cart.list.length; j++) {
            if ((cart.list[j].count === 1) && (cart.list.length === 1)) {
              delbtns[i].classList.add("unvisible");
              //break;
            } else if ((cart.list[j].count === 1) && (delbtns[j] === delbtns[i]) && (cart.list.length !== 1)) {
              delbtns[i].classList.add("unvisible");
            }
          }

          cart.remove(showcase.list[i].getId());
          //document.querySelector('.deleteFromCart').classList.add("visible");
          document.querySelector('.basketCount').textContent = --productInCart;
        }
      }

    } else if (btn.classList.contains('addToCart')) {
      //  const btn = event.target;
      const btns = document.querySelectorAll('.addToCart');
      for (let i = 0; i < btns.length; i++) {
        if (btn === btns[i]) {
          showcase.addToCart(showcase.list[i].getId());
          delbtns[i].classList.remove("unvisible");
          //document.querySelector('.deleteFromCart').classList.add("visible");
        }
      }
      document.querySelector('.basketCount').textContent = ++productInCart;
    }

  })

  // const buttonEl = document.querySelector('.goods-list');
  // buttonEl.addEventListener('click', event => {
  //   const btn = event.target;
  //   const btns = document.querySelectorAll('.addToCart');
  //   if (btn.tagName !== "BUTTON") {
  //     return;
  //   }
  //   for (i = 0; i < btns.length; i++) {
  //     if (event.target === btns[i]) {
  //       showcase.addToCart(showcase.list[i].getId());
  //       delbtns[i].classList.add("visible");
  //document.querySelector('.deleteFromCart').classList.add("visible");
  //     }
  //   }
  //   document.querySelector('.basketCount').textContent = ++productInCart;
  // })

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

  console.log(showcase, cart);
}, 1000)