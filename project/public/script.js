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

  getTitle() {
    return this.good.getTitle();
  }

  getPrice() {
    return this.good.getPrice() * this.count;
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
    this.list = [];

    //    setTimeout(() => {
    //this.view = new drawCartAll(this.list);
    //    }, 0);
    this.view = new CartView('.modal');
  }

  open() {
    this.view.render(this.list);
    this.view.open();
  }

  close() {
    this.view.close();
  }

  _onSuccess(response) {
    let data = JSON.parse(response);
    let {
      amount,
      contents,
      countGoods
    } = data;
    productInCart = countGoods;
    document.querySelector('.basketCount').textContent = productInCart;
    sum = amount;
    contents.forEach(product => {
      this.list.push(
        new GoodStack({
          id: product.id_product,
          title: product.product_name,
          price: product.price,
          count: product.quantity
        })
      );
    });
  }

  _onDelSuccess(response) {
    let data = JSON.parse(response);
    const {
      result
    } = data;
    resultDel = result;
  }

  _onAddSuccess(response) {
    let data = JSON.parse(response);
    //console.log(data);
    const {
      result
    } = data;
    resultAdd = result;
  }

  _onDelError(err) {
    console.log(err);
  }

  _onAddError(err) {
    console.log(err);
  }

  _onError(err) {
    console.log(err);
  }
  // загрузка товаров с сайта в корзину
  fetchGoods() {
    send(this._onError, this._onSuccess.bind(this), `${API_URL}getBasket.json`)
  }
  // проверка наличия товара в корзине на сайте
  delGoods() {
    send(this._onDelError, this._onDelSuccess.bind(this), `${API_URL}deleteFromBasket.json`)
  }
  // запрос на наличие товара перед добавлением в корзину
  addGoods() {
    send(this._onAddError, this._onAddSuccess.bind(this), `${API_URL}addToBasket.json`)
  }

  add(good) {
    const idx = this.list.findIndex((stack) => stack.getGoodId() == good.id)

    if (idx >= 0) {
      this.list[idx].add()
    } else {
      this.list.push(new GoodStack(good))
    }
    this.view = new drawCartAll(this.list);
    //this.drawCart(this.list);
    this.view.render(this.list);
  }


  remove(id) {
    const idx = this.list.findIndex((stack) => stack.getGoodId() == id)

    if (idx >= 0) {
      this.list[idx].remove()

      if (this.list[idx].getCount() <= 0) {
        this.list.splice(idx, 1)
      }
    }
    this.view = new drawCartAll(this.list);
    //his.drawCart(this.list);
    this.view.render(this.list);
  }
}
// Функция-конструктор витрины
class Showcase {
  constructor(cart) {
    this.list = [];
    this.filtered = [];
    this.cart = cart;
    //    setTimeout(() => {
    //this.view = new drawShowcaseAll(this.filtered);
    //    }, 0);
    this.view = new ShowcaseView('.goods-list');


    this.searchInput = document.querySelector('#search-input');
    this.searchButton = document.querySelector('#search-btn');

    this.searchButton.addEventListener('click', this.filter.bind(this));
  }

  filter() {
    const search = new RegExp(this.searchInput.value, 'i');
    this.filtered = this.list.filter((good) => search.test(good.title));

    this.view.drawShowcase(this.filtered);
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
    return new Promise((resolve, reject) => {
        send(reject, resolve, `${API_URL}catalogData.json`);
      })
      .then((response) => {
        this._onSuccess(response);
        return response;
      })
      .catch((err) => {
        this._onError(err);
      })
    this.view.render(this.list);
    // send(this._onError, this._onSuccess.bind(this), `${API_URL}catalogData.json`);

    //this.filtered = this.list;
    //   setTimeout(() => {
    //this.view.drawShowcase(this.filtered);
    //    }, 0);

    //this.view.render(this.filtered);
  }

  addToCart(id) {
    const idx = this.list.findIndex((good) => id == good.id)

    if (idx >= 0) {
      this.cart.add(this.list[idx])
    }
  }
}
// Класс отрисовки всей витрины
// class drawShowcaseAll {
//   constructor(showcase) { // showcase
//     this.list = showcase.list; //showcase.list filtered
//   }
//   drawShowcase() {
//     let listHtml = '';
//     this.list.forEach(list => {
//       const goodItem = new Draw(list.title, list.price);
//       listHtml += goodItem.drawShowcaseEl();
//     });
//     document.querySelector('.goods-list').innerHTML = listHtml;
//   }
// }
class ShowcaseView {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
  }
  render(list) {
    this.container.textContent = '';
    const template = list.map((good) =>
      `<div class="card"><h3>${good.getTitle()}</h3><p>${good.getPrice()} $</p></div>`).join('');

    this.container.insertAdjasentHTML('afterbegin', template);
  }
}

// Класс отрисовки одного товара витрины
// class Draw {
//   constructor(title, price) {
//     this.title = title;
//     this.price = price;
//   }

//   drawShowcaseEl() {
//     return `<div class="goods-item"><h3>${this.title}</h3><p>${this.price}</p><button class="addToCart">Add to Cart</button><button class="deleteFromCart">Delete from Cart</button></div>`;
//   }
// }

