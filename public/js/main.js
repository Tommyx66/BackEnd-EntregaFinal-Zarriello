const socket = io();

let btnLogout;
let btnCarrito;
let btnAdmin;
let btnQuienSoy;
let btnMessage;
let btnExitProduct;
let btnAddProduct;

function eventsAfterLogin() {
  btnLogout = document.querySelector("#btn-logout");
  btnLogout.addEventListener("click", logout);

  btnCarrito = document.querySelector("#btn-carrito");
  btnCarrito.addEventListener("click", verCarrito);

  btnAdmin = document.querySelector("#btn-admin");
  btnAdmin.addEventListener("click", panelAdmin);

  btnQuienSoy = document.querySelector("#btn-info");
  btnQuienSoy.addEventListener("click", info);

  btnMessage = document.querySelector("#btn-newMessage");
  btnMessage.addEventListener("click", addNewMessage);
}

function insertarAntesDe(elementoExistente, nuevoContenido) {
  const existingElement = document.getElementById(elementoExistente); // Obtén la referencia al elemento existente
  existingElement.insertAdjacentHTML('beforebegin', nuevoContenido);  // Inserta el nuevo contenido antes del elemento existente
}


function info() {
  var respuesta = confirm('¿ Va a abandonar la sesion para acceder a este contenido ?');
  if (respuesta) {
    receivedToken = null;
    window.location.replace('/info');
  }
}

function getFirstLoadData() {
  fetch('/api/productos')
    .then(response => response.json())
    .then(data => {
      let html = ""; //document.getElementById('productList').innerHTML;
      data.forEach(element => {
        html = `${html}
        <div class="table-line">
        <p class="nameTb">${element.name}</p>
        <p class="priceTd">$ ${element.price}</p>
        <img src="${element.photo}" alt="${element.name}">
        <button class="btn btn-danger" id="btn-addPrd" data-indice="${element._id}" onclick="addProductToChart('${element._id}')">+</button>
        <button class="btn btn-danger" id="btn-delPrd" data-indice="${element._id}" onclick="removeProductFromChart('${element._id}')">-</button>
        </div>`;
      });
      document.getElementById('productList').innerHTML = `${html}`;
    })
    .catch(error => console.error(error));

  fetch('/api/mensajes')
    .then(response => response.json())
    .then(data => {
      let html = "";
      data.forEach(message => {
        html += `<div class="chatLine" li><p class="user">${message.autor}&nbsp;</p> <p class="time">[ ${message.timestamp} ] :&nbsp;</p> <p class="msg">${message.mensaje}</p></div>`
      });
      document.getElementById('chatContent').innerHTML = `${html}`;
    })
    .catch(error => console.error(error));
}

function logout(event) {
  event.preventDefault();
  btnMessage.removeEventListener("click", addNewMessage);
  btnLogout.removeEventListener("click", logout);
  btnAdmin.removeEventListener("click", panelAdmin);
  btnQuienSoy.removeEventListener("click", info);
  btnCarrito.removeEventListener("click", verCarrito);
  
  btnAdmin=null;
  btnMessage=null;
  btnLogout=null;
  btnQuienSoy=null;
  btnCarrito=null;

  if(btnExitProduct != null){ btnExitProduct.removeEventListener("click", salirPanelAdmin); btnExitProduct = null; };
  if(btnAddProduct != null){ btnAddProduct.removeEventListener("click", addNewProduct); btnAddProduct = null; };

  receivedToken = null;
  logedUser = null;
  window.location.href = '/';
}

// --------- PANEL ADMINISTRADOR --------------------------------------------------------------- //

function eventsAfterAdmin() {
  btnAddProduct = document.querySelector("#btn-newProduct");
  btnAddProduct.addEventListener("click", addNewProduct);

  btnExitProduct = document.querySelector("#btn-newProductExit");
  btnExitProduct.addEventListener("click", salirPanelAdmin);
}

function addNewProduct(){
  alert(`ADD PRODUCT BUTTON PRESSED\n\nTOKEN: ${receivedToken}`)
}

function salirPanelAdmin(event){
  event.preventDefault();
  btnAddProduct.removeEventListener('click', addNewProduct);
  btnExitProduct.removeEventListener('click', salirPanelAdmin);
  btnAddProduct=null;
  btnExitProduct=null;
  const elementoAEliminar = document.getElementById('adminPanel');
  elementoAEliminar.remove();
}

