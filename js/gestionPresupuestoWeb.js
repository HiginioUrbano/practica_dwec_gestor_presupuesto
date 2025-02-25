import { actualizarPresupuesto, anyadirGasto, borrarGasto, calcularBalance, calcularTotalGastos, cargarGastos, CrearGasto, filtrarGastos, agruparGastos, listarGastos, mostrarPresupuesto, transformarListadoEtiquetas } from "./gestionPresupuesto.js";


function mostrarDatoEnId(idElemento, valor){
    
    document.getElementById(idElemento).innerHTML = valor;

}
function mostrarGastoWeb(idElemento, gasto){
    
    let div = document.createElement('div');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    let div4 = document.createElement('div');

    div.className = "gasto";

    div1.className ="gasto-descripcion";
    div1.append(gasto.descripcion);
    
    div2.className ="gasto-fecha";
    div2.append(gasto.fecha);
    
    div3.className ="gasto-valor";
    div3.append(gasto.valor);

    div.append(div1);
    div.append(div2);
    div.append(div3);

    

    for (let etiqueta of gasto.etiquetas)
    {        
        let span = document.createElement('span');
        span.className="gasto-etiquetas-etiqueta";

        let manejadorBorrarEtiqueta = new BorrarEtiquetasHandle();
        manejadorBorrarEtiqueta.gasto = gasto;
        manejadorBorrarEtiqueta.etiqueta = etiqueta;
        span.addEventListener("click", manejadorBorrarEtiqueta);

        span.append(etiqueta);
        div4.append(span);
    }

    div4.className ="gasto-etiquetas";
    
    
    div.append(div4);

    let botEditar = document.createElement('button');
    botEditar.className = "gasto-editar";
    botEditar.type = "button";
    botEditar.textContent = "Editar";

    let manejadorEdit = new EditarHandle();
    manejadorEdit.gasto = gasto;
    botEditar.addEventListener("click", manejadorEdit);
    div.append(botEditar);

    let botBorrar = document.createElement('button');
    botBorrar.className = "gasto-borrar";
    botBorrar.type = "button";
    botBorrar.textContent = "Borrar";

    let manejadorBorrar = new BorrarHandle();
    manejadorBorrar.gasto = gasto;
    botBorrar.addEventListener("click", manejadorBorrar);
    div.append(botBorrar);

    let botBorrarAPI = document.createElement('button');
    botBorrarAPI.className = "gasto-borrar-api";
    botBorrarAPI.type = "button";
    botBorrarAPI.textContent = "Borrar (API)";

    let manBorrarAPI = new BorrarAPI();
    manBorrarAPI.gasto = gasto;
    botBorrarAPI.addEventListener("click", manBorrarAPI);
    div.append(botBorrarAPI);

    let botEditForm = document.createElement('button');
    botEditForm.className = "gasto-editar-formulario";
    botEditForm.type = "button";
    botEditForm.textContent = "Editar (formulario)";

    let manEditForm = new EditarHandleFormulario();
    manEditForm.gasto = gasto;
    botEditForm.addEventListener("click", manEditForm);
    div.append(botEditForm);

    let raiz = document.getElementById(idElemento);

    raiz.append(div); 
}
function mostrarGastoAgrupadosWeb(idElemento, agrup, periodo){

    let raiz = document.getElementById(idElemento);
    raiz.innerHTML = "";
        
    let div = document.createElement('div');
    div.className = "agrupacion";

    let h1 = document.createElement('h1');
    h1.append(`Gastos agrupados por ${periodo}`)
    div.append(h1);


    for (let [key, value] of Object.entries(agrup))
    {
        let div1 = document.createElement('div');
        div1.className = "agrupacion-dato";

        let span1 = document.createElement('span');
        span1.className = "agrupacion-dato-clave";
        span1.append(key);
    
        let span2 = document.createElement('span');
        span2.className = "agrupacion-dato-valor";
        span2.append(value);
    
        div1.append(span1);
        div1.append(span2);
        div.append(div1);
        raiz.append(div);
    }
    

    raiz.style.width = "33%";
    raiz.style.display = "inline-block";

    let chart = document.createElement("canvas");

    let unit = "";
    switch (periodo) {
        case "anyo":
        unit = "year";
        break;
        case "mes":
        unit = "month";
        break;
        case "dia":
        default:
        unit = "day";
        break;
    }

    const myChart = new Chart(chart.getContext("2d"), {
        type: 'bar',
    data: {
        datasets: [
            {
                // Título de la gráfica
                label: `Gastos por ${periodo}`,
                // Color de fondo
                backgroundColor: "#555555",
                // Datos de la gráfica
                // "agrup" contiene los datos a representar. Es uno de los parámetros de la función "mostrarGastosAgrupadosWeb".
                data: agrup
            }
        ],
    },
    options: {
        scales: {
            x: {
                // El eje X es de tipo temporal
                type: 'time',
                time: {
                    // Indicamos la unidad correspondiente en función de si utilizamos días, meses o años
                    unit: unit
                }
            },
            y: {
                // Para que el eje Y empieza en 0
                beginAtZero: true
            }
        }
    }
});
raiz.append(chart);
}

