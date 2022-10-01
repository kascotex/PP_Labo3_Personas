const tdClass = "</td><td class=";
const SDFut = `${tdClass}"alterego">S/D${tdClass}"ciudad">S/D${tdClass}"publicado">S/D`;
const SDPro = `${tdClass}"enemigo">S/D${tdClass}"robos">S/D${tdClass}"asesinatos">S/D`;

class Persona {
  id;
  nombre;
  apellido;
  edad;

  constructor(id, nombre, apellido, edad) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
  }

  static CrearDesdeJson(arrayJson) {
    let personas = Array();
    let datos = JSON.parse(arrayJson);

    datos.forEach(persona => {
      if (persona["enemigo"] != undefined) personas.push(Villano.CrearDesdeObject(persona));
      else personas.push(Heroe.CrearDesdeObject(persona));
    });
    return personas;
  }

  ToString() {
    return `Id: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, Edad: ${this.edad}`;
  }

  ToStringRow() {
    return `<td class="id">${this.id}${tdClass}"nombre">${this.nombre}${tdClass}"apellido">${this.apellido}${tdClass}"edad">${this.edad}`;
  }
}

class Heroe extends Persona {
  alterego;
  ciudad;
  publicado;

  constructor(id, nombre, apellido, edad, alterego, ciudad, publicado) {
    super(id, nombre, apellido, edad);
    this.alterego = alterego;
    this.ciudad = ciudad;
    this.publicado = publicado;
  }

  static CrearDesdeObject(obj) {
    return new Heroe(obj["id"], obj["nombre"], obj["apellido"], obj["edad"], obj["alterego"], obj["ciudad"], obj["publicado"]);
  }

  ToString() {
    return `${super.ToString()}, alterego: ${this.alterego}, ciudad: ${this.ciudad}, publicado: ${this.publicado}`;
  }

  ToStringRow() {
    return `${super.ToStringRow()}${tdClass}"alterego">${this.alterego}${tdClass}"ciudad">${this.ciudad}${tdClass}"publicado">${this.publicado}${SDPro}`;
  }
}

class Villano extends Persona {
  enemigo;
  robos;
  asesinatos;

  constructor(id, nombre, apellido, edad, enemigo, robos, asesinatos) {
    super(id, nombre, apellido, edad);
    this.enemigo = enemigo;
    this.robos = robos;
    this.asesinatos = asesinatos;
  }

  static CrearDesdeObject(obj) {
    return new Villano(obj["id"], obj["nombre"], obj["apellido"], obj["edad"], obj["enemigo"], obj["robos"], obj["asesinatos"]);
  }

  ToString() {
    return `${super.ToString()}, enemigo: ${this.enemigo}, robos: ${this.robos}, asesinatos: ${this.asesinatos}`;
  }

  ToStringRow() {
    return `${super.ToStringRow()}${SDFut}${tdClass}"enemigo">${this.enemigo}${tdClass}"robos">${this.robos}${tdClass}"asesinatos">${this.asesinatos}</td>`;
  }
}

const personas = Persona.CrearDesdeJson(
  '[{"id":1, "nombre":"Clark", "apellido":"Kent", "edad":45, "alterego":"Superman", "ciudad":"Metropolis","publicado":2002},{"id":2, "nombre":"Bruce", "apellido":"Wayne", "edad":35, "alterego":"Batman", "ciudad":"Gotica","publicado":20012},{"id":3, "nombre":"Bart", "apellido":"Alen", "edad":30, "alterego":"Flash", "ciudad":"Central","publicado":2017},{"id":4, "nombre":"Lex", "apellido":"Luthor", "edad":18, "enemigo":"Superman", "robos":500,"asesinatos":7},{"id":5, "nombre":"Harvey", "apellido":"Dent", "edad":20, "enemigo":"Batman", "robos":750,"asesinatos":2},{"id":666, "nombre":"Celina", "apellido":"kyle", "edad":23, "enemigo":"Batman", "robos":25,"asesinatos":1}]'
);

console.log(personas);

let listaActual;
let personaSelec;
let ultimoId = UltimoId();

const botonAgregar = document.getElementById("botonAgregar");
const botonAlta = document.getElementById("botonAlta");
const botonModificar = document.getElementById("botonModificar");
const botonEliminar = document.getElementById("botonEliminar");
const botonCancelar = document.getElementById("botonCancelar");

const formDatos = document.getElementById("formDatos");
const formAgregar = document.getElementById("formAgregar");
const form = document.forms["formABM"];

const selectorPersonas = document.getElementById("selectorPersonas");
const selectorAgregarTipo = document.getElementById("selectTipo");
const tablaPersonasBody = document.getElementById("tablaPersonasBody");
const tablaPersonasHead = document.getElementById("tablaPersonasHead");
const calcularPromedio = document.getElementById("calcularPromedio");
const ckBoxColumnasTablaPersonas = document.getElementById("ckBoxColumnasTablaPersonas");

