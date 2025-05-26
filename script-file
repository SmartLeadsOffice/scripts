// ==============================
// 1. Accessibility Widget
// ==============================
(function(d){
  var s = d.createElement("script");
  s.setAttribute("data-color", "#111111");
  s.setAttribute("data-position", 5);
  s.setAttribute("data-size", "small");
  s.setAttribute("data-account", "PoJJ4CiM9z");
  s.setAttribute("src", "https://cdn.userway.org/widget.js");
  (d.body || d.head).appendChild(s);
})(document);


// ==============================
// 2. Phone Validation
// ==============================
(function(){
  const phoneInputs = document.querySelectorAll('input[name="Phone"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function (event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      if (value.length > 13) value = value.slice(0, 13);
      event.target.value = value;
    });
  });
})();


// ==============================
// 3. UTM → SessionStorage + Form Injection
// ==============================
(function(){
  document.addEventListener("DOMContentLoaded", function () {
    // שלב 1: שמירה חד־פעמית של פרמטרי UTM ל-sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
      if (key.startsWith("utm_") && !sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, value);
      }
    });

    // פונקציה למילוי והזרקת שדות ל־form מסוים
    function processForm(form) {
      // הזרקת UTM מוסתרים אם עדיין לא קיימים
      Object.keys(sessionStorage)
        .filter(k => k.startsWith("utm_"))
        .forEach(key => {
          if (!form.querySelector(`input[name="${key}"]`)) {
            const hidden = document.createElement("input");
            hidden.type  = "hidden";
            hidden.name  = key;
            hidden.value = sessionStorage.getItem(key);
            form.appendChild(hidden);
          }
        });

      // מילוי שדות קיימים מכל sessionStorage
      form.querySelectorAll("input, textarea, select").forEach(input => {
        const stored = sessionStorage.getItem(input.name);
        if (input.name && stored != null) {
          input.value = stored;
          if (input.parentElement.classList.contains("hide-if-filled")) {
            input.parentElement.style.display = "none";
          }
        }
      });

      // שמירה מחדש של כל השדות ב־sessionStorage בעת שליחה
      form.addEventListener("submit", function () {
        new FormData(form).forEach((val, key) => {
          sessionStorage.setItem(key, val);
        });
      });
    }

    // עיבוד כל הטפסים שקיימים בדף
    document.querySelectorAll("form").forEach(processForm);

    // אופציונלי: לטפסים שמתווספים דינמית
    const observer = new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(node => {
        if (node.tagName === "FORM") processForm(node);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();


// ==============================
// 4. Dynamic Month Text
// ==============================
(function(){
  const months = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const month = months[d.getMonth()];
  document.querySelectorAll('.month').forEach(el => {
    el.textContent = month;
  });
})();