function repintar(){

    mostrarDatoEnId("presupuesto", mostrarPresupuesto());
    mostrarDatoEnId("gastos-totales", calcularTotalGastos());
    mostrarDatoEnId("balance-total", calcularBalance());

    mostrarGastoAgrupadosWeb("agrupacion-dia", agruparGastos("dia"), "dia")
    mostrarGastoAgrupadosWeb("agrupacion-mes", agruparGastos("mes"), "mes")
    mostrarGastoAgrupadosWeb("agrupacion-anyo", agruparGastos("anyo"), "anyo")

    document.getElementById("listado-gastos-completo").innerHTML = "";
    let listagastos = listarGastos();

    for (let lista of listagastos)
    {
        mostrarGastoWeb("listado-gastos-completo", lista);
    }
}

function EditarHandle(){
    this.handleEvent = function(e){

        let nuevadesc = prompt("Introduce nueva descripción");
        this.gasto.actualizarDescripcion(nuevadesc);

        let nuevovalor = prompt("Introduce nuevo valor");
        nuevovalor = parseFloat(nuevovalor);
        this.gasto.actualizarValor(nuevovalor);

        let nuevafecha = prompt("Introduce nueva fecha");
        nuevafecha = Date.parse(nuevafecha);
        this.gasto.actualizarFecha(nuevafecha);

        let nuevaetiqueta = prompt("Introduce nuevas etiquetas");
        nuevaetiqueta = nuevaetiqueta.split(', ');
        this.gasto.anyadirEtiquetas(nuevaetiqueta);

        repintar();
        
    }
}

function BorrarHandle(){
    this.handleEvent = function(e){

        borrarGasto(this.gasto.id);

        repintar();
    }
}

function BorrarEtiquetasHandle(){
    this.handleEvent = function(e){
       
        this.gasto.borrarEtiquetas(this.etiqueta);

        repintar();
    }
}

