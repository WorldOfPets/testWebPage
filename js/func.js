export function createCard(title, price, image)
{
    var htmlCard =
    `<div class="carddiv">
        <div class="card-grid-div">
            <img src=${image} class="card-img">
            <div class="cardright">
                <span class="cardtitle">${title}</span>
                <span class="cardprice">${price}<span>руб.</span></span>
                <button class="cardbuttonbuy">В корзину</button>
            </div>
        </div>
    </div>`;
    $("#container-card").append(htmlCard);
}

export function dataReturn(title = "", price = "ASC", category = null){
    var requestData = `{
        "filters":{
            "search": \"${title}\",
            "sortPrice": \"${price}\",
            "categoryId": ${category}
        }
    }`
    return requestData;
}

