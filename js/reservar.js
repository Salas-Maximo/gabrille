var nombresMeses = "Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre".split(",");
var nombresMesesCortos = "ene,feb,mar,abr,may,jun,jul,ago,sep,oct,nov,dic".split(",");
var nombresDias = "Dom,Lun,Mar,Mié,Jue,Vie,Sáb".split(",");
var horarios = "20:00,20:30,21:00,21:30,22:00,22:30,23:00,23:30,00:00,00:30".split(",");
var maximoPersonas = 10;
var mesesAdelante = 2;

var hoy = new Date();
var diaHoy = hoy.getDate();
var mesHoy = hoy.getMonth();
var anioHoy = hoy.getFullYear();

var personas = 2;
var anioVisto = anioHoy;
var mesVisto = mesHoy;
var diaElegido = 0;
var mesElegido = 0;
var anioElegido = 0;
var horaElegida = -1;

function textoPersonas(cantidad) {
  if (cantidad == 1) {
    return "1 persona";
  }
  return cantidad + " personas";
}

function diaDeSemana(anio, mes, dia) {
  return new Date(anio, mes, dia).getDay();
}

function diasDelMes(anio, mes) {
  return new Date(anio, mes + 1, 0).getDate();
}

function esDiaPasado(anio, mes, dia) {
  if (anio != anioHoy) {
    return anio < anioHoy;
  }
  if (mes != mesHoy) {
    return mes < mesHoy;
  }
  return dia < diaHoy;
}

function estadoDia(anio, mes, dia) {
  if (esDiaPasado(anio, mes, dia)) {
    return "pasado";
  }
  if (diaDeSemana(anio, mes, dia) == 1) {
    return "cerrado";
  }
  var valorDia = dia * 5 + mes * 3;
  if (valorDia % 7 == 0) {
    return "lleno";
  }
  if (valorDia % 11 == 0) {
    return "espera";
  }
  return "libre";
}

function estadoHorario(anio, mes, dia, indice) {
  var estado = estadoDia(anio, mes, dia);
  if (estado != "libre") {
    return estado;
  }
  if ((dia + indice) % 6 == 0) {
    return "lleno";
  }
  if ((dia + indice) % 5 == 0) {
    return "espera";
  }
  return "libre";
}

function textoEstado(estado) {
  if (estado == "libre") {
    return "hay lugar";
  }
  if (estado == "lleno") {
    return "lleno";
  }
  return "lista de espera";
}

function textoFecha() {
  var semana = diaDeSemana(anioElegido, mesElegido, diaElegido);
  return nombresDias[semana] + ", " + diaElegido + " de " + nombresMesesCortos[mesElegido] + " - " + horarios[horaElegida] + " hs";
}

function textoPersonasResumen() {
  var texto = textoPersonas(personas);
  if (horaElegida != -1 && estadoHorario(anioElegido, mesElegido, diaElegido, horaElegida) == "espera") {
    texto = texto + " · Lista de espera";
  }
  return texto;
}

function claseSiElegido(elegido) {
  if (elegido) {
    return " elegido";
  }
  return "";
}

function mostrarPersonas() {
  var html = "";
  for (var i = 1; i <= maximoPersonas; i++) {
    html = html + '<button type="button" class="opcion persona' + claseSiElegido(i == personas) + '" onclick="elegirPersonas(' + i + ')" aria-pressed="' + (i == personas) + '" aria-label="' + textoPersonas(i) + '">' + i + '</button>';
  }
  document.getElementById("lista-personas").innerHTML = html;
}

function mostrarCalendario() {
  var diasVaciosInicio = (diaDeSemana(anioVisto, mesVisto, 1) + 6) % 7;
  var html = "";
  for (var i = 0; i < diasVaciosInicio; i++) {
    html = html + '<span></span>';
  }
  for (var dia = 1; dia <= diasDelMes(anioVisto, mesVisto); dia++) {
    var estado = estadoDia(anioVisto, mesVisto, dia);
    var elegido = dia == diaElegido && mesVisto == mesElegido && anioVisto == anioElegido;
    var atributo = "";
    var lleno = "";
    if (estado != "libre" && estado != "espera") {
      atributo = " disabled";
    }
    if (estado == "lleno") {
      lleno = " dia-lleno";
    }
    html = html + '<button type="button" class="opcion dia' + lleno + claseSiElegido(elegido) + '" onclick="elegirDia(' + dia + ')" aria-pressed="' + elegido + '" aria-label="Día ' + dia + ', ' + textoEstado(estado) + '"' + atributo + '>';
    html = html + dia;
    if (estado == "libre" || estado == "lleno" || estado == "espera") {
      html = html + '<span class="punto punto-' + estado + '"></span>';
    }
    html = html + '</button>';
  }
  document.getElementById("calendario-dias").innerHTML = html;
  document.getElementById("calendario-mes").innerHTML = nombresMeses[mesVisto] + " " + anioVisto;
  var distancia = (anioVisto - anioHoy) * 12 + (mesVisto - mesHoy);
  document.getElementById("boton-mes-anterior").disabled = distancia <= 0;
  document.getElementById("boton-mes-siguiente").disabled = distancia >= mesesAdelante;
}

