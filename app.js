const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  if (images.length !== 0) {
      images.forEach(image => {
          let div = document.createElement('div');
          div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
          div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
          gallery.appendChild(div)

      })
  }
  else {
      gallery.innerHTML = `
      <h3 class="text-danger mt-5">Can't find your image! Please try again!! Thank You</h3>`;
  }
  toggleSpinner(false);
}

const searchEnter = document.getElementById('search')
.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
      searchBtn.click();
  }
})

searchBtn.addEventListener('click', function() {
  const search = document.getElementById('search').value;
  getImages(search);
})

const getImages = (query) => {
  toggleSpinner(true);
  fetch( `https://pixabay.com/api/?key=15555295-56447c69e11895b05fbeeac3d&q=${query}&image_type=photo`)
  .then(response => response.json())
      .then(data => {
        showImages(data.hits);
        
      })
      .catch(err => console.log(err)) 
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    element.classList.toggle('added');
  }
}
var timer
const createSlider = (sliders) => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;
  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  let time;
  if (duration < 0) {
      time = 1000;
  }
  else {
      time = duration;
  }

  sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100" src="${slide}">`;
      sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function() {
      slideIndex++;
      changeSlide(slideIndex);
  }, time);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
      slideIndex = items.length - 1
      index = slideIndex;
  };

  if (index >= items.length) {
      index = 0;
      slideIndex = 0;
  }

  items.forEach(item => {
      item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function() {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function() {
  createSlider(sliders);
})

const toggleSpinner = (show) => {
  const spinner = document.getElementById('loading-Spinner');
  if (show) {
    spinner.classList.remove('d-none');
  }
  else {
  spinner.classList.add('d-none');
  }
}