
const usernameReg = document.getElementById('usernameReg');
const passwordReg = document.getElementById('passwordReg');
const passwordRpt = document.getElementById('passwordRpt');
const registerBtn = document.getElementById('registerBtn');


usernameReg.addEventListener('change', (event) => { 
  const re = /^[a-zA-Z0-9_.-]*$/;
  if (event.target.value.length < 6 || event.target.value.length > 20  || !re.test(event.target.value)){
    event.target.classList.add('is-invalid')
    event.target.classList.remove('is-valid')
  }else{
    event.target.classList.remove('is-invalid')
    event.target.classList.add('is-valid')
  }
})

registerBtn.addEventListener('click', (event) => {
    if(usernameReg.classList.contains('is-invalid') || passwordReg.classList.contains('is-invalid') || passwordRpt.classList.contains('is-invalid')){
      event.preventDefault()
      event.stopPropagation()
    }
})

passwordReg.addEventListener('change', (event) => {
  if (event.target.value.length < 6 || event.target.value.length > 20 ){
    event.target.classList.add('is-invalid')
    event.target.classList.remove('is-valid')
    if (event.target.value !== passwordRpt.value) {
      passwordRpt.classList.add('is-invalid')
      passwordRpt.classList.remove('is-valid')
  }
  }else{
    event.target.classList.remove('is-invalid')
    event.target.classList.add('is-valid')
    if (event.target.value !== passwordRpt.value) {
      passwordRpt.classList.add('is-invalid')
      passwordRpt.classList.remove('is-valid')
  }
  }
})

passwordRpt.addEventListener('change', (event) => {
  if (event.target.value !== passwordReg.value ){
    event.target.classList.add('is-invalid')
    event.target.classList.remove('is-valid')
  }else{
    event.target.classList.remove('is-invalid')
    event.target.classList.add('is-valid')
  }
})