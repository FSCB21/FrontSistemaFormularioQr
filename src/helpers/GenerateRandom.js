export default (inferior,superior)=>{
    let numPosibilidades = superior - inferior
    let aleat = Math.random() * numPosibilidades
    aleat = Math.floor(aleat)
    return parseInt(inferior) + aleat
 }