selectorPersonas.onchange = MostrarTablaPeronas; // selectorPersonas.addEventListener("change", CargarTablaPeronas);
selectorAgregarTipo.onchange = MostrarFormAgregarTipoSeleccionado;
ckBoxColumnasTablaPersonas.onchange = RefrescarColumnas;
tablaPersonasBody.onclick = SelecPersonaDeLaTabla;
tablaPersonasHead.onclick = SelecColumnaDeLaTabla;
calcularPromedio.onclick = CalcularPromedio;
botonAgregar.onclick = RefrescarFormularios;
botonCancelar.onclick = RefrescarFormularios;
botonAlta.onclick = AltaPersona;
botonModificar.onclick = ModificarPersona;
botonEliminar.onclick = EliminarPersona;

MostrarTablaPeronas();
MostrarFormAgregar(false);

function CargarCamposPersona() {
  form.inputId.value = personaSelec.id;
  form.inputNombre.value = personaSelec.nombre;
  form.inputApellido.value = personaSelec.apellido;
  form.inputEdad.value = personaSelec.edad;

  if (personaSelec instanceof Heroe) {
    selectorAgregarTipo.value = "Heroe";
    form.inputAlterego.value = personaSelec.alterego;
    form.inputCiudad.value = personaSelec.ciudad;
    form.inputPublicado.value = personaSelec.publicado;
  } else {
    selectorAgregarTipo.value = "Villano";
    form.inputEnemigo.value = personaSelec.enemigo;
    form.inputRobos.value = personaSelec.robos;
    form.inputAsesinatos.value = personaSelec.asesinatos;
  }
}

