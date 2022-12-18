const chooseCategory = document.getElementById("chooseCategory");
const newCategory = document.getElementById("newCategory");
const chooseC = document.getElementById("chooseC");
const newC = document.getElementById("newC");

chooseC.addEventListener("click", (event) => {
    chooseCategory.classList.remove("hide");
    chooseCategory.setAttribute("name", "category");
    newCategory.classList.add("hide");
    newCategory.setAttribute("name", "n/a");
});
newC.addEventListener("click", (event) => {
    chooseCategory.classList.add("hide");
    chooseCategory.setAttribute("name", "n/a");
    newCategory.classList.remove("hide");
    newCategory.setAttribute("name", "category");
});
