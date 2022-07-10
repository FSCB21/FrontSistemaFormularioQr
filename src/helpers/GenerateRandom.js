/*Este archivo sirve para generar un numero aleatorio */

//Se exporta la funcion por defecto, y como parametros se solicitan el número minimo y el maximo posible número
export default (inferior, superior) => {
    let numPosibilidades = superior - inferior
    let aleat = Math.random() * numPosibilidades
    aleat = Math.floor(aleat)
    return parseInt(inferior) + aleat
}