function mostrarModal(id) {
  bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).show();
}

function validarFormulario(id) {
  var formulario = document.getElementById(id);
  formulario.classList.add("was-validated");
  return formulario.checkValidity();
}

function limpiarFormulario(id) {
  var formulario = document.getElementById(id);
  formulario.reset();
  formulario.classList.remove("was-validated");
}
