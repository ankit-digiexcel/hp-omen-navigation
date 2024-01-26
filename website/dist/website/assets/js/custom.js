$(document).ready(function () {
  $(".topScroll").click(function (e) {
    e.preventDefault();
    var dest = $(this).attr("href");
    $("html, body").animate({ scrollTop: ($(dest).offset().top -= 0) }, 1000);
  });
});

// Sticky-Header js //
$(window).scroll(function () {
  if ($(this).scrollTop() > 80) {
    $(".header_fix").addClass("header_sticky");
  } else {
    $(".header_fix").removeClass("header_sticky");
  }
});

new WOW().init();

AOS.init({
  duration: 1200,
});

//play when video is visible
if (!!window.IntersectionObserver) {
  let video = document.querySelector("video");

  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio != 1 && !video.paused) {
          video.pause();
        } else {
          video.play();
        }
      });
    },
    { threshold: 1 }
  );
  observer.observe(video);
} else {
  document.querySelector("#warning").style.display = "block";
}
