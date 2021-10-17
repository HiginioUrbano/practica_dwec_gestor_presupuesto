// TODO: Crear las funciones, objetos y variables indicadas en el enunciado

//Variable global
let presupuesto = 0;
let gastos = [];
let idGasto = 0;

function actualizarPresupuesto(x) {

    if (x >= 0)
    { 
        presupuesto = x;
        return x;
    }
    else
    {
        x = -1
        return x;
    }
}

function mostrarPresupuesto() {
    // TODO
    let x = presupuesto;
    return `Tu presupuesto actual es de ${x} €`;
}

function CrearGasto(descripcion, valor, fecha, ...etiquetas) {
    // TODO


    
    this.descripcion = descripcion;

    if (valor >= 0)
    {
        this.valor = valor;
    } 
    else
    {
        this.valor = 0;
    }

    if (fecha)
    {
        fecha = Date.parse(fecha);
        this.fecha = fecha;
    }
    else
    {
        fecha = Date.now(fecha);
        this.fecha = fecha;
    }

    this.etiquetas = (etiquetas.length === 0) ? etiquetas = [] : etiquetas;

    this.mostrarGasto = function() {
        return `Gasto correspondiente a ${descripcion} con valor ${valor} €`
    };

    this.mostrarGastoCompleto = function() {
        let fecha2 = new Date(fecha)

        let texto= `Gasto correspondiente a ${descripcion} con valor ${valor} €.\nFecha: ${fecha2.toLocaleString()}\nEtiquetas:\n- ${etiquetas.join("\n- ")}\n`;

        return texto;
    };

    this.actualizarDescripcion = function(nuevadesc) {
        this.descripcion = nuevadesc;
    }

    this.actualizarValor = function(nuevovalor) {
        if (nuevovalor >= 0)
        {
            this.valor = nuevovalor;
        }
    }
    this.actualizarFecha = function(nuevafecha) {
        if (Date.parse(nuevafecha))
        {
            fecha = Date.parse(nuevafecha)
            this.fecha = fecha;
        }
    }
    this.anyadirEtiquetas = function(...nuevaetiqueta) {

        for (let i = 0; i < nuevaetiqueta.length; i++)
        {
            let encontrado = this.etiquetas.includes(nuevaetiqueta[i]) 

            if(encontrado == false)
            {
                this.etiquetas.push(nuevaetiqueta[i]);
            }
        }
    }
    this.borrarEtiquetas = function(...borraretiqueta)
    {
        for (let i = 0; i < borraretiqueta.length; i++)
        {
            let pos = this.etiquetas.indexOf(borraretiqueta[i])
            
            if (pos >= 0) 
            {
                this.etiquetas.splice(pos, 1)
            }
        }
    }
}
function listarGastos() {
        return gastos;
}

function anyadirGasto(nuevogasto) {
    nuevogasto.id = idGasto;

    idGasto = idGasto + 1;

    gastos.push(nuevogasto);
}
function borrarGasto(id) {

    let pos = gastos.findIndex(gasto => gasto.id == id)
    
    if (pos >= 0)
    {
        gastos.splice(pos, 1)
    }
}
function calcularTotalGastos() {
    let totalgastos = 0;
    
    for (let i = 0; i < gastos.length; i++)
    {
        totalgastos = totalgastos + gastos[i].valor;
    }

    return totalgastos;
}
function calcularBalance() {
    let balance;

    balance = presupuesto - calcularTotalGastos();

    return balance;
}

// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance
}
