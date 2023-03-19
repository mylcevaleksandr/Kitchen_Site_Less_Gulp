// noinspection DuplicatedCode

"use strict";
const burger = document.getElementsByClassName( "navigation__burger" )[0];
const menu = document.getElementsByClassName( "navigation__list" )[0];
const menuClose = document.getElementsByClassName( "navigation__list_item-close" )[0];
const menuCloseLink = document.getElementsByClassName( "navigation__list_item-link" );
const indicators = document.querySelectorAll( "[data-target='#carouselIndicators']" );
const infoSlides = document.querySelectorAll( ".projects__carousel_info-slide" );

burger.addEventListener( "click", function () {
    menu.classList.add( "navigation__toggle" );
} );
menuClose.addEventListener( "click", () => {
    menu.classList.remove( "navigation__toggle" );
} );

for ( let i = 0; i < menuCloseLink.length; i++ ) {
    menuCloseLink[i].addEventListener( "click", () => {
        menu.classList.remove( "navigation__toggle" );
    } );
}

const changeInfo = ( index ) => {
    infoSlides.forEach( ( el, i ) => {
        el.classList.remove( "active" );
        if ( i == index ) {
            el.classList.add( "active" );
        }
    } );
};

const getIndex = () => {
    let result;
    indicators.forEach( el => {
        if ( el.classList.contains( "active" ) ) {
            result = el.dataset.slideTo;
        }
    } );
    return result;
};

const observer = new MutationObserver( ( mutationsList ) => {
    for ( const mutation of mutationsList ) {
        if ( mutation.type === "attributes" && mutation.attributeName === "class" ) {
            changeInfo( getIndex() );
        }
    }
} );

// настраиваем MutationObserver для отслеживания изменений атрибутов элемента
const config = { attributes: true, childList: false, subtree: false };
indicators.forEach( el => {
    observer.observe( el, config );

} );