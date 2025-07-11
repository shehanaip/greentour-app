import '@babel/polyfill'
import {login, logout}  from './login'
import {signup} from './signup'
import {updateSettings} from './updateSettings';
import {bookTour} from './stripe';
// import './reviews.js';

//import {displayMap}  from './mapbox'

// dom element
// const mapBox= document.getElementById('map')
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn= document.querySelector('.nav__el--logout');
const userDataForm= document.querySelector('.form-user-data');
const userPasswordForm= document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
// delegation
// if (mapBox) {
//     let locations =JSON.parse(mapBox.dataset.locations);
//     displayMap(locations);
// }


if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        document.querySelector('.btn--green').textContent = 'Logging...';
        // values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    });
}

if (signupForm) {
  // Getting name, email and password from "/signup" form
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
  });
}

if(logOutBtn){
    logOutBtn.addEventListener('click',logout)
}
if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('.btn--green').textContent = 'Saving...';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });


if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

  if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
     console.log('Book button clicked, tour ID:', tourId);
    bookTour(tourId);
  });