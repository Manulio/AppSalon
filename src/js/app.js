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
        const resultado = await fetch('./servicios.json');

        const db = await resultado.json();

        const servicios = db.servicios;


        //generar HTML

        servicios.forEach(servicio => {
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
    } else {
        elemento.classList.add('seleccionado');

    }

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
        paginaSiguiente.classList.remove('ocultar');

    } else if (pagina == 2) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');


    }
    mostrarSeccion();

}

function mostrarResumen() {
    //Destucturing
    const {
        nombre,
        fecha,
        gora,
        servicios
    } = cita;

    //seleccionar resumen
    const resumenDiv = document.querySelector('.contenido-resumen');


    //validacion

    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos';
        noServicios.classList.add('invalidar-cita');

        //agrefar a resumenDiv
        resumenDiv.appendChild(noServicios);

    }


}