export default class Animal {
    constructor(nombre, edad, img, comentarios, sonido) {
        let _nombre = nombre;
        let _edad = edad;
        let _img = img;
        let _comentarios = comentarios;
        let _sonido = sonido;

        this.getNombre = () => _nombre;
        this.getEdad = () => _edad;
        this.getImg = () => _img;
        this.getComentarios = () => _comentarios;
        this.getSonido = () => _sonido;

        this.setComentarios = (nuevosComentarios) => _comentarios = nuevosComentarios;
    }

    get Nombre() {
        return this.getNombre();
    }

    get Edad() {
        return this.getEdad();
    }

    get Img() {
        return this.getImg();
    }

    get Comentarios() {
        return this.getComentarios();
    }

    get Sonido() {
        return this.getSonido();
    }

    set Comentarios(nuevosComentarios) {
        this.Comentarios.setComentarios(nuevosComentarios);
    }
}