function SelecColumnaDeLaTabla(celda) {
  console.log("head", celda.target.innerText);

  switch (celda.target.innerText) {
    case "Id":
      listaActual.sort((a, b) => {
        return a.id - b.id;
      });
      break;
    case "Nombre":
      listaActual.sort((a, b) => {
        if (a.nombre > b.nombre) {
          return 1;
        } else if (a.nombre < b.nombre) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "Apellido":
      listaActual.sort((a, b) => {
        if (a.apellido > b.apellido) {
          return 1;
        } else if (a.apellido < b.apellido) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "Edad":
      listaActual.sort((a, b) => {
        return a.edad - b.edad;
      });
      break;
    case "Publicado":
      listaActual.sort((a, b) => {
        return a.publicado - b.publicado;
      });
      break;
    case "Robos":
      listaActual.sort((a, b) => {
        return a.robos - b.robos;
      });
      break;
    case "Asesinatos":
      listaActual.sort((a, b) => {
        return a.asesinatos - b.asesinatos;
      });
      break;
    case "Alterego":
      listaActual.sort((a, b) => {
        if (a.alterego > b.alterego) {
          return 1;
        } else if (a.alterego < b.alterego) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "Ciudad":
      listaActual.sort((a, b) => {
        if (a.ciudad > b.ciudad) {
          return 1;
        } else if (a.ciudad < b.ciudad) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "Enemigo":
      listaActual.sort((a, b) => {
        if (a.enemigo > b.enemigo) {
          return 1;
        } else if (a.enemigo < b.enemigo) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
  }
  MostrarTablaPeronas();
}

function SelecPersonaDeLaTabla(celda) {
  personaSelec = PersonaPorId(celda.path[1].cells[0].innerText);
  if (personaSelec) {
    CargarCamposPersona();
    MostrarFormAgregar("Modificar");
  }
}

function PersonaValida(persona) {
  if (persona.id == undefined || persona.nombre == undefined || persona.apellido == undefined || persona.edad == undefined || persona.alterego == undefined || persona.ciudad == undefined || persona.publicado == undefined || persona.enemigo == undefined || persona.robos == undefined || persona.asesinatos == undefined || persona.id < 1 || persona.robos < 0 || persona.asesinatos < 0 || persona.publicado < 1940 || persona.nombre == "" || persona.apellido == "" || persona.alterego == "" || persona.ciudad == "" || persona.enemigo == "") alert("Error en los Datos!");
}

function ModificarPersona() {
  if (PersonaValida(personaSelec)) {
    personaSelec.id = form.inputId.value;
    personaSelec.nombre = form.inputNombre.value;
    personaSelec.apellido = form.inputApellido.value;
    personaSelec.edad = form.inputEdad.value;

    if (personaSelec instanceof Heroe) {
      personaSelec.alterego = form.inputAlterego.value;
      personaSelec.ciudad = form.inputCiudad.value;
      personaSelec.publicado = form.inputPublicado.value;
    } else {
      personaSelec.enemigo = form.inputEnemigo.value;
      personaSelec.robos = form.inputRobos.value;
      personaSelec.asesinatos = form.inputAsesinatos.value;
    }
  }
  MostrarFormAgregar(false);
}

function EliminarPersona() {
  personas.splice(personas.indexOf(personaSelec), 1);
  MostrarFormAgregar(false);
}

function AltaPersona() {
  form.inputId.value = NuevoId();
  let persona = GuardarPersona();

  if (PersonaValida(persona)) {
    personas.push(persona);
  }
  MostrarFormAgregar(false);
}

function GuardarPersona() {
  let persona;
  switch (selectorAgregarTipo.value) {
    case "Heroe":
      persona = new Heroe(form.inputId.value, form.inputNombre.value, form.inputApellido.value, form.inputEdad.value, form.inputAlterego.value, form.inputCiudad.value, form.inputPublicado.value);
      break;
    case "Villano":
      persona = new Villano(form.inputId.value, form.inputNombre.value, form.inputApellido.value, form.inputEdad.value, form.inputEnemigo.value, form.inputRobos.value, form.inputAsesinatos.value);
      break;
  }
  return persona;
}

function MostrarFormAgregarTipoSeleccionado() {
  MostarElementos(document.querySelectorAll(".formAgregarTipo"), false);

  switch (selectorAgregarTipo.value) {
    case "Heroe":
      MostarElement(document.getElementById("formAgregarHeroe"));
      break;
    case "Villano":
      MostarElement(document.getElementById("formAgregarProfecional"));
      break;
  }
}

function MostrarFormAgregar(mostrar) {
  switch (mostrar) {
    case false:
      formAgregar.style.display = "none";
      formDatos.style.display = "";
      MostrarTablaPeronas();
      break;
    case "Modificar":
      formDatos.style.display = "none";
      botonAlta.style.display = "none";
      selectorAgregarTipo.style.display = "none";
      botonModificar.style.display = "";
      botonEliminar.style.display = "";
      formAgregar.style.display = "";
      MostrarFormAgregarTipoSeleccionado();
      break;
    case "Alta":
    case true:
    default:
      formDatos.style.display = "none";
      botonEliminar.style.display = "none";
      botonModificar.style.display = "none";
      botonAlta.style.display = "";
      formAgregar.style.display = "";
      MostrarFormAgregarTipoSeleccionado();
      break;
  }
}

function RefrescarFormularios(boton) {
  let mostrar = boton.target.id;

  if (mostrar == "botonCancelar") MostrarFormAgregar(false);
  else if (mostrar == "botonAgregar") MostrarFormAgregar();
}

function MostarElement(element, mostrar) {
  if (mostrar || mostrar == undefined) element.classList.remove("ocultar");
  else element.className += " ocultar";
}

function MostarElementos(elementos, mostrar) {
  elementos.forEach(element => {
    MostarElement(element, mostrar);
  });
}

function RefrescarColumnas(checkBox) {
  let celdas = document.querySelectorAll(checkBox.target.name);
  MostarElementos(celdas, checkBox.target.checked);
}

function CargarHeroes() {
  listaActual = personas.filter(element => {
    return element instanceof Heroe;
  });
}

function CargarVillanoes() {
  listaActual = personas.filter(element => {
    return element instanceof Villano;
  });
}

function CargarTabla() {
  listaActual.forEach(element => {
    if (element instanceof Persona) tablaPersonasBody.insertRow().innerHTML = element.ToStringRow();
  });
}

function MostrarTablaPeronas() {
  LimpiarTabla();

  switch (selectorPersonas.value) {
    case "Heroe":
      CargarHeroes();
      break;
    case "Villano":
      CargarVillanoes();
      break;
    default:
      listaActual = personas;
      break;
  }
  CargarTabla();
}

function LimpiarTabla() {
  listaActual = Array();

  while (tablaPersonasBody.rows.length > 1) {
    tablaPersonasBody.deleteRow(1);
  }
}

function CalcularPromedio() {
  let edades = listaActual.map(element => {
    return element instanceof Persona ? element.edad : 0;
  });

  let suma = edades.reduce((total, edad) => {
    return total + edad;
  });

  document.getElementById("inputCalcular").value = suma / edades.length;
}

function UltimoId() {
  let ultimoId = 0;
  personas.forEach(element => {
    if (element instanceof Persona && element.id > ultimoId) ultimoId = element.id;
  });
  return ultimoId;
}

function NuevoId() {
  return ++ultimoId;
}

function PersonaPorId(id) {
  let persona = false;
  personas.forEach(element => {
    if (element.id == id) persona = element;
  });
  return persona;
}
