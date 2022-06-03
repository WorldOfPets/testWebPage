//import {reuqestPOSTBOOK, requestCategoriesGet} from '/testWebPage/js/api.js';
//import {Order, Orders} from '/testWebPage/js/classes.js';
//import {bindAnima} from '/testWebPage/js/uiFunc.js';

export var sort = "ASC";
export var categoriesID = null;
export var search = "";

var balance = 0;
export var sumPrice = 0;
export var orders = new Orders();

export function setSumPrice(value){
    sumPrice = parseInt(value);
    $("#sum-price").text(sumPrice);
}
export function removeOrder(value){
    orders.removeOrder(value);
}
export function setCategoriesID(value){
    categoriesID = value;
}

$(document).ready(function(){
    /*CHECK LOCAL STORAGE*/
    checkLocalStorage();
    /*BINDING ANIMATION EVENTS */
    bindAnima();
    /*SEARC EVENTS */
    $("#search-pole").keyup(function(){
        search = $(this).val();
        reuqestPOSTBOOK();
    });
    /*GET BOOKS AND CATEGORIES */
    requestCategoriesGet();
    reuqestPOSTBOOK();
    /*SORT CATEGORIES */
    $("#sort-categories").click(() => {
        if(sort === "ASC"){
            sort = "DESC";
            reuqestPOSTBOOK();
        } else {
            sort = "ASC";
            reuqestPOSTBOOK();
        }
    });
    /*BUTTON BUY */
    $("#btn-buy").click(() => {btnBUY();});
});

/*BUTTON BUY*/
function btnBUY(){
    if(parseInt(sumPrice) <= parseInt(balance)){
        balance -= parseInt(sumPrice);
        sumPrice = 0;
        orders.clearOrders();
        
        $("#balance").text(balance);
        $("#sum-price").text(sumPrice);
        $("#orders-div-drop").empty();

        setLocalStoreage();
    }
    else{
        alert("Недостаточно денег для заказа");
    }
}
/*ANIMATION FUNCTION*/
export function createOrder(titleOrder, price, count = 0){
    var orderOld = orders.checkOrder(titleOrder);
    if(orderOld !== null){
        orderOld.addOrder(orderOld.title, orderOld.price, orderOld.getCount(orderOld.title));
        sumPrice = parseInt(sumPrice) + parseInt(orderOld.price.slice(0, -4));
        $("#sum-price").text(sumPrice);

        setLocalStoreage();
    }
    else{
        sumPrice = parseInt(sumPrice) + parseInt(price.slice(0, -4));
        var order = orders.newOrder(new Order(titleOrder, price, count));
        order.createOrder(order.title, order.price);

        setLocalStoreage();
    }
}
function checkLocalStorage(){
    var cook = document.cookie
        .split(';')
        .map(cookie => cookie.split('='))
        .reduce((accumulator, [key, value]) => ({
            ...accumulator, [key.trim()]:decodeURIComponent(value)
        }),{});
    if(cook.userlocalStorage === "true"){
        getLocalStorage();
        bindCancelOrder();
        //Раскоментируйте чтобы сбросить баланс
        //balance = 10500;
        //setLocalStoreage();
    }
    else{
        //Первая загрузка страницы
        balance = 15500;
        sumPrice = 0;

        $("#balance").text(balance);
        $("#sum-price").text(sumPrice);
        $("#orders-div-drop").empty();

        document.cookie = `userlocalStorage=${true}`;
        location.reload();
    }
}

function bindCancelOrder(){
    $(".cancelorderdiv").click(function(){
        var minus = $(this).prev().find(".order-price").text();
        var titleOrder = $(this).prev().find(".tetle-order-cl").text();
        sumPrice = parseInt(sumPrice) - parseInt(minus);
        orders.removeOrder(titleOrder);
        $("#sum-price").text(sumPrice);
        $(this).parent().remove();

        setLocalStoreage();
    });
}

function getLocalStorage(){
    balance = parseInt(localStorage.getItem('Balance'));
    sumPrice = parseInt(localStorage.getItem('SumPrice'));
    $("#orders-div-drop").html(localStorage.getItem('Orders'));
    
    $("#balance").text(balance);
    $("#sum-price").text(sumPrice);
}
function setLocalStoreage(){
    localStorage.setItem('Orders', $("#orders-div-drop").html());
    localStorage.setItem('Balance', balance);
    localStorage.setItem('SumPrice', sumPrice);
}

export class Order {
    constructor(title, price, count){
        this.title = title;
        this.count = count;
        this.price = price;
    }
    getCount(titleOrder){
        var countTitle = 0;
        $("#orders-div-drop").children().each( function() {
           var oneTitle = $(this).find(".order-content-div").find(".tetle-order-cl").text();
           if(oneTitle === titleOrder){
            countTitle += 1;
           }
        });
        return countTitle;
    }

