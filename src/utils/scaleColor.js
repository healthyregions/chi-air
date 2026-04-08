export const scaleColor = (val, bins, colors) => {
    for (let i=0; i<bins.length; i++){
        if ((Math.round(val * 10) / 10) <= bins[i]) return colors[i];
    }
    return colors[colors.length-1]
}
