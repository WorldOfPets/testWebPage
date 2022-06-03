import {reuqestPOSTBOOK, requestCategoriesGet} from './api.js';
import {Order, Orders} from './classes.js';
import {bindAnima} from './uiFunc.js';

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
