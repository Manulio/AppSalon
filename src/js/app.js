


let pagina = 1;

const cita = {
    nombre = '',
    fecha = '',
    hora = '',
    servicios: []
}



document.addEventListener('DOMContentLoaded', function() {
    iniciarApp()
});

function iniciarApp() {
    mostrarServicios();

    //resalta el div actual, segun el tab que presiono
    mostrarSeccion();

    //oculta o muestra seccion segun el tab que presiono
    cambiarSeccion();

    //paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //validacion paginacion, y botones
    botonesPaginacion();


    //Muestra el recumen de la cita o error
    mostrarResumen();

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el objeto
    fechaCita();

    //Desabilita dias pasados
    desabilitarFecha();

    //Almacena la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion() {

    //eliminar mostrar-seccion de la anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion')
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    //Agrega mostrar-seccion donde dimos click
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual')
}



function cambiarSeccion() {

    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginacion();
        });
    });



}


async function mostrarServicios() {
    try {
        const url = "http://127.0.0.1:3000/servicios.php";
        const resultado = await fetch(url);

        const db = await resultado.json();
        
        


        //generar HTML

        db.forEach(servicio => {
            const {
                id,
                nombre,
                precio
            } = servicio;
            //DOM scripting
            //Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            //Generar precio de servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor de sercicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //inyectar em HTML
            document.querySelector('#servicios').appendChild(servicioDiv);






        });
    } catch (error) {
        console.log(error);

    }

}

function seleccionarServicio(e) {
    let elemento;

    //Forzar que el elemento al cual le damos click sea el div
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        agregarServicio(servicioObj);

    }

}

function agregarServicio(servicioObj) {
    const {
        servicios
    } = cita;
    cita.servicios = [...servicios,
        servicioObj
    ];
    console.log('agregando', servicioObj.id);



}

function eliminarServicio(id) {
    const {
        servicios
    } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

}




function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        console.log(pagina);
        botonesPaginacion();

    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        console.log(pagina);
        botonesPaginacion();
    });
}

function botonesPaginacion() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {

        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen(); //estamos en la pagina 3
    } else {

        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    }
    mostrarSeccion();

}

function mostrarResumen() {
    //Destucturing
    const {
        nombre,
        fecha,
        hora,
        servicios
    } = cita;

    //seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');
    //limpia html previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion

    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos';
        noServicios.classList.add('invalidar-cita');

        //agrefar a resumenDiv
        resumenDiv.appendChild(noServicios);
        console.log(cita);
        return;
    }
    //Mostrar el Resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = `Resumen de la Cita`;

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = `Resumen de Servicios`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;


    //iterar sobre array servicios
    servicios.forEach(servicio => {
        const {
            nombre,
            precio
        } = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedorServicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const precioTotal = precio.split('$');
        cantidad += parseInt(precioTotal[1].trim());

        //colocar texto y precio en el div

        serviciosCita.appendChild(contenedorServicio);
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
    });
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);


    const cantidadPagar = document.createElement('P');
    cantidadPagar.innerHTML = `<span>Total:</span> $${cantidad}`;
    cantidadPagar.classList.add("total")
    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', (e) => {
        const nombreTexto = e.target.value.trim();
        console.log(nombreTexto);
        //validacion nombreTexto
        if (nombreTexto === '') {
            mostrarAlerta('Ingrese un nombre', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}



function mostrarAlerta(mensaje, tipo) {

    const alertaPrevia = document.querySelector('.alerta');
    //si alerta ya existe sale de la funcion
    if (alertaPrevia) {
        return;
    }


    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    if (tipo === 'error') {
        alerta.classList.add('error');
    }
    //insertar en HTML
    const formuario = document.querySelector('.formulario');
    formuario.appendChild(alerta);

    //eliminar la alerta despues de 3 seg
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaImput = document.querySelector('#fecha');
    fechaImput.addEventListener('input', (e) => {

        const dia = new Date(e.target.value).getUTCDay();
        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaImput.value = '';
            mostrarAlerta('Seleccione otro dia', 'error');
        } else {
            console.log('Dia valido');
            cita.fecha = fechaImput.value;

        }
    })
}

function desabilitarFecha() {
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;



    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;
    console.log(fechaDeshabilitar);
    inputFecha.min = fechaDeshabilitar;

}


function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', (e) => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        if (hora[0] <= 10 || hora[0] >= 18) {
             mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
               mostrarAlerta.remove();

            }, 3000)
        } else {
            mostrarAlerta.remove();
            cita.hora = horaCita;
        }
    })
}