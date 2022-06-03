/*REST API FUNCTION WITH USING PROMISE */
import { createCard, dataReturn } from "./func.js";
import { search, sort, categoriesID, setCategoriesID, createOrder } from "/testWebPage/js/main.js";
import { Categories } from "./classes.js";

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