function mostrarHorarios() {
  if (diaElegido == 0) {
    document.getElementById("lista-horarios").innerHTML = '<p class="nota-reserva">Elegí un día para ver los horarios.</p>';
    return;
  }
  var html = '<div class="horarios">';
  for (var i = 0; i < horarios.length; i++) {
    var estado = estadoHorario(anioElegido, mesElegido, diaElegido, i);
    var atributo = "";
    if (estado == "lleno") {
      atributo = " disabled";
    }
    html = html + '<button type="button" class="opcion horario' + claseSiElegido(i == horaElegida) + '" onclick="elegirHorario(' + i + ')" aria-pressed="' + (i == horaElegida) + '" aria-label="' + horarios[i] + ' hs, ' + textoEstado(estado) + '"' + atributo + '>';
    html = html + horarios[i] + ' hs<span class="punto punto-' + estado + '"></span></button>';
  }
  document.getElementById("lista-horarios").innerHTML = html + '</div>';
}

function mostrarResumen() {
  var listo = diaElegido != 0 && horaElegida != -1;
  if (listo) {
    document.getElementById("resumen-fecha").innerHTML = textoFecha();
  } else {
    document.getElementById("resumen-fecha").innerHTML = "Elegí día y horario";
  }
  document.getElementById("resumen-personas").innerHTML = textoPersonasResumen();
  document.getElementById("boton-continuar").disabled = !listo;
}

function elegirPersonas(cantidad) {
  personas = cantidad;
  mostrarPersonas();
  mostrarResumen();
}

function cambiarMes(cambio) {
  mesVisto = mesVisto + cambio;
  if (mesVisto < 0) {
    mesVisto = 11;
    anioVisto = anioVisto - 1;
  }
  if (mesVisto > 11) {
    mesVisto = 0;
    anioVisto = anioVisto + 1;
  }
  mostrarCalendario();
}

function elegirDia(dia) {
  diaElegido = dia;
  mesElegido = mesVisto;
  anioElegido = anioVisto;
  if (horaElegida != -1 && estadoHorario(anioElegido, mesElegido, diaElegido, horaElegida) == "lleno") {
    horaElegida = -1;
  }
  mostrarCalendario();
  mostrarHorarios();
  mostrarResumen();
}

function elegirHorario(indice) {
  horaElegida = indice;
  mostrarHorarios();
  mostrarResumen();
}

function mostrarPaso(paso) {
  document.getElementById("paso-reserva").hidden = paso != "reserva";
  document.getElementById("paso-datos").hidden = paso != "datos";
  window.scrollTo(0, 0);
}

function irAPasoDatos() {
  document.getElementById("datos-fecha").innerHTML = textoFecha();
  document.getElementById("datos-personas").innerHTML = textoPersonasResumen();
  mostrarPaso("datos");
  document.getElementById("reserva-nombre").focus();
}

function confirmarReserva(evento) {
  evento.preventDefault();
  if (!validarFormulario("form-reserva")) {
    return;
  }
  var texto = "Mesa para " + textoPersonas(personas) + " (" + textoFecha() + ") a nombre de " + document.getElementById("reserva-nombre").value + ".";
  if (estadoHorario(anioElegido, mesElegido, diaElegido, horaElegida) == "espera") {
    texto = "Quedaste en lista de espera. " + texto;
  }
  document.getElementById("detalle-reserva").textContent = texto;
  mostrarModal("modal-reserva");
}

function reiniciarReserva() {
  limpiarFormulario("form-reserva");
  personas = 2;
  anioVisto = anioHoy;
  mesVisto = mesHoy;
  diaElegido = 0;
  horaElegida = -1;
  mostrarPersonas();
  mostrarCalendario();
  mostrarHorarios();
  mostrarResumen();
  mostrarPaso("reserva");
}

mostrarPersonas();
mostrarCalendario();
mostrarHorarios();
mostrarResumen();