function BorrarAPI(){
    this.handleEvent = async function(e){
        let usuario = document.getElementById("nombre_usuario").value;
        let idGasto = this.gasto.gastoId;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usuario}/${idGasto}`;
        let response = await fetch(url, {method: 'DELETE'});

        if (response.status == 200 || response.status == 201)
        {
            cargarGastosApi();
        }
        else
        {
            alert("Error: " + response.status);
        }
    }
}

function actualizarPresupuestoWeb(){

    let nuevoPresupuesto = prompt("Introduzca nuevo presupuesto");
    nuevoPresupuesto = parseFloat(nuevoPresupuesto);

    actualizarPresupuesto(nuevoPresupuesto);

    repintar();
}

let botActualizar = document.getElementById("actualizarpresupuesto");
botActualizar.addEventListener("click", actualizarPresupuestoWeb);

function nuevoGastoWeb(){

    let nuevadesc = prompt("Introduce nueva descripción");
    let nuevovalor = prompt("Introduce nuevo valor");
    let nuevafecha = prompt("Introduce nueva fecha");
    let nuevaetiqueta = prompt("Introduce nuevas etiquetas");
    
    nuevovalor = parseFloat(nuevovalor);
    let arrEtiquetas = nuevaetiqueta.split(', ');

    let gasto = new CrearGasto(nuevadesc, nuevovalor, nuevafecha, arrEtiquetas);
    anyadirGasto(gasto);
    repintar();

}

let botAnaydir = document.getElementById("anyadirgasto");
botAnaydir.addEventListener("click", nuevoGastoWeb);


function submitHandle() {
    this.handleEvent = function(e){

        e.preventDefault();
        let form = e.currentTarget;

        let nuevadesc = form.elements.descripcion.value;
        let nuevovalor = form.elements.valor.value;
        let nuevafecha = form.elements.fecha.value;
        let nuevaetiqueta = form.elements.etiquetas.value;

        nuevovalor = parseFloat(nuevovalor);
        let gasto = new CrearGasto(nuevadesc, nuevovalor, nuevafecha, nuevaetiqueta);
        anyadirGasto(gasto);
        repintar();
        document.getElementById("anyadirgasto-formulario").disabled = false;
    }
}

function submitHandleEditar() {
    this.handleEvent = function(e){

        e.preventDefault();
        let form = e.currentTarget;

        let nuevadesc = form.elements.descripcion.value;
        let nuevovalor = form.elements.valor.value;
        let nuevafecha = form.elements.fecha.value;
        let nuevaetiqueta = form.elements.etiquetas.value;

        nuevovalor = parseFloat(nuevovalor);

        this.gasto.actualizarDescripcion(nuevadesc);
        this.gasto.actualizarValor(nuevovalor);
        this.gasto.actualizarFecha(nuevafecha);
        this.gasto.anyadirEtiquetas(...nuevaetiqueta);

        repintar();
        
    }
}
function cancelarHandle(){
    this.handleEvent = function(e){

        e.currentTarget.parentNode.remove();
        document.getElementById("anyadirgasto-formulario").disabled = false;
        
        repintar();
    }
}


function EditarHandleFormulario(){
    this.handleEvent = function(e){

        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
        var formulario = plantillaFormulario.querySelector("form");

        let boton = e.currentTarget;
        boton.after(formulario);

        boton.disabled = true;


        let editarGasto = new submitHandleEditar();
        editarGasto.gasto = this.gasto;

        formulario.elements.descripcion.value = this.gasto.descripcion;
        formulario.elements.valor.value = this.gasto.valor;
        formulario.elements.fecha.value = this.gasto.fecha;
        formulario.elements.etiquetas.value = this.gasto.etiquetas;
        
        let botonEditar = formulario; //He cambiado el nombre del botón respecto al que tenía puesto que no se el motivo por el cual en su día puse crear y este lo define mejor.
        botonEditar.addEventListener("submit", editarGasto);

        let cancelarGasto = new cancelarHandle();
        let botonCancelar = formulario.querySelector("button[class = cancelar]");
        botonCancelar.addEventListener("click", cancelarGasto);
    
        let manEditarAPI = new EditarApi();
        let botEditarAPI = formulario.querySelector("button[class = gasto-enviar-api]");
        manEditarAPI.formulario = formulario;
        manEditarAPI.gasto = this.gasto;
        botEditarAPI.addEventListener("click", manEditarAPI);

    }
}

function nuevoGastoWebFormulario(){

    this.handleEvent = function(e){
        
        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
        var formulario = plantillaFormulario.querySelector("form");
        
        document.getElementById("controlesprincipales").append(formulario);
        document.getElementById("anyadirgasto-formulario").disabled = true;

        let manEnviar = new submitHandle();
        let botonEnviar = formulario;
        botonEnviar.addEventListener("submit", manEnviar);

        let manCancelar = new cancelarHandle();
        let botCancelar = formulario.querySelector("button[class = cancelar]");
        botCancelar.addEventListener("click", manCancelar);
    
        let manEnviarAPI = new EnviarApi();
        let botEnviarAPI = formulario.querySelector("button[class = gasto-enviar-api]");
        botEnviarAPI.formulario = formulario;
        botEnviarAPI.gasto = this.gasto;
        botEnviarAPI.addEventListener("click", manEnviarAPI);

    }
}

function filtrarGastoWeb(){
    this.handleEvent = function(e){

        e.preventDefault();

        let plantillaFormulario = document.getElementById("filtrar-gastos");
        var datosFormulario = plantillaFormulario.querySelector("form");

        if (datosFormulario.elements["formulario-filtrado-etiquetas-tiene"].value != "")
        {
            var etiquetasValidas = transformarListadoEtiquetas(datosFormulario.elements["formulario-filtrado-etiquetas-tiene"].value);
        }

        let descripcion = datosFormulario.elements["formulario-filtrado-descripcion"].value;
        let valorMinimo = datosFormulario.elements["formulario-filtrado-valor-minimo"].value;
        let valorMaximo = datosFormulario.elements["formulario-filtrado-valor-maximo"].value;
        let fechaDesde = datosFormulario.elements["formulario-filtrado-fecha-desde"].value;
        let fechaHasta = datosFormulario.elements["formulario-filtrado-fecha-hasta"].value;
        
        
        let gastosFiltrados = filtrarGastos({fechaDesde: fechaDesde, fechaHasta: fechaHasta, valorMinimo: valorMinimo, valorMaximo: valorMaximo, descripcionContiene: descripcion, etiquetasTiene: etiquetasValidas});

        document.getElementById("listado-gastos-completo").innerHTML = "";

        for(let filtro of gastosFiltrados)
        {
            mostrarGastoWeb("listado-gastos-completo", filtro);
        }
    }
}

function guardarGastosWeb(){
    this.handleEvent = function(e){
        localStorage.GestorGastosDWEC = JSON.stringify(listarGastos());
    }
}
function cargarGastosWeb(){
    this.handleEvent = function(e){

        let gastosGuardados = JSON.parse(localStorage.getItem("GestorGastosDWEC"));
        
        if(gastosGuardados == null)
        {
            gastosGuardados = [];
            cargarGastos(gastosGuardados);
        }

        else
        {
            cargarGastos(gastosGuardados);
        }

        repintar();
    }
}

async function cargarGastosApi(){
        let usuario = document.getElementById("nombre_usuario").value;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usuario}`;

        let response = await fetch(url);

        if(response.ok)
        {
            let resultado = await response.json();
            
            cargarGastos(resultado);
        }
        else
        {
            alert("Error: " + response.status);
        }

        repintar();
}
function EnviarApi(){
    this.handleEvent = async function(e){

        let usuario = document.getElementById("nombre_usuario").value;

        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usuario}`;
        
        var form = document.querySelector("form");

        let nuevadesc = form.elements.descripcion.value;
        let nuevovalor = form.elements.valor.value;
        let nuevafecha = form.elements.fecha.value;
        let nuevaetiqueta = form.elements.etiquetas.value;

        nuevovalor = parseFloat(nuevovalor);
        nuevaetiqueta = nuevaetiqueta.split(",")

        let objetoform = {
            descripcion: nuevadesc,
            valor: nuevovalor,
            fecha: nuevafecha,
            etiquetas: nuevaetiqueta
        };
        
        let response = await fetch(url, {method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(objetoform)
        });

        if (response.status == 200 || response.status == 201)
        {
        cargarGastosApi();
        }
        else
        {
        alert("Error: " + response.status);
        }

    }
}

function EditarApi(){
    this.handleEvent = async function(e){

        let usuario = document.getElementById("nombre_usuario").value;
        let idGasto = this.gasto.gastoId;
        let url = `https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/${usuario}/${idGasto}`;
        
        let form = this.formulario;

        let nuevadesc = form.elements.descripcion.value;
        let nuevovalor = form.elements.valor.value;
        let nuevafecha = form.elements.fecha.value;
        let nuevaetiqueta = form.elements.etiquetas.value;

        nuevovalor = parseFloat(nuevovalor);
        nuevaetiqueta = nuevaetiqueta.split(",")

        let objetoform = {
            descripcion: nuevadesc,
            valor: nuevovalor,
            fecha: nuevafecha,
            etiquetas: nuevaetiqueta
        };
        
        let response = await fetch(url, {method: 'PUT',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(objetoform)
        });

        if (response.status == 200 || response.status == 201)
        {
        cargarGastosApi();
        }
        else
        {
        alert("Error: " + response.status);
        }

    }
}

let crearFormulario = new nuevoGastoWebFormulario();

let botonCrear = document.getElementById("anyadirgasto-formulario");
botonCrear.addEventListener("click", crearFormulario);

let gastoWebFiltrado = new filtrarGastoWeb();

let botonFiltrar = document.getElementById("formulario-filtrado");
botonFiltrar.addEventListener("submit", gastoWebFiltrado);

let guardar = new guardarGastosWeb();
let botonGuardar = document.getElementById("guardar-gastos");
botonGuardar.addEventListener("click", guardar);

let cargar = new cargarGastosWeb();
let botonCargar = document.getElementById("cargar-gastos");
botonCargar.addEventListener("click", cargar);

let btnCargarAPI = document.getElementById("cargar-gastos-api");
btnCargarAPI.addEventListener("click", cargarGastosApi);

export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastoAgrupadosWeb,
}
