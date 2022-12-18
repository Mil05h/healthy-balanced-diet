const sort = document.getElementById('sort')
const cardCol = document.querySelectorAll('.cardCol')

sort.addEventListener('change', (event) => {
  for (c of cardCol) {
    const blog = blogs.find(b => b._id === c.children[0].id)
    if (event.target.value === "all") {
      c.hidden = false;
    }
    else if (blog.category === event.target.value) {
      c.hidden = false;
    }
    else {
      c.hidden = true;
    }
  }
})


window.addEventListener('load', (event) => {
  if (category !== "all") {
    for (c of cardCol) {
      if (category === c.children[0].children[0].innerText) {
        c.hidden = false;
        sort.value = category;
      }
      else {
        c.hidden = true;
      }
    }
  }
})


const blogCards = document.querySelectorAll('.blogCard')
for (let i = 0; i < blogCards.length; i++) {

  blogCards[i].addEventListener('click', (event) => {
    // localhost:3000
    window.location.href = `http://healthy-balanced-diet.cyclic.app/blog/${blogCards[i].id}`;
  })
}

function animateFrom(elem, direction) {
  direction = direction || 1;
  var x = 0,
    y = direction * 100;
  if (elem.classList.contains("gs_reveal_fromLeft")) {
    x = -100;
    y = 0;
  } else if (elem.classList.contains("gs_reveal_fromRight")) {
    x = 100;
    y = 0;
  }
  elem.style.transform = "translate(" + x + "px, " + y + "px)";
  elem.style.opacity = "0";
  gsap.fromTo(elem, { x: x, y: y, autoAlpha: 0 }, {
    duration: 1.25,
    x: 0,
    y: 0,
    autoAlpha: 1,
    ease: "expo",
    overwrite: "auto"
  });
}

function hide(elem) {
  gsap.set(elem, { autoAlpha: 0 });
}

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".gs_reveal").forEach(function (elem) {
    hide(elem); // assure that the element is hidden when scrolled into view

    ScrollTrigger.create({
      trigger: elem,
      onEnter: function () { animateFrom(elem) },
      onEnterBack: function () { animateFrom(elem, -1) },
      onLeave: function () { hide(elem) } // assure that the element is hidden when scrolled into view
    });
  });
});