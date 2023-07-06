const main_dish = document.querySelector('.main-dish');
const dish1 = document.querySelector('.dish-1');
const dish2 = document.querySelector('.dish-2');
const dish3 = document.querySelector('.dish-3');
const dish4 = document.querySelector('.dish-4');
const dish5 = document.querySelector('.dish-5');

dish1.addEventListener('click', () => {
    main_dish.src = "/img/dishes/image_3.png";
})
dish2.addEventListener('click', () => {
    main_dish.src = "/img/dishes/main_2.png";
})
dish3.addEventListener('click', () => {
    main_dish.src = "/img/dishes/image_6.png";
})
dish4.addEventListener('click', () => {
    main_dish.src = "/img/dishes/image_5.png";
})
dish5.addEventListener('click', () => {
    main_dish.src = "/img/dishes/dish1.png";
})


// search-bar

// const clearInput = () => {
//   const input = document.getElementsByClassName("search-input")[0];
//   input.value = "";
// }




