import { Leon, Lobo, Oso, Serpiente, Aguila } from './animales.class.js';

// IIFE con funciones relacionadas al Registro de Animales
const registroDeAnimales = (() => {

    let _animales, _animalesRegistrados = [];
    let _listado, _datosAnimal, _imagenAnimal, _validarFormulario,
        _procesarRegistro, _desplegarAnimal, _reiniciarFormulario, _datosRegistro;
    const _animalesAPI = location.host; 

    // Obtiene los datos base de los animales desde una 'API'
    fetch(`//${_animalesAPI}/animales.json`)
        .then(resp => resp.json())
        .then(json => {
            _animales = json.animales;
        });

    // Retorna una copia de los actuales registros
    _listado = () => {
        return [..._animalesRegistrados];
    };

    // Obtiene los datos base del animal consultado
    _datosAnimal = (animal) => {
        return _animales.find(elem => elem.name == animal);
    };

    // Obtiene la imagen del animal consultado
    _imagenAnimal = (animal) => {
        return new Promise((resolve) => {
            let tempAnimal = _datosAnimal(animal);
            resolve(tempAnimal.imagen);
        });
    };

    // Valida el formulario y en el caso que esté OK
    // llama al método que realiza el registro
    _validarFormulario = () => {
        // selectores para los campos del formulario
        let animal = $('#animal');
        let edad = $('#edad');
        let comentarios = $('#comentarios');

        let campos = [animal, edad, comentarios];
        let tieneErrores = false;

        //validación simplificada de los campos del formulario
        campos.forEach(elem => {
            if ((elem.val() == '') || (elem.val() == null)) {
                tieneErrores = true;
            }
        });

        if (tieneErrores) {
            alert('Debes completar todos los campos del formulario.');
        } else {
            _procesarRegistro(animal.val(), edad.val(), comentarios.val());
        }
    };

    // Realiza el registro
    _procesarRegistro = (animal, edad, comentarios) => {
        let infoAnimal = _datosAnimal(animal);
        let nuevoAnimal = {};

        switch (animal) {
            case 'Leon':
                nuevoAnimal = new Leon(animal, edad, `./assets/imgs/${infoAnimal.imagen}`, comentarios, `./assets/sounds/${infoAnimal.sonido}`);
                break;
            case 'Lobo':
                nuevoAnimal = new Lobo(animal, edad, `./assets/imgs/${infoAnimal.imagen}`, comentarios, `./assets/sounds/${infoAnimal.sonido}`);
                break;
            case 'Oso':
                nuevoAnimal = new Oso(animal, edad, `./assets/imgs/${infoAnimal.imagen}`, comentarios, `./assets/sounds/${infoAnimal.sonido}`);
                break;
            case 'Serpiente':
                nuevoAnimal = new Serpiente(animal, edad, `./assets/imgs/${infoAnimal.imagen}`, comentarios, `./assets/sounds/${infoAnimal.sonido}`);
                break;
            case 'Aguila':
                nuevoAnimal = new Aguila(animal, edad, `./assets/imgs/${infoAnimal.imagen}`, comentarios, `./assets/sounds/${infoAnimal.sonido}`);
                break;
            default:
                console.log('error al procesar el registro');
                break;
        }

        _animalesRegistrados.push(nuevoAnimal);
        _desplegarAnimal(nuevoAnimal, _animalesRegistrados.length - 1);
        _reiniciarFormulario();
    };

    // Despliega el animal registrado en la lista visual
    _desplegarAnimal = (animal, indice) => {
        $('#Animales').append(`
            <div class="animal-registrado" data-indice="${indice}">
                <img class="animal-registrado-imagen" src="${animal.Img}" alt="${animal.Nombre}">
                <div class="animal-registrado-audio"></div>
            </div>`);
    };

    // Resetea el formulario a sus valores iniciales
    _reiniciarFormulario = () => {
        $('#animal')[0].selectedIndex = 0;
        $('#edad')[0].selectedIndex = 0;
        $('#comentarios').val('');
        $("#preview").attr("style", "background-image: url('assets/imgs/lion.svg')");
    };

    // Retorna los datos de un registro específico por su índice
    _datosRegistro = (indice) => {
        return _animalesRegistrados.find((elem, index) => index == indice);
        // return _animalesRegistrados[indice];
    };

    return {
        // Retorna una copia de los actuales registros
        registros: () => {
            return _listado();
        },

        // Obtiene los datos base del animal consultado
        datosAnimal: (animal) => {
            return _datosAnimal(animal);
        },

        // Obtiene la ruta de la imagen del animal consultado
        imagenAnimal: async (animal) => {
            return await _imagenAnimal(animal);
        },

        // Valida el formulario y en el caso que esté OK
        // realiza el registro
        registrarAnimal: () => {
            _validarFormulario();
        },

        // Retorna los datos de un registro específico
        datosRegistro: (indice) => {
            return _datosRegistro(indice);
        },
    }
})();


// listener del botón registrar
$('#btnRegistrar').click(function () {
    registroDeAnimales.registrarAnimal();
})


// listener del select del animal para desplegar la imagen respectiva
$('#animal').change(function () {
    let animalSeleccionado = $(this).val();
    registroDeAnimales.imagenAnimal(animalSeleccionado)
        .then(imagenAnimal => {
            $("#preview").attr("style", `background-image: url('assets/imgs/${imagenAnimal}')`);
        });
})


// listener para cuando se hace click en la imagen de un animal registrado
$('#Animales').on('click', '.animal-registrado-imagen', function () {
    $('#animalModal').find('.modal-body').html('');

    let dataIndice = $(this).parent().attr('data-indice');
    let datosRegistro = registroDeAnimales.datosRegistro(dataIndice);

    $('#animalModal').find('.modal-body').append(`
        <img src="${datosRegistro.Img}" alt="${datosRegistro.Nombre}" class="img-fluid mb-3">
        <h6>${datosRegistro.Edad}</h6>
        <h6>Comentarios</h6>
        <hr />
        <p>
            ${datosRegistro.Comentarios}
        </p>`);

    var modal = new bootstrap.Modal(document.getElementById('animalModal'), {
        keyboard: true
    });
    modal.show();
});


// listener para cuando se hace click en el audio de un animal registrado
$('#Animales').on('click', '.animal-registrado-audio', function () {
    $('#player').removeAttr("src");

    let indice = $(this).parent().attr('data-indice');
    let datosRegistro = registroDeAnimales.datosRegistro(indice);

    $('#player').attr("src", datosRegistro.Sonido);

    async function playAudio() {
        try {
            await audioElem.play();
        } catch (err) {
            console.log(err);
        }
    }

    let audioElem = document.getElementById("player");
    playAudio();
});
