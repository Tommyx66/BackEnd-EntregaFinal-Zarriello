const ageRegEx = /^(1[8-9]|[2-9][0-9])$/;
const emailRegEx = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const phoneRegEx = /^\+(?:[0-9]-?){6,14}[0-9]$/;
const userRegEx = /^[A-Z][a-z0-9]{3,}$/; //Almenos 5 caracteres sin caracteres especiales con mayuscula inicial y sin espacios.
const passRegEx = /.{8,}/; //Almenos 8 caracteres.

const btnRegistrar = document.querySelector("#btn-registrar");
btnRegistrar.addEventListener("click", validateForm);

function validateRegExpresion(regExpresion, evaluateString) {
    return regExpresion.test(evaluateString);
}
function putFocusOn(element) {
    document.getElementById(element).focus();
}

async function validateForm(event) {
    event.preventDefault();
    const userInput = document.getElementById('user');
    const user = userInput.value;

    if (!validateRegExpresion(userRegEx, user)) {
        putFocusOn('user');
        alert('El Usuario debe contener:\n  1. Almenos 5 caracteres.\n  2. Sin caracteres especiales.\n  3. Mayuscula inicial.\n  4.Sin espacios.');
        return false;
    }

    const pass1Input = document.getElementById('pass');
    const pass1 = pass1Input.value;
    const pass2Input = document.getElementById('passConfirm');
    const pass2 = pass2Input.value;

    if (!validateRegExpresion(passRegEx, pass1)) {
        putFocusOn('pass');
        alert('La contraseña debe tener almenos 8 caracteres !!');
        return false;
    } else {
        if (pass1 != pass2) {
            putFocusOn('passConfirm');
            alert('Las contraseñas no coinciden !!');
            return false;
        }
    }

    const ageInput = document.getElementById('age');
    const mailInput = document.getElementById('mail');
    const phoneNumberInput = document.getElementById('phone-number');
    const age = ageInput.value.trim();
    const email = mailInput.value.trim();
    const phoneNumber = phoneNumberInput.value.trim();

    if (!validateRegExpresion(ageRegEx, age)) {
        putFocusOn('age');
        alert('Solo puede registrarse si es mayor de edad !!');
        return false;
    } else if (!validateRegExpresion(emailRegEx, email)) {
        putFocusOn('mail');
        alert('Correo electrónico inválido !!');
        return false;
    } else if (!validateRegExpresion(phoneRegEx, phoneNumber)) {
        putFocusOn('phone-number');
        alert('Número de teléfono inválido !!');
        return false;
    }

    const register = {
        'user': `${user}`,
        'pass': `${pass2}`,
        'age': `${age}`,
        'mail': `${email}`,
        'phone': `${phoneNumber}`
    };

    await fetch('/register', {
        method: 'POST',
        body: JSON.stringify(register),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if(data.estado == 0){
                alert(data.mensaje);
                // Redireccionar a una página dentro del mismo sitio web, raiz para volver al login.
                window.location.href = "/";
            }
            if(data.estado == 1){
                alert(data.mensaje);
            }
        }
    );
}
