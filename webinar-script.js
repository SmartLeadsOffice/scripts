(function(){
    // ==============================
    // שלב 1: קריאת פרמטרים מתוך ה-src של ה<script>
    // ==============================
    const currentScript = document.currentScript;
    const params = new URL(currentScript.src).searchParams;

    // פרמטרים דינמיים (עם ערכי fallback)
    const dateParam = params.get("webinar_date") || "29/05/2025";      // DD/MM/YYYY
    const timeParam = params.get("webinar_time") || "20:00:00";       // HH:MM או HH:MM:SS
    const repeatEveryXWeeks = parseInt(params.get("repeat_weeks") || "1", 10);

    // אופציונלי: קריאת כל ה-UTM שמתחילים ב־utm_
    const utmData = {};
    for (let [k,v] of params.entries()) {
      if (k.startsWith("utm_")) utmData[k] = v;
    }

    // בניית המחרוזת "DD/MM/YYYY HH:MM:SS"
    let normalizedTime = timeParam.split(":").length === 2
                         ? timeParam + ":00"
                         : timeParam;
    const targetDateStr = `${dateParam} ${normalizedTime}`;


    // ==============================
    // פונקציות עזר ל-countdown
    // ==============================
    var second = 1000;
    var minute = second * 60;
    var hour   = minute * 60;
    var day    = hour * 24;

    function parseDate(dateStr) {
        var [d, t] = dateStr.split(" ");
        var [dd, mm, yyyy] = d.split("/");
        var [HH, MM, SS]   = t.split(":");
        return new Date(yyyy, mm-1, dd, HH, MM, SS);
    }

    function getNextValidDate(date) {
        var now = Date.now();
        while (date.getTime() < now) {
            date.setDate(date.getDate() + (7 * repeatEveryXWeeks));
        }
        return date.getTime();
    }

    function getHebrewDayName(idx) {
      return ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"][idx];
    }


    // ==============================
    // אתחול ה-countdown
    // ==============================
    var targetDate = parseDate(targetDateStr);
    var countDown  = getNextValidDate(targetDate);

    setInterval(function(){
        var now      = Date.now();
        var distance = countDown - now;

        if (distance < 0) {
            // עברנו את היעד, מעדכנים את ה-countDown הבא
            countDown = getNextValidDate(new Date(countDown));
            return;
        }

        var days    = Math.floor(distance / day);
        var hours   = Math.floor((distance % day) / hour);
        var minutes = Math.floor((distance % hour) / minute);
        var seconds = Math.floor((distance % minute) / second);

        // הוספת אפסים
        ["days","hours","minutes","seconds"].forEach(function(cls, i){
          var val = [days, hours, minutes, seconds][i];
          if (val < 10) val = "0" + val;
          document.querySelectorAll("."+cls).forEach(el => el.textContent = val);
        });

        // חישוב תאריך ה-end (היעד הנוכחי)
        var endDate   = new Date(countDown);
        var endTime   = endDate.toLocaleTimeString("he-IL", { hour: '2-digit', minute: '2-digit' });
        var ed        = endDate.getDate();
        var em        = endDate.getMonth() + 1;
        var ey        = endDate.getFullYear().toString().slice(-2);
        if (ed < 10) ed = "0" + ed;
        if (em < 10) em = "0" + em;
        var endDateStr = ed + "/" + em + "/" + ey;
        var endWeekday = getHebrewDayName(endDate.getDay());

        document.querySelectorAll(".time").forEach(el => el.textContent = endTime);
        document.querySelectorAll(".date").forEach(el => el.textContent = endDateStr);
        document.querySelectorAll(".day").forEach(el => el.textContent = endWeekday);

    }, second);

})();
