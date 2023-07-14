const plus = document.querySelector(".plus"),
  minus = document.querySelector(".minus"),
  num = document.querySelector(".num");
  let a;

window.addEventListener("load", () => {
  if (localStorage["num"]) {
    num.innerText = localStorage.getItem("num");
  } else {
    let a = "01";
    num.innerText = a;
  }
});

plus.addEventListener("click", () => {
  a = num.innerText;
  a++;
  a = (a < 10) ? "0" + a : a;
  localStorage.setItem("num", a);
  num.innerText = localStorage.getItem("num");
});

minus.addEventListener("click", () => {
  a = num.innerText;
  if (a > 1) {
    a--;
    a = (a < 10) ? "0" + a : a;
    localStorage.setItem("num", a);
    num.innerText = localStorage.getItem("num");
  }
});