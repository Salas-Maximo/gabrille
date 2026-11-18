var productos = new Array();
var idProductoNuevo = 1;

function crearProducto(id, nombre, descripcion, precio, imagen, seccion) {
  var i = productos.length;
  productos[i] = new Array();
  productos[i]["id"] = id;
  productos[i]["nombre"] = nombre;
  productos[i]["descripcion"] = descripcion;
  productos[i]["precio"] = precio;
  productos[i]["imagen"] = imagen;
  productos[i]["seccion"] = seccion;
}

crearProducto(1, "Chimichurri Ahumado", "Salsa de hierbas frescas, ajo y especias con un distintivo toque ahumado.", 13500, "img/productos/salsa-chimichurri-ahumado.webp", "preferidas");
crearProducto(2, "Miel y Mostaza", "Combinación de mostaza Dijon y miel, con un equilibrio entre dulzor y acidez.", 12000, "img/productos/salsa-miel-mostaza.webp", "preferidas");
crearProducto(3, "Mango y Curry", "Mezcla de mango maduro y curry especiado, con un perfil dulce y aromático.", 12000, "img/productos/salsa-mango-curry.webp", "preferidas");
crearProducto(4, "Habanero", "Salsa de ají habanero con un picor intenso y notas cítricas.", 15000, "img/productos/salsa-habanero.webp", "picantes");
crearProducto(5, "Chipotle", "Salsa de chile chipotle ahumado, con un sabor profundo y ligeramente dulce.", 16000, "img/productos/salsa-chipotle.webp", "picantes");
crearProducto(6, "Fuego Rojo", "Salsa de ají rojo, ajo y especias con un picante persistente y equilibrado.", 14500, "img/productos/salsa-fuego-rojo.webp", "picantes");
crearProducto(7, "Sauceria", "Salsa a base de tomate con un leve sabor aromático a oliva.", 9000, "img/productos/salsa-sauceria.webp", "mas");
crearProducto(8, "Barbacoa", "Salsa de tomate y especias con notas dulces y un característico sabor ahumado.", 9000, "img/productos/salsa-barbacoa.webp", "mas");
crearProducto(9, "Pesto Verde", "Preparación de albahaca fresca, ajo, nueces y aceite de oliva.", 10000, "img/productos/salsa-pesto-verde.webp", "mas");
crearProducto(10, "Criolla", "Mezcla de tomate, cebolla y morrón con un toque de vinagre y especias.", 9000, "img/productos/salsa-criolla.webp", "mas");
crearProducto(11, "Cebolla Caramelizada", "Salsa de cebollas cocidas lentamente, con un sabor dulce y ligeramente tostado.", 8000, "img/productos/salsa-cebolla-caramelizada.webp", "mas");
crearProducto(12, "Alioli", "Salsa cremosa de ajo con un toque de limón y aceite de oliva.", 7000, "img/productos/salsa-alioli.webp", "mas");


function formatearPrecio(valor) {
  var texto = "" + valor;
  var resultado = "";
  var digitos = 0;
  for (var i = texto.length - 1; i >= 0; i--) {
    resultado = texto.charAt(i) + resultado;
    digitos++;
    if (digitos % 3 == 0 && i > 0) {
      resultado = "." + resultado;
    }
  }
  return "$" + resultado;
}

function buscarPosicionProducto(id) {
  for (var i = 0; i < productos.length; i++) {
    if (productos[i]["id"] == id) {
      return i;
    }
  }
  return -1;
}

function escribirImagen(ruta, alternativo) {
  if (ruta != "") {
    document.write('<img src="' + ruta + '" width="800" height="800" alt="' + alternativo + '">');
  }
}

function escribirCardProducto(i) {
  document.write('<article class="card-producto">');
  document.write('<div class="imagen-producto">');
  escribirImagen(productos[i]["imagen"], "Frasco de la salsa " + productos[i]["nombre"]);
  if (productos[i]["id"] == idProductoNuevo) {
    document.write('<span class="etiqueta-nuevo">Nuevo</span>');
  }
  document.write('</div>');
  document.write('<div class="info-producto">');
  document.write('<h4>' + productos[i]["nombre"] + '</h4>');
  document.write('<p>' + productos[i]["descripcion"] + '</p>');
  document.write('<p>' + formatearPrecio(productos[i]["precio"]) + '</p>');
  document.write('<button type="button" class="btn" onclick="agregarAlCarrito(' + productos[i]["id"] + ')">Comprar</button>');
  document.write('</div>');
  document.write('</article>');
}

function escribirFlecha(carrusel, sentido, texto) {
  document.write('<button class="carousel-control-' + sentido + '" type="button" data-bs-target="#' + carrusel + '" data-bs-slide="' + sentido + '">');
  document.write('<span class="carousel-control-' + sentido + '-icon" aria-hidden="true"></span>');
  document.write('<span class="visually-hidden">' + texto + '</span>');
  document.write('</button>');
}

function escribirCarrusel(seccion, titulo) {
  var lista = new Array();
  for (var i = 0; i < productos.length; i++) {
    if (productos[i]["seccion"] == seccion) {
      lista[lista.length] = i;
    }
  }
  var carrusel = "carrusel-" + seccion;
  document.write('<div id="' + carrusel + '" class="carousel slide" aria-label="' + titulo + '">');
  document.write('<div class="carousel-inner">');
  for (var j = 0; j < lista.length; j++) {
    var clase = "carousel-item";
    if (j == 0) {
      clase = clase + " active";
    }
    document.write('<div class="' + clase + '">');
    escribirCardProducto(lista[j]);
    document.write('</div>');
  }
  document.write('</div>');
  escribirFlecha(carrusel, "prev", "Salsa anterior");
  escribirFlecha(carrusel, "next", "Salsa siguiente");
  document.write('<div class="carousel-indicators">');
  for (var k = 0; k < lista.length; k++) {
    var atributos = "";
    if (k == 0) {
      atributos = ' class="active" aria-current="true"';
    }
    document.write('<button type="button" data-bs-target="#' + carrusel + '" data-bs-slide-to="' + k + '"' + atributos + ' aria-label="Salsa ' + (k + 1) + '"></button>');
  }
  document.write('</div>');
  document.write('</div>');
}
