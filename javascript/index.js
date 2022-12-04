function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML =  `${h + ":" + m + ":" + s} <-- for your time-viewing pleasure :)`;
    setTimeout(startTime, 1000);
  }
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i}; 
    return i;
  }


console.log("Cookies: " + navigator.cookieEnabled);
console.log("Language: " + navigator.language);
console.log("Platform: " + navigator.platform);
console.log("User Agent: " + navigator.userAgent);
console.log("Webdriver: " + navigator.webdriver);
