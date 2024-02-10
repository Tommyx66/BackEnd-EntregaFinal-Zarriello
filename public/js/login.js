const btnLogin = document.querySelector("#btn-login");
btnLogin.addEventListener("click", loginUser);

let receivedToken = null;
let logedUser = null;
let carrito = [];

async function loginUser(event) {
    event.preventDefault();
    const user = {
        'user': `${document.getElementById('user').value}`,
        'pass': `${document.getElementById('pass').value}`,
    };

    if (user.user == "" || user.pass == "") {
        alert("Debe completar Usuario & Contraseña");
    } else {
        await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    receivedToken = data.token;
                    logedUser = data.user;
                } else {
                    alert(data.mensaje);
                }
            })
            .catch(error => alert("Error de Fetch Login\n\n Intente nuevamente !!"));
    }
    if (receivedToken != null) {
        await fetch('/mainPage', {
            method: 'GET',
            headers: {
                'Authorization': `${receivedToken}` // Incluir el token en el encabezado de autorización
            }
        })
            .then(response => {
                // Manejar la respuesta de la ruta protegida
                if (response.ok) {
                    // La solicitud se completó con éxito
                    return response.json();
                } else {
                    // La solicitud falló, manejar el error
                    throw new Error('Error en la solicitud de la ruta protegida');
                }
            })
            .then(data => {
                // Hacer algo con la respuesta de la ruta protegida
                document.getElementById('mainHTML').innerHTML = data.page;
                document.getElementById('wellcomeUserName').innerHTML = `Bienvenido ${data.user.user}`;
                eventsAfterLogin();
                getFirstLoadData();
            })
            .catch(error => {
                // Manejar el error de la solicitud
                alert("Error de Solicitud...\n\n Refresque el Navegador e Intente nuevamente !!")
            });
    }
}