    addOrder(titleOrder, price, count){
        var count = $(`#orders-div-drop .orderdiv .order-content-div p:contains(${titleOrder})`)
            .next(".order-count")
            .text();
        var lastPrice = $(`#orders-div-drop .orderdiv .order-content-div p:contains(${titleOrder})`)
            .next().next().next().next()
            .text();
        $(`#orders-div-drop .orderdiv .order-content-div p:contains(${titleOrder})`)
            .next(".order-count")
            .text(parseInt(count)+1);
        $(`#orders-div-drop .orderdiv .order-content-div p:contains(${titleOrder})`)
            .next().next().next().next()
            .text(parseInt(lastPrice) + parseInt(price.slice(0, -4)));
        //return parseInt(lastPrice) + parseInt(price.slice(0, -4));
    }

    createOrder(titleOrder, price, count = 1){
        $("#sum-price").text(sumPrice);
        var orderdiv = $("<div></div>")
            .addClass("orderdiv");
        var ordercontent = $("<div></div>")
            .addClass("order-content-div");
        var pTitle = $("<p></p>")
            .addClass("tetle-order-cl")
            .text(titleOrder);
        var br = $("<br/>");
        var spanCount = $("<span></span>")
            .addClass("order-count")
            .text(count);
        var spanpCountSht = $("<span></span>")
            .addClass("order-count")    
            .text(" шт.");
        var spanPrice = $("<span></span>")
            .addClass("order-price")
            .text(price.slice(0, -4));
        var spanpPriceRub = $("<span></span>")
            .text(" руб.");
        var ordercancel = $("<div></div>")
            .addClass("cancelorderdiv");
        var img = $("<img></img>");
        $("#orders-div-drop").append(orderdiv
            .append(ordercontent
                .append(pTitle)
                .append(spanCount)
                .append(spanpCountSht)
                .append(br)
                .append(br)
                .append(spanPrice)
                .append(spanpPriceRub))
            .append(ordercancel
                .append(img)
                .click(function(){
                    var minus = $(this).prev().find(".order-price").text();
                    setSumPrice(parseInt(sumPrice) - parseInt(minus));
                    removeOrder(orders.checkOrder(titleOrder));
                    $("#sum-price").text(sumPrice);
                    $(this).parent().remove();
                }))
        );
    }
}

export class Orders {
    constructor(){
        this.orders = []
    }
    newOrder(order){
        let ord = new Order(order.title, order.price, order.count);
        this.orders.push(ord);
        return ord;
    }
    checkOrder(title){
        var order = null;
        var breakEx = {};
        try{
            this.orders.forEach(element => {
                if(element.title === title){
                    order = element;
                    throw breakEx;
                }
                else{
                    order = null;
                }
            });
        }
        catch (e) {
            if(e !== breakEx) throw e;
        }
        return order;
    }
    removeOrder(title){
        var removeItem = this.orders.indexOf(title);
        this.orders.splice(removeItem, 1)
    }
    clearOrders(){
        this.orders = [];
    }
    getAll(){
        return this.orders;
    }
}

export class Categories{
    constructor(){
        this.arr = [];
    }
    setCategories(id, name){
        var dict = {
            uid : id,
            uname : name
        }
        this.arr.push(dict)
    }
    getCategoriesId(name){
        var id = 0;
        this.arr.forEach(element => {
            if(element.uname === name){
                id = element.uid;
            }
        })
        return id;
    }
}

const requestURL = 'http://45.8.249.57/bookstore-api/books';
const requestCategories = 'http://45.8.249.57/bookstore-api/books/categories';
var categors = new Categories();

export function requestAPI(method, url, data = `{"filters": {}}`){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if(xhr.status >= 400){
                reject(xhr.response);
            } else {
                resolve(xhr.response);
                console.log(xhr.response);
            }
        }
        xhr.onerror = () => {
            reject(xhr.response);
        }
        xhr.send(data);
    });
}

export function reuqestPOSTBOOK(){
    $("#container-card").empty();
    requestAPI("POST", requestURL, dataReturn(search, sort, categoriesID))
        .then(data => data.forEach((element) => {
            createCard(element.name, element.price, element.coverUrl);
        }))
        .then(function () {
            bindCard();
        })
        .catch(err => console.log(err));
    
}

function bindCard(){
    $(".cardbuttonbuy").click(function() {
        var ORtitle = $(this).prev().prev().text();
        var ORprice = $(this).prev().text();
        createOrder(ORtitle, ORprice);
    })
}

export function requestCategoriesGet(){
    requestAPI("GET", requestCategories, null)
    .then(data => data.forEach(element => {
        $("#drop").prepend(`<li>${element.name}</li>`);
        categors.setCategories(element.id, element.name);
    }))
    .then(function() {
        $("#drop li").click(function(){
            setCategoriesID(categors.getCategoriesId($(this).text()))
            reuqestPOSTBOOK();
        });
    })
}