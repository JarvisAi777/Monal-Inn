// Universal form validation function
function validateFormFields(form) {
   const inputs = form.querySelectorAll('input, textarea, select');
   let isValid = true;
   const errorMessage = form.querySelector('.error-message');

   inputs.forEach((input) => {
       // Remove previous error state
       input.classList.remove('error');
       input.setAttribute('aria-invalid', 'false');

       // Validation logic for required fields
       if (input.hasAttribute('required') && !input.value.trim()) {
           isValid = false;
           input.classList.add('error');
           input.setAttribute('aria-invalid', 'true');
           input.addEventListener('input', () => {
               input.classList.remove('error');
               input.setAttribute('aria-invalid', 'false');
           });
       }

       // Validation for date field (can't be in the past)
       if (isValid && input.type === 'date') {
           const selectedDate = new Date(input.value);
           const currentDate = new Date();
           if (selectedDate < currentDate) {
               isValid = false;
               input.classList.add('error');
               input.setAttribute('aria-invalid', 'true');
           }
       }

       // Validation for number fields (check min value)
       if (isValid && input.type === 'number' && input.min && Number(input.value) < Number(input.min)) {
           isValid = false;
           input.classList.add('error');
           input.setAttribute('aria-invalid', 'true');
       }
   });

   // Error message handling
   if (!isValid && errorMessage) {
       errorMessage.textContent = 'Please fill in all required fields correctly.';
       errorMessage.style.display = 'block';
   } else if (errorMessage) {
       errorMessage.style.display = 'none';
   }

   return isValid;
}

// Helper function for debounce
function debounce(func, delay) {
   let timeout;
   return (...args) => {
       clearTimeout(timeout);
       timeout = setTimeout(() => func(...args), delay);
   };
}

// Initialize Swiper sliders
function initSwiper(selector, options) {
   return new Swiper(selector, options);
}

// Add new review slide dynamically
function addReviewSlide(name, rating, review, color, date) {
   const newSlide = document.createElement('div');
   newSlide.classList.add('swiper-slide');
   newSlide.innerHTML = `
       <div class="box">
           <div class="logo" style="background-color: ${color};">${name.charAt(0).toUpperCase()}</div>
           <h3>${name}</h3>
           <p>Rating: ${rating}/5</p>
           <p>${review}</p>
           <p class="review-date">Posted on: ${date}</p>
       </div>
   `;
   return newSlide;
}

// Add Current Date in the Review
(() => {
   const form = document.getElementById('review-form');
   const reviewSliderWrapper = document.querySelector('#review-slider .swiper-wrapper');
   const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];

   if (form && reviewSliderWrapper) {
       form.addEventListener('submit', function (e) {
           e.preventDefault();

           if (!validateFormFields(form)) return;

           const name = document.getElementById('name').value.trim();
           const rating = document.getElementById('rating').value.trim();
           const review = document.getElementById('review').value.trim();

           // Generate the current date
           const currentDate = new Date();
           const dateString = currentDate.toLocaleDateString('en-US', {
               year: 'numeric',
               month: 'long',
               day: 'numeric',
           });

           // Choose a color and create the review slide
           const color = colors.shift() || '#ccc';
           const newSlide = addReviewSlide(name, rating, review, color, dateString);

           // Append the new slide to the swiper wrapper
           reviewSliderWrapper.appendChild(newSlide);

           // Update Swiper instance
           const reviewSlider = document.querySelector('#review-slider').swiper;
           reviewSlider.update();

           // Reset the form
           form.reset();

           // Show a confirmation message
           alert('Thank you for your review!');
       });
   }
})();

// Navbar toggle functionality
(() => {
   const navbar = document.querySelector('.header .navbar');
   const menuBtn = document.querySelector('#menu-btn');

   menuBtn.addEventListener('click', () => {
       navbar.classList.toggle('active');
   });

   window.addEventListener('scroll', () => {
       navbar.classList.remove('active');
   });
})();

// FAQ toggle functionality with accessibility
(() => {
   const faqContainer = document.querySelector('.contact .row .faq');
   if (faqContainer) {
       faqContainer.addEventListener('click', (event) => {
           if (event.target.tagName === 'H3') {
               const faqBox = event.target.parentElement;
               faqBox.classList.toggle('active');
               const isExpanded = faqBox.classList.contains('active');
               faqBox.setAttribute('aria-expanded', isExpanded);
           }
       });

       faqContainer.addEventListener('keydown', (event) => {
           if ((event.key === 'Enter' || event.key === ' ') && event.target.tagName === 'H3') {
               const faqBox = event.target.parentElement;
               faqBox.classList.toggle('active');
               const isExpanded = faqBox.classList.contains('active');
               faqBox.setAttribute('aria-expanded', isExpanded);
           }
       });
   }
})();

// Lazy loading for iframes
document.addEventListener('DOMContentLoaded', () => {
   const iframes = document.querySelectorAll('iframe');
   iframes.forEach((iframe) => {
       iframe.setAttribute('loading', 'lazy');
   });
});

// Stars Rating System
const stars = document.querySelectorAll('.rating .stars i');
const ratingInput = document.getElementById('rating');

stars.forEach((star, index) => {
   star.addEventListener('mouseover', () => {
       stars.forEach((s, i) => {
           if (i <= index) {
               s.classList.add('hovered');
           } else {
               s.classList.remove('hovered');
           }
       });
   });

   star.addEventListener('mouseout', () => {
       stars.forEach((s, i) => {
           if (i < ratingInput.value) {
               s.classList.add('selected');
           } else {
               s.classList.remove('hovered');
               s.classList.remove('selected');
           }
       });
   });

   star.addEventListener('click', () => {
       stars.forEach((s, i) => {
           if (i <= index) {
               s.classList.add('selected');
           } else {
               s.classList.remove('selected');
           }
       });
       ratingInput.value = index + 1;
   });
});

// Initialize Swipers
(() => {
   const swiperOptions = {
       loop: true,
       autoplay: { delay: 3000 },
       speed: 1000,
       pagination: { el: '.swiper-pagination', clickable: true },
   };

   initSwiper('.home-slider', {
       ...swiperOptions,
       effect: 'coverflow',
       slidesPerView: 'auto',
       centeredSlides: true,
       grabCursor: true,
       coverflowEffect: {
           rotate: 50,
           stretch: 0,
           depth: 100,
           modifier: 1,
           slideShadows: true,
       },
   });

   initSwiper('.gallery-slider', {
       ...swiperOptions,
       effect: 'coverflow',
       slidesPerView: 'auto',
       centeredSlides: true,
       grabCursor: true,
       coverflowEffect: {
           rotate: 0,
           stretch: 0,
           depth: 100,
           modifier: 2,
           slideShadows: true,
       },
   });

   initSwiper('.reviews-slider', {
       loop: true,
       slidesPerView: 'auto',
       grabCursor: true,
       spaceBetween: 30,
       pagination: { el: '.swiper-pagination', clickable: true },
   });

   initSwiper('#review-slider', {
       slidesPerView: 1,
       spaceBetween: 10,
       pagination: { el: '.swiper-pagination', clickable: true },
       breakpoints: {
           768: { slidesPerView: 2, spaceBetween: 20 },
           1024: { slidesPerView: 3, spaceBetween: 30 },
       },
   });
})();