// Класс отрисовки корзины
// class drawCartAll {
//   constructor(cart) {
//     this.list = cart.list;
//   }
//   drawCart() {
//     let listHtml = '';
//     //sum = 0;
//     this.list.forEach(list => {
//       const goodItem = new DrawCartOne(list.good.title, list.count, list.good.price);
//       //sum += list.good.price; //* list.count;
//       listHtml += goodItem.drawCartEl();
//     });
//     document.querySelector('.basketProductList').innerHTML = listHtml;
//   }
// }

class CartView {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.closeBtn = this.container.querySelector('#close-btn');
    this.listContainer = this.container.querySelector('.cart-list');

    this.closeBtn.addEventListener('click', this.close.bind(this));
  }

  open() {
    this.container.style.display = 'block';
  }

  close() {
    this.container.style.display = 'none';
  }
  render(list) {
    this.listContainer.textContent = '';
    const template = list.map((good) => `
    <div class="card">
    <h3>${good.getTitle()} x${good.getCount()}</h3>
    <p>${good.getPrice()} $</p>
    </div>
    `).join('');

    this.listContainer.insertAdjasentHTML('afterbegin', template);
  }
}
// Класс отрисовки элемента корзины
// class DrawCartOne {
//   constructor(title, count, price) {
//     this.title = title;
//     this.count = count;
//     this.price = price;
//   }
//   drawCartEl() {
//     return `<div class="ProductMarkup"><div>${this.title}</div><div>${this.count}</div><div>${this.price}</div><div>${this.price * this.count}</div></div>`;
//   }
// }
let productInCart;
let sum;
let resultDel;
let resultAdd;
const cart = new Cart();
const showcase = new Showcase(cart);

const cartBtn = document.querySelector('.cartIcon');
cartBtn.addEventListener('click', cart.open.bind(cart));
// Загрузка витрины с сервера
//setTimeout(() => {
const promise = showcase.fetchGoods();

promise.then(() => {
    //}, 1000);
    //setTimeout(() => {
    console.log('Витрина загружена с сервера');

    // renderGoodsList(showcase.list);
    // showcase.addToCart(1);
    // showcase.addToCart(1);
    // showcase.addToCart(2);
    // showcase.addToCart(3);
    // cart.remove(1);
    //    setTimeout(() => {
    //const draw = new drawShowcaseAll(showcase);
    //draw.drawShowcase();
    //console.log(showcase, cart)
    // Загрузка витрины с сервера
    cart.fetchGoods();
    console.log('Корзина загружена с сервера');

    // Установили кнопки удаления товара из корзины у тех товаров, 
    // у которых count > 0
    const delbtns = document.querySelectorAll('.deleteFromCart');
    cart.list.forEach((el, i) => {
      if (el.count > 0) {
        delbtns[i].classList.add("unvisible");
      }
    });

    const buttonEl = document.querySelector('.goods-list');
    buttonEl.addEventListener('click', event => {
      const btn = event.target;

      if (btn.tagName !== "BUTTON") {
        return;
      } else if (btn.classList.contains('deleteFromCart')) {
        for (let i = 0; i < delbtns.length; i++) {
          // если мы нажали именно на эту кнопку удаления товара
          if ((btn === delbtns[i])) {
            // делаем запрос на сервер, если ответ успешный: result === 1, 
            // то удаляем ьовар из корзины
            cart.delGoods();
            // ждем ответа от сервера
            //              setTimeout(() => {
            if (resultDel === 1) {
              // если это последний такой товар, то убираем кнопку
              for (let j = 0; j < cart.list.length; j++) {
                if ((cart.list[j].count === 1) && (cart.list.length === 1)) {
                  delbtns[i].classList.add("unvisible");
                } else if ((cart.list[j].count === 1) && (delbtns[j] === delbtns[i]) && (cart.list.length !== 1)) {
                  delbtns[i].classList.add("unvisible");
                }
              }
              // удаление товара из корзины
              console.log('Такой товар есть в корзине на сервере');
              cart.remove(showcase.list[i].getId());
              sum -= showcase.list[i].getPrice();
              document.querySelector('.basketCount').textContent = --productInCart;
            }
            //              }, 1000);
          }
        }
        // добавление товара в корзину
      } else if (btn.classList.contains('addToCart')) {
        const btns = document.querySelectorAll('.addToCart');
        cart.addGoods();
        //            setTimeout(() => {
        if (resultAdd === 1) {
          for (let i = 0; i < btns.length; i++) {
            if (btn === btns[i]) {
              showcase.addToCart(showcase.list[i].getId());
              sum += showcase.list[i].getPrice();
              delbtns[i].classList.remove("unvisible");
            }
          }
          console.log('Такой товар есть в наличии');
        }
        //          }, 1000);
        document.querySelector('.basketCount').textContent = ++productInCart;
      }
    })

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
        //const drawCart = new drawCartAll(cart);
        //drawCart.drawCart();
        //вывести общую стоимость покупок
        document.querySelector('.basketTotalValue').textContent = sum;
      }
    });

    //console.log(showcase, cart);
    //    }, 0);
  })
  .catch((err) => {
    console.log(err)
  })
//}, 0);