async function panelAdmin() {
  await fetch('/adminPage', {
    method: 'GET',
    headers: {
        'Authorization': `${receivedToken}` // Incluir el token en el encabezado de autorización
    }
  })
    .then(response => {
        // Manejar la respuesta de la ruta protegida
        if (response.ok) {
            // La solicitud se completó con éxito
            const authHeader = response.headers.get('Authentication');
            if (authHeader) {
              receivedToken = authHeader;
            }
            return response.json();
        } else {
            // La solicitud falló, manejar el error
            throw new Error('Error en la solicitud de la ruta protegida');
        }
    })
    .then(data => {
        // Hacer algo con la respuesta de la ruta protegida
        if(data.hasOwnProperty('estado') && data.estado == 1){
          alert("Permisos Insuficinetes...\n\nDebe ser administrador !!");
        } else {
          insertarAntesDe("productlistPanel", data.page);
          eventsAfterAdmin();
        }
    })
    .catch(error => {
        // Manejar el error de la solicitud
        console.log(error);
        alert("Error de Solicitud...\n\n Refresque el Navegador e Intente nuevamente !!");
    });
}
// --------- PANEL ADMINISTRADOR --------------------------------------------------------------- //


// --------- CARRITO ----------------------------------------------------------------- //
function verCarrito(){
  var mensaje = ""
  if(carrito.length !== 0){
    mensaje = "LISTADO DE PRODUCTOS EN CARRITO\n";
    mensaje += " \n";
    carrito.forEach(function(elemento) {
      mensaje += `${JSON.stringify(elemento)}\n`;
      mensaje += " \n";
    });
  } else {
    mensaje = "ESTA VACIO !!";
  }
  Swal.fire({
    title: 'Su Carrito',
    text: `${mensaje.toString()}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar Carrito',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Acción a realizar si el usuario confirma
      saveCarrito();
    } else {
      // Acción a realizar si el usuario cancela
      Swal.fire('Cancelado', 'La acción ha sido cancelada.', 'error');
    }
  });
}

async function saveCarrito(){
  if(carrito.length != 0){

    var newCarrito = {
      productor: carrito,
      user: logedUser.usrid
    };

    await fetch('/api/carrito', {
      method: 'POST',
      headers: { 'Authorization': `${receivedToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(newCarrito)
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
          if(data == -1){
            Swal.fire('Error al Salvar', 'Vuelva a intentar nuevamente.', 'error');
          } else {
            Swal.fire('¡Confirmado!', `Carrito Guardado con éxito !!`, 'danger');
          }
      })
      .catch(error => {
        Swal.fire('Error al Salvar', 'Vuelva a intentar nuevamente.', 'error');
      });
  } else {
    Swal.fire('Carrito Vacio', 'Inserte Productos !!', 'error');
  }
}

function addProductToChart(idProd){
  var indice = carrito.map(function(objeto) { return objeto.idProd; }).indexOf(idProd);
  if (indice === -1) {
    carrito.push({idProd: idProd, cantidad: 1});
  } else {
    carrito[indice].cantidad = carrito[indice].cantidad + 1;
  }
}

function removeProductFromChart(idProd){
  var indice = carrito.map(function(objeto) { return objeto.idProd; }).indexOf(idProd);
  if (indice === -1) {
    alert("Ya no quedan mas unidades de este producto en el carrito.");
  } else {
    if(carrito[indice].cantidad >= 2){
      carrito[indice].cantidad = carrito[indice].cantidad - 1;
    } else {
      carrito.splice(indice, 1);
    }
  }
}
// --------- CARRITO ----------------------------------------------------------------- //


// --------- SOCKET.IO --------------------------------------------------------------- //

// ----------- CHAT
function addNewMessage(event) {
  event.preventDefault();
  const message = {
    autor: document.getElementById('usuario').value,
    mensaje: document.getElementById('mensaje').value
  };
  document.getElementById('usuario').value = '';
  document.getElementById('mensaje').value = '';
  socket.emit('new-message', message);
}

socket.on('messages', data => {
  let html = document.getElementById('chatContent').innerHTML;

  data.forEach(message => {
    html += `<div class="chatLine" li><p class="user">${message.autor}&nbsp;</p> <p class="time">[ ${message.timestamp} ] :&nbsp;</p> <p class="msg">${message.mensaje}</p></div>`
  });

  document.getElementById('chatContent').innerHTML = `${html}`;
});

socket.on('message-added', message => {
  let html = document.getElementById('chatContent').innerHTML;

  html += `<div class="chatLine" li><p class="user">${message.autor} </p> <p class="time"> [ ${message.timestamp} ] : </p> <p class="msg"> ${message.mensaje}</p></div>`;

  document.getElementById('chatContent').innerHTML = `${html}`;
});

// --------- SOCKET.IO --------------------------------------------------------------- //




// ULTIMA MODIFICACION DESDE FM