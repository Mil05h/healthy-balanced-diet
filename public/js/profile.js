const wChartBtn = document.getElementById('wChartBtn');
const fChartBtn = document.getElementById('fChartBtn');
const fCatBtn = document.getElementById('fCatBtn')
const wChart = document.getElementById("wChart");
const fChart = document.getElementById("fChart");
const fatCat = document.getElementById("fatCat");
const galleryBtn = document.querySelector('#galleryBtn')
const gallery = document.querySelector('#gallery')


wChartBtn.addEventListener("click", (event) => {
    gallery.classList.add("hide");
    wChart.classList.remove("hide");
    fChart.classList.add("hide");
    fatCat.classList.add("hide");
    galleryBtn.nextElementSibling.classList.replace("chartBtn", "chartBtnDisabled");
    fChartBtn.nextElementSibling.classList.replace("chartBtn", "chartBtnDisabled");
    event.target.nextElementSibling.classList.replace("chartBtnDisabled", "chartBtn");
})
fChartBtn.addEventListener("click", (event) => {
    gallery.classList.add("hide");
    wChart.classList.add("hide");
    fChart.classList.remove("hide");
    fatCat.classList.add("hide");
    galleryBtn.nextElementSibling.classList.replace("chartBtn", "chartBtnDisabled");
    wChartBtn.nextElementSibling.classList.replace("chartBtn", "chartBtnDisabled");
    event.target.nextElementSibling.classList.replace("chartBtnDisabled", "chartBtn");
})
galleryBtn.addEventListener("click", (event) => {
    gallery.classList.remove("hide");
    wChart.classList.add("hide");
    fChart.classList.add("hide");
    fatCat.classList.add("hide");
    wChartBtn.nextElementSibling.classList.replace("chartBtn", "chartBtnDisabled");
    fChartBtn.nextElementSibling.classList.replace("chartBtn", "chartBtnDisabled");
    event.target.nextElementSibling.classList.replace("chartBtnDisabled", "chartBtn");
})


function downloadPdf(dataurl) {
    const url = dataurl.slice(0, 50) + 'fl_attachment/' + dataurl.slice(50)
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file.pdf';
    link.click()
}

const editMsrDietSts = document.querySelectorAll('.editMsrDietSts')

for (let i = 0; i < editMsrDietSts.length; i++) {
    if (user.measures[i].dietStatus === 'Not using') {
        editMsrDietSts[i].options[1].selected = true
    }
    else if (user.measures[i].dietStatus === 'Using') {
        editMsrDietSts[i].options[3].selected = true
    }
    else {
        editMsrDietSts[i].options[2].selected = true
    }
}

const dietStatus = document.querySelectorAll('.dietStatus');

for (let i = 0; i < dietStatus.length; i++) {
    if (dietStatus[i].id === "Partialy using") {
        dietStatus[i].style.color = "#ffac00"
    }
    else if (dietStatus[i].id === "Not using") {
        dietStatus[i].style.color = "#ff6666"
    }
}

// const editPswd = document.getElementById('editPswd')
const deleteUser = document.getElementById('deleteUser')
const settingsBtn = document.getElementById('settingsBtn')




settingsBtn.addEventListener('click', (event) => {
    // editPswd.hidden = !editPswd.hidden;
    deleteUser.hidden = !deleteUser.hidden;
})


// const cardMeasures = document.querySelectorAll('.cardMeasures')

// let j = 3
// let k = 0
// for (const card of cardMeasures) {
//     if (card.id >= j){
//         card.hidden = true;
//     }
// }

// const nextBtn = document.getElementById('nextBtn')

// nextBtn.addEventListener('click', (event) => {
//     j + 3
//     k + 3
// })