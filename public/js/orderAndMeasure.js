orderDetails.addEventListener('change', (event) => {
    if (event.target.value.length < 50 || event.target.value.length > 500) {
        event.target.classList.add('is-invalid')
        event.target.classList.remove('is-valid')
    } else {
        event.target.classList.remove('is-invalid')
        event.target.classList.add('is-valid')
    }
})

foodAllergies.addEventListener('change', (event) => {
    if (!event.target.value.length) {
        event.target.classList.add('is-invalid')
        event.target.classList.remove('is-valid')
    } else {
        event.target.classList.remove('is-invalid')
        event.target.classList.add('is-valid')
    }
})

excerciseLevel.addEventListener('change', (event) => {
    if (event.target.value === '/') {
        event.target.classList.add('is-invalid')
        event.target.classList.remove('is-valid')
    } else {
        event.target.classList.remove('is-invalid')
        event.target.classList.add('is-valid')
    }
})

check.addEventListener('change', (event) => {
    if (!event.target.checked) {
        event.target.classList.add('is-invalid')
        event.target.classList.remove('is-valid')
    } else {
        event.target.classList.remove('is-invalid')
        event.target.classList.add('is-valid')
    }
})

const image = document.querySelector('#image')
const addMeasureBtn = document.querySelector('#addMeasureBtn')

// image.addEventListener('change', (event) => {
//     if (event.target.files.length > 3) {
//         event.target.classList.add('is-invalid')
//         event.target.classList.remove('is-valid')
//     } else {
//         event.target.classList.remove('is-invalid')
//         event.target.classList.add('is-valid')
//     }
// })

addMeasureBtn.addEventListener('click', (event) => {
    if (image.classList.contains('is-invalid')) {
        event.preventDefault()
        event.stopPropagation()
    }
})

const editImg = document.querySelectorAll('#editImg')
const editMeasureBtn = document.querySelectorAll('#editMeasureBtn')
const uploaded = document.querySelectorAll('.uploaded')

for (let i = 0; i<editImg.length; i++) {
    editImg[i].addEventListener('change', (event) => {
        if (event.target.files.length > 3) {
            event.target.classList.add('is-invalid')
            event.target.classList.remove('is-valid')
        }
        else if (event.target.files.length > 2 && uploaded[i].children.length > 1) {
            event.target.classList.add('is-invalid')
            event.target.classList.remove('is-valid')
        }
        else if (event.target.files.length > 1 && uploaded[i].children.length > 2) {
            event.target.classList.add('is-invalid')
            event.target.classList.remove('is-valid')
        }
        else if (event.target.files.length > 0 && uploaded[i].children.length > 3) {
            event.target.classList.add('is-invalid')
            event.target.classList.remove('is-valid')
        }
        else {
            event.target.classList.remove('is-invalid')
            event.target.classList.add('is-valid')
        }
    })
}

for (let i = 0; i < editMeasureBtn.length; i++) {
    editMeasureBtn[i].addEventListener('click', (event) => {
        if (editImg[i].classList.contains('is-invalid')) {
            event.preventDefault()
            event.stopPropagation()
        }
    })
}