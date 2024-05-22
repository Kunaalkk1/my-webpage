$(document).ready(function () {
  // Dark mode toggle
  $('#darkModeToggle').on('click', function () {
    $('body').toggleClass('dark-mode');
    $(this).toggleClass('fa-sun fa-moon');
  });

  // Set default icon based on initial dark mode state
  if ($('body').hasClass('dark-mode')) {
    $('#darkModeToggle').addClass('fa-sun');
  } else {
    $('#darkModeToggle').addClass('fa-moon');
  }

  // Scroll animation
  function animateSection(section, animationName) {
    $(window).on('scroll', function () {
      var sectionTop = $(section).offset().top;
      var sectionBottom = sectionTop + $(section).outerHeight();
      var scrollPos = $(window).scrollTop();
      var windowHeight = $(window).height();

      if (scrollPos + windowHeight > sectionTop && scrollPos < sectionBottom) {
        $(section).addClass('animate__animated ' + animationName);
      } else {
        $(section).removeClass('animate__animated ' + animationName);
      }
    });
  }

  // animateSection('#experience', 'animate__fadeInUp');
  // animateSection('#education', 'animate__fadeInUp');
  // animateSection('#skills', 'animate__fadeInUp');
  // animateSection('#extracurriculars', 'animate__fadeInUp');
  // animateSection('#references', 'animate__fadeInUp');
  // animateSection('#projects', 'animate__fadeInUp');
});

$('#sidebarToggle').on('click', function () {
  $('#sidebar').toggleClass('active');
});

const words = ["ENGINEER", "DEVELOPER", "TECH WIZARD"];
let currentWordIndex = 0;
let currentText = "";
let isDeleting = false;
const typingTextElement = document.getElementById("typing-text");
const typingSpeed = 200; // Speed of typing
const deletingSpeed = 100; // Speed of deleting
const delayBetweenWords = 1000; // Delay between words
let lastTimestamp = 0;
let delay = typingSpeed;

function type(timestamp) {
    if (timestamp - lastTimestamp >= delay) {
        const currentWord = words[currentWordIndex];

        if (isDeleting) {
            currentText = currentWord.substring(0, currentText.length - 1);
        } else {
            currentText = currentWord.substring(0, currentText.length + 1);
        }

        typingTextElement.textContent = currentText;

        if (isDeleting) {
            delay = deletingSpeed;
        } else {
            delay = typingSpeed;
        }

        if (!isDeleting && currentText === currentWord) {
            delay = delayBetweenWords;
            isDeleting = true;
        } else if (isDeleting && currentText === "") {
            isDeleting = false;
            currentWordIndex = (currentWordIndex + 1) % words.length;
            delay = typingSpeed;
        }

        lastTimestamp = timestamp;
    }

    requestAnimationFrame(type);
}

document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(type);
});

