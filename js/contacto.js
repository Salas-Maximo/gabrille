function enviarContacto(evento) {
  evento.preventDefault();
  if (!validarFormulario("form-contacto")) {
    return;
  }
  var nombre = document.getElementById("contacto-nombre").value;
  var email = document.getElementById("contacto-email").value;
  document.getElementById("detalle-contacto").textContent = "Gracias, " + nombre + ". Recibimos tu mensaje y te vamos a responder a " + email + ".";
  mostrarModal("modal-contacto");
}

function reiniciarContacto() {
  limpiarFormulario("form-contacto");
}
