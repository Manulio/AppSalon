let pagina = 1;


document.addEventListener('DOMContentLoaded', function() {
    iniciarApp()
});

function iniciarApp() {
    mostrarServicios();

    //resalta el div actual, segun el tab que presiono
    mostrarSeccion();

    //oculta o muestra seccion segun el tab que presiono
    cambiarSeccion();
}

function mostrarSeccion() {
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

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
            console.log(pagina);

            //eliminar mostrar-seccion de la anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');


            //Agrega mostrar-seccion donde dimos click
            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');


            //Eliminar la clase de actual en el tab anterior
            document.querySelector('.tabs .actual').classList.remove('actual');


            //agregar la calse de actual en el nuevo tab
            const tab = document.querySelector(`[data-paso="${pagina}"]`);
            tab.classList.add('actual');
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