/*ANIMATION FUNCTION*/
export function bindAnima(){
    $("#drop").hide();
    resizeWindow();
    $(window).resize(() => {
        resizeWindow();
    });
    $("#sort-categories").mouseover(() => {
        animationCategoriesImage(360);
    }).mouseleave(() => {
        animationCategoriesImage(-360)
    });
    $("#categories").click(() => {
        $("#drop").toggle(500);
    });
    $("#drop li").click(() => {
        $("#drop").hide(500);
    });
    $("#headerlost").mouseleave(() => {
        $("#drop").hide(500);
    });
    $("#img-basket").click(() => {
        clickBasket();
    });
}

function hideBasket(rightWidth){
    $(".orders-div").css({
        'right': `${rightWidth}px`,
        'transition-duration': '1s',
        'animation-timing-function': 'ease-in-out'
    });
}

export function animationCategoriesImage(degrees){
    $("#sort-categories img").css({
        'transform': `rotate(${degrees}deg)`,
        'transition-duration': '1s',
        'animation-timing-function': 'ease-in-out'
    });
}

export function resizeWindow(){
    if($(window).width() <= 768){
        $("#sort-categories span").text("Сортировать");
        if($("#chkBasket").is(":checked"))
        {
            $("#chkBasket").prop("checked", false)
            hideBasket("-300");
        }
    } else{
        if($("#chkBasket").is(":checked") == false)
        {
            $("#chkBasket").prop("checked", true)
            hideBasket("0");
        }
        $("#chkBasket").prop("checked", true)
        $("#sort-categories span").text("Сортировать по цене");  
    }
}

export function clickBasket(){
    if($(window).width() <= 768){
        if($("#chkBasket").is(":checked"))
        {
            $("#chkBasket").prop("checked", false)
            hideBasket("-300");
        } else {
            $("#chkBasket").prop("checked", true)
            hideBasket("0");
        }
    }
}