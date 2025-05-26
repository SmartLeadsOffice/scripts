<script>
(function(){
    var second = 1000;
    var minute = second * 60;
    var hour   = minute * 60;
    var day    = hour * 24;

    // כמה שבועות לחזור על הוובינאר
    var repeatEveryXWeeks = 1;

    // פונקציה להמרת DD/MM/YYYY HH:MM:SS ל-Date
    function parseDate(dateStr) {
        var [d, t] = dateStr.split(" ");
        var [dd, mm, yyyy] = d.split("/");
        var [HH, MM, SS]     = t.split(":");
        return new Date(yyyy, mm-1, dd, HH, MM, SS);
    }

    // שליפת תאריך ושעה מה-URL (fallback לערך סטטי אם לא נשלחו)
    var params     = new URLSearchParams(window.location.search);
    var dateParam  = params.get("webinar_date");   // פורמט: DD/MM/YYYY
    var timeParam  = params.get("webinar_time");   // פורמט: HH:MM או HH:MM:SS
    var targetDateStr;
    if (dateParam && timeParam) {
      // אם timeParam ב-HH:MM בלבד, נזרוק ":00" לשניות
      var normalizedTime = timeParam.split(":").length === 2
                           ? timeParam + ":00"
                           : timeParam;
      targetDateStr = dateParam + " " + normalizedTime;
    } else {
      // ברירת מחדל (ניתן למחוק או לשנות)
      targetDateStr = "29/05/2025 20:00:00";
    }

    // מוציא תאריך הבא שמתקיים בעתיד, מוסיף X שבועות עד שמגיע לזמן בעתיד
    function getNextValidDate(date) {
        var now = Date.now();
        while (date.getTime() < now) {
            date.setDate(date.getDate() + (7 * repeatEveryXWeeks));
        }
        return date.getTime();
    }

    // המרת היום בשבוע לעברית
    function getHebrewDayName(idx) {
      return ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"][idx];
    }

    // אתחול
    var targetDate = parseDate(targetDateStr);
    var countDown  = getNextValidDate(targetDate);

    // לולאת העדכון
    var x = setInterval(function(){
        var now      = Date.now();
        var distance = countDown - now;

        if (distance < 0) {
            // עברנו את היעד, מעדכנים את ה-countDown
            countDown = getNextValidDate(new Date(countDown));
            return;
        }

        var days    = Math.floor(distance / day);
        var hours   = Math.floor((distance % day) / hour);
        var minutes = Math.floor((distance % hour) / minute);
        var seconds = Math.floor((distance % minute) / second);

        // הוספת אפסים
        [‘days’, ‘hours’, ‘minutes’, ‘seconds’].forEach(function(cls, i){
          var val = [days, hours, minutes, seconds][i];
          if (val < 10) val = "0" + val;
          $("." + cls).text(val);
        });

        // חישוב תאריך הלסיום (היעד הנוכחי)
        var endDate   = new Date(countDown);
        var endTime   = endDate.toLocaleTimeString("he-IL", { hour: '2-digit', minute: '2-digit' });
        var ed        = endDate.getDate();
        var em        = endDate.getMonth() + 1;
        var ey        = endDate.getFullYear().toString().slice(-2);
        if (ed < 10) ed = "0" + ed;
        if (em < 10) em = "0" + em;
        var endDateStr = ed + "/" + em + "/" + ey;
        var endWeekday = getHebrewDayName(endDate.getDay());

        $(".time").text(endTime);
        $(".date").text(endDateStr);
        $(".day").text(endWeekday);

    }, second);

})();
</script>
