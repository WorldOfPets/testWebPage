import {orders, setSumPrice, sumPrice, removeOrder} from '/testWebPage/js/main.js';
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