let hamburger=document.querySelector('.hamburger');
hamburger.addEventListener('click',()=>{
    navbar=document.querySelector('.nav-bar');
    navbar.classList.toggle('active');
})