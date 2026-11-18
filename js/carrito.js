var carrito = new Array();
var claveCarrito = "carritoGabrille";

function buscarPosicionCarrito(id) {
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i]["id"] == id) {
      return i;
    }
  }
  return -1;
}

function contarProductos() {
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    total = total + carrito[i]["cantidad"];
  }
  return total;
}

function calcularTotal() {
  var total = 0;
  for (var i = 0; i < carrito.length; i++) {
    var posicion = buscarPosicionProducto(carrito[i]["id"]);
    total = total + productos[posicion]["precio"] * carrito[i]["cantidad"];
  }
  return total;
}

function guardarCarrito() {
  var texto = "";
  for (var i = 0; i < carrito.length; i++) {
    texto = texto + carrito[i]["id"] + "-" + carrito[i]["cantidad"] + ";";
  }
  localStorage.setItem(claveCarrito, texto);
}

function cargarCarrito() {
  var texto = localStorage.getItem(claveCarrito);
  if (texto == null || texto == "") {
    return;
  }
  var pares = texto.split(";");
  for (var i = 0; i < pares.length; i++) {
    if (pares[i] != "") {
      var datos = pares[i].split("-");
      var id = +datos[0];
      var cantidad = +datos[1];
      if (buscarPosicionProducto(id) != -1 && cantidad > 0) {
        var posicion = carrito.length;
        carrito[posicion] = new Array();
        carrito[posicion]["id"] = id;
        carrito[posicion]["cantidad"] = cantidad;
      }
    }
  }
}

function textoProductos(cantidad) {
  if (cantidad == 1) {
    return cantidad + " producto";
  }
  return cantidad + " productos";
}

function armarMiniatura(ruta) {
  if (ruta == "") {
    return "";
  }
  return '<img src="' + ruta + '" alt="">';
}

function mostrarCarrito() {
  var html = "";
  for (var i = 0; i < carrito.length; i++) {
    var id = carrito[i]["id"];
    var cantidad = carrito[i]["cantidad"];
    var posicion = buscarPosicionProducto(id);
    var nombre = productos[posicion]["nombre"];
    var subtotal = productos[posicion]["precio"] * cantidad;
    html = html + '<li class="item-carrito">';
    html = html + '<div class="imagen-item">' + armarMiniatura(productos[posicion]["imagen"]) + '</div>';
    html = html + '<div class="info-item">';
    html = html + '<p>' + nombre + '</p>';
    html = html + '<div class="cantidad-item">';
    html = html + '<button type="button" onclick="cambiarCantidad(' + id + ', -1)" aria-label="Quitar una unidad de ' + nombre + '">&minus;</button>';
    html = html + '<span>' + cantidad + '</span>';
    html = html + '<button type="button" onclick="cambiarCantidad(' + id + ', 1)" aria-label="Agregar una unidad de ' + nombre + '">+</button>';
    html = html + '</div>';
    html = html + '</div>';
    html = html + '<div class="lado-item">';
    html = html + '<button type="button" onclick="quitarDelCarrito(' + id + ')" aria-label="Quitar ' + nombre + ' del carrito">';
    html = html + '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';
    html = html + '</button>';
    html = html + '<p>' + formatearPrecio(subtotal) + '</p>';
    html = html + '</div>';
    html = html + '</li>';
  }
  document.getElementById("lista-carrito").innerHTML = html;
  document.getElementById("total-carrito").innerHTML = formatearPrecio(calcularTotal());
  document.getElementById("texto-carrito-vacio").hidden = carrito.length > 0;
  document.getElementById("boton-comprar").disabled = carrito.length == 0;
}

function mostrarAvisoCarrito(id) {
  var posicion = buscarPosicionProducto(id);
  var posicionCarrito = buscarPosicionCarrito(id);
  document.getElementById("aviso-imagen").innerHTML = armarMiniatura(productos[posicion]["imagen"]);
  document.getElementById("aviso-nombre").innerHTML = productos[posicion]["nombre"] + " x" + carrito[posicionCarrito]["cantidad"];
  document.getElementById("aviso-cantidad").innerHTML = "Total (" + textoProductos(contarProductos()) + "):";
  document.getElementById("aviso-total").innerHTML = formatearPrecio(calcularTotal());
  bootstrap.Toast.getOrCreateInstance(document.getElementById("aviso-carrito")).show();
}

function ocultarAvisoCarrito() {
  bootstrap.Toast.getOrCreateInstance(document.getElementById("aviso-carrito")).hide();
}

function agregarAlCarrito(id) {
  var posicion = buscarPosicionCarrito(id);
  if (posicion == -1) {
    posicion = carrito.length;
    carrito[posicion] = new Array();
    carrito[posicion]["id"] = id;
    carrito[posicion]["cantidad"] = 0;
  }
  carrito[posicion]["cantidad"] = carrito[posicion]["cantidad"] + 1;
  guardarCarrito();
  mostrarCarrito();
  mostrarAvisoCarrito(id);
}

function quitarDelCarrito(id) {
  var posicion = buscarPosicionCarrito(id);
  if (posicion != -1) {
    var restantes = new Array();
    for (var i = 0; i < carrito.length; i++) {
      if (i != posicion) {
        restantes[restantes.length] = carrito[i];
      }
    }
    carrito = restantes;
    guardarCarrito();
    mostrarCarrito();
  }
}

function cambiarCantidad(id, cambio) {
  var posicion = buscarPosicionCarrito(id);
  if (posicion == -1) {
    return;
  }
  var cantidadNueva = carrito[posicion]["cantidad"] + cambio;
  if (cantidadNueva <= 0) {
    quitarDelCarrito(id);
  } else {
    carrito[posicion]["cantidad"] = cantidadNueva;
    guardarCarrito();
    mostrarCarrito();
  }
}

function finalizarCompra() {
  if (carrito.length == 0) {
    return;
  }
  var detalle = "Tu pedido de " + textoProductos(contarProductos()) + " por " + formatearPrecio(calcularTotal()) + " quedó registrado.";
  carrito = new Array();
  guardarCarrito();
  mostrarCarrito();
  document.getElementById("detalle-compra").innerHTML = detalle;
  bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("panel-carrito")).hide();
  mostrarModal("modal-compra");
}

cargarCarrito();
mostrarCarrito();
