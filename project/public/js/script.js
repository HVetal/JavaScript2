let button = document.getElementById('burger');

let navigation = document.getElementById('menu');

let wrp = document.getElementById('wrp');

button.addEventListener('click', function () {
  navigation.classList.toggle('header__nav--show');
  wrp.classList.toggle('brand__wrp--show');
});

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
    // return this.good.getTitle();
    return this.good.title;
  }

  getPrice() {
    // return this.good.getPrice() * this.count;
    // return this.good.price * this.count;
    return this.good.price;
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

    this.view = new CartView('.popupBasket');
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

  fetchGoods() {
    send(this._onError, this._onSuccess.bind(this), `${API_URL}getBasket.json`)
  }
  // проверка наличия товара в корзине на сайте
  delGoods() {
    return new Promise((resolve, reject) => {
        send(reject, resolve, `${API_URL}deleteFromBasket.json`)
      })
      .then((response) => {
        this._onDelSuccess(response);
        return response;
      })
      .catch((err) => {
        this._onDelError(err);
      })
  }
  //send(this._onDelError, this._onDelSuccess.bind(this), `${API_URL}deleteFromBasket.json`)

  // запрос на наличие товара перед добавлением в корзину
  addGoods() {
    return new Promise((resolve, reject) => {
        send(reject, resolve, `${API_URL}addToBasket.json`)
      })
      .then((response) => {
        this._onAddSuccess(response);
        return response;
      })
      .catch((err) => {
        this._onAddError(err);
      })
  }
  //send(this._onAddError, this._onAddSuccess.bind(this), `${API_URL}addToBasket.json`)

  add(good) {
    const idx = this.list.findIndex((stack) => stack.getGoodId() == good.id)

    if (idx >= 0) {
      this.list[idx].add()
    } else {
      this.list.push(new GoodStack(good))
    }

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
    this.view.render(this.list);
  }
}
// Функция-конструктор витрины
class Showcase {
  constructor(cart) {
    this.list = [];
    this.filtered = [];
    this.cart = cart;
    this.view = new ShowcaseView('.goods-list');


    this.searchInput = document.querySelector('#search');
    this.searchButton = document.querySelector('#search-btn');

    this.searchButton.addEventListener('click', this.filter.bind(this));
  }

  filter() {
    const search = new RegExp(this.searchInput.value, 'i');
    this.filtered = this.list.filter((good) => search.test(good.title));

    this.view.render(this.filtered);
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
        this.filtered = this.list;
        this.view.render(this.filtered);
        return response;
      })
      .catch((err) => {
        this._onError(err);
      })
    // send(this._onError, this._onSuccess.bind(this), `${API_URL}catalogData.json`);
  }

  addToCart(id) {
    const idx = this.list.findIndex((good) => id == good.id)

    if (idx >= 0) {
      this.cart.add(this.list[idx])
    }
  }
}
// Класс отрисовки всей витрины
class ShowcaseView {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
  }
  render(list) {
    this.container.textContent = '';
    const template = list.map((good) => `<div class="goods-item"><h3>${good.getTitle()}</h3><p>${good.getPrice()}</p><button class="addToCart">Add to Cart</button><button class="deleteFromCart">Delete from Cart</button></div>`).join('');

    this.container.innerHTML = template;
  }
}

// Класс отрисовки корзины
class CartView {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.closeBtn = this.container.querySelector('#close-btn');
    this.listContainer = document.querySelector('.basketProductList');
    this.closeBtn.addEventListener('click', this.close.bind(this));
  }

  open() {
    this.container.style.display = 'block';
  }

  close() {
    this.container.style.display = 'none';
  }
  render(list) {
    let sum = 0;
    this.listContainer.textContent = '';
    const template = list.map((good) => `<div class="ProductMarkup"><div>${good.getTitle()}</div><div>${good.getCount()}</div><div>${good.getPrice()}</div><div>${good.getPrice() * good.getCount()} p.</div></div>`).join('');
    const summa = list.map((good) => sum += good.getPrice() * good.getCount());

    this.listContainer.innerHTML = template;
    document.querySelector('.basketTotalValue').textContent = sum;
  }
}

let productInCart;
let sum;
let resultDel;
let resultAdd;
const cart = new Cart();
const showcase = new Showcase(cart);
const cartBtn = document.querySelector('.header__link-basket');
cartBtn.addEventListener('click', cart.open.bind(cart));

// Загрузка витрины с сервера
const promise = showcase.fetchGoods();
promise.then(() => {
    console.log('Витрина загружена с сервера');


    //Загрузка корзины с сервера
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
            // то удаляем товар из корзины
            const promiseDel = cart.delGoods();

            promiseDel.then(() => {
                // ждем ответа от сервера
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
                  document.querySelector('.basketCount').textContent = --productInCart;
                }
              })
              .catch((err) => {
                console.log(err)
              });
          }
        }
        // добавление товара в корзину
      } else if (btn.classList.contains('addToCart')) {
        const btns = document.querySelectorAll('.addToCart');
        const promiseAdd = cart.addGoods();

        promiseAdd.then(() => {
            if (resultAdd === 1) {
              for (let i = 0; i < btns.length; i++) {
                if (btn === btns[i]) {
                  showcase.addToCart(showcase.list[i].getId());
                  delbtns[i].classList.remove("unvisible");
                }
              }
              console.log('Такой товар есть в наличии');
            }
          })
          .catch((err) => {
            console.log(err)
          });
        document.querySelector('.basketCount').textContent = ++productInCart;
      };

    });
  })
  .catch((err) => {
    console.log(err)
  });