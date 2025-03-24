"use strict";
new WOW({
    animateClass: "animate__animated"
}).init();
/* burger menu */
const burger = document.getElementsByClassName("navigation__burger")[0];
const menu = document.getElementsByClassName("navigation__list")[0];
const menuClose = document.getElementsByClassName("navigation__list_item-close")[0];
const menuCloseLink = document.getElementsByClassName("navigation__list_item-link");

/* carousel */
const indicators = document.querySelectorAll("[data-target='#carouselIndicators']");
const infoSlides = document.querySelectorAll(".projects__carousel_info-slide");

/* popup form */
const mainBtn = document.getElementsByClassName("main__btn")[0];
const PopupWrapper = document.getElementsByClassName("top__popup_wrapper")[0];
const popupName = document.getElementById("namePopup");
const popupPhone = document.getElementById("phonePopup");
const popupForm = document.getElementsByClassName("top__popup_main_form")[0];
const popupSuccess = document.getElementsByClassName("top__popup_main_success")[0];
const popupErrorMsg = document.getElementsByClassName("error_message-popup");
const popupBtn = document.getElementById("btnPopup");

/* form */
const form = document.getElementById("order-form");
const formName = document.getElementById("name");
const formPhone = document.getElementById("phone");
const formDate = document.getElementById("date");
const errorMsg = document.getElementsByClassName("error_message");
const formSuccess = document.getElementsByClassName("order__success")[0];
const formBtn = document.getElementById("btnForm");

/* loader */
const loader = document.getElementsByClassName("loader")[0];

/* set current year in footer rights via JS */
const setYear = new Date().getFullYear();
const yearSpan = document.querySelector(".footer-year");
yearSpan.textContent = setYear.toString();

/* scroll into view native */
const anchorLinks = document.getElementsByClassName("navigation__list_item-link");

for (let item of anchorLinks) {
    item.addEventListener("click", (e) => {
        let hashValue = item.getAttribute("href");
        let target = document.querySelector(hashValue);
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        history.pushState(null, null, hashValue);
        e.preventDefault();
    });
}

/* логика бургера */
burger.addEventListener("click", function () {
    menu.classList.add("navigation__toggle");
});
menuClose.addEventListener("click", () => {
    menu.classList.remove("navigation__toggle");
});

for (let i = 0; i < menuCloseLink.length; i++) {
    menuCloseLink[i].addEventListener("click", () => {
        menu.classList.remove("navigation__toggle");
    });
}

/* вызываем попап */
mainBtn.addEventListener("click", () => {
    PopupWrapper.style.display = "flex";
});

/* валидация формы в попапе */
popupBtn.addEventListener("click", () => {
    for (let item of popupErrorMsg) {
        item.style.display = "none";
    }
    popupName.style.borderColor = "green";
    popupPhone.style.borderColor = "green";

    if (!popupName.value) {
        popupName.style.borderColor = "red";
        popupName.nextElementSibling.style.display = "flex";
    }
    if (!popupPhone.value) {
        popupPhone.style.borderColor = "red";
        popupPhone.nextElementSibling.style.display = "flex";
    } else {
        loader.style.display = "flex";
        const request = $.ajax({
            url: "https://api.wheretheiss.at/v1/satellites",
            method: "GET"
        });
        request.done(function (msg) {
            if (msg.success === 1) {
                alert("Возникла ошибка при оформлении заказа");
                loader.style.display = "none";
                location.reload();
            } else {
                console.log(msg);
                popupForm.style.display = "none";
                popupSuccess.style.display = "flex";
                loader.style.display = "none";
                setTimeout(function () {
                    location.reload();
                }, 5000);
            }
        });
        request.fail((jqXHR, textStatus) => {
            console.log(jqXHR, textStatus);
            alert("AJAX request failed: " + textStatus);
            loader.style.display = "none";
            location.reload();
        });
    }
});

/*валидация формы основной */
formBtn.addEventListener("click", () => {
    for (let item of errorMsg) {
        item.style.display = "none";
    }
    formName.style.borderColor = "green";
    formPhone.style.borderColor = "green";
    formDate.style.borderColor = "green";

    if (!formName.value) {
        formName.style.borderColor = "red";
        formName.nextElementSibling.style.display = "flex";
    }
    if (!formPhone.value) {
        formPhone.style.borderColor = "red";
        formPhone.nextElementSibling.style.display = "flex";
    }
    if (!formDate.value) {
        formDate.style.borderColor = "red";
        formDate.nextElementSibling.style.display = "flex";
    } else {
        loader.style.display = "flex";
        $.ajax({
            method: "GET",
            url: "https://api.wheretheiss.at/v1/satellites/25544",
            data: {name: formName.value}
        })
            .done((msg) => {
                if (msg.success === 1) {
                    alert("Возникла ошибка при оформлении заказа");
                    loader.style.display = "none";
                    location.reload();

                } else {
                    console.log(msg);
                    form.style.display = "none";
                    formSuccess.style.display = "flex";
                    loader.style.display = "none";
                    setTimeout(function () {
                        location.reload();
                    }, 5000);
                }
            })
            .fail((jqXHR, textStatus) => {
                alert("AJAX request failed: " + textStatus);
                loader.style.display = "none";
                location.reload();
            });
    }
});

/* находим активный индикатор в карусели и получаем его индекс */
const getIndex = () => {
    let result;
    indicators.forEach(el => {
        if (el.classList.contains("active")) {
            result = el.dataset.slideTo;
        }
    });
    return result;
};
/* сюда передаем индекс полученный в функции getIndex */
const changeInfo = (index) => {
    infoSlides.forEach((el, i) => {
        el.classList.remove("active");
        if (i === index) {
            el.classList.add("active");
        }
    });
};

/* создаем новый клон обзервера */
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
            changeInfo(getIndex());
        }
    }
});

/* настраиваем MutationObserver для отслеживания изменений атрибутов элемента */
const config = {attributes: true, childList: false, subtree: false};
indicators.forEach(el => {
    observer.observe(el, config);

});