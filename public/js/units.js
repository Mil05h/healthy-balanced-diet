const unit = document.getElementById('unit')
const heightMe = document.getElementById('heightMe')
const heightIm = document.getElementById('heightIm')

unit.addEventListener("change", (event) => {
    if (event.target.value === 'metric') {
        heightMe.classList.remove("hide");
        heightIm.classList.add("hide");

    } else if (event.target.value === 'imperial') {
        heightMe.classList.add("hide");
        heightIm.classList.remove("hide");
    }
    else {
        heightMe.classList.add("hide");
        heightIm.classList.add("hide");
    }
})

const height = document.getElementById('height')
const height1 = document.getElementById('height1')
const height2 = document.getElementById('height2')


height1.addEventListener('change', (event) => {
    if (unit.value === 'imperial') {
        height.value = parseInt("" + event.target.value)
    }
})
height2.addEventListener('change', (event) => {
    if (unit.value === 'imperial') {
        height.value = parseInt("" + height.value + event.target.value)
    }
})

height.addEventListener('change', (event) => {
    if (unit.value === 'metric') {
    height1.value = '1';
    height2.value = '1';
    }
})



