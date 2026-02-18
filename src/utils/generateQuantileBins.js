const filterMissing = (x) => ![null, undefined].includes(x) && !isNaN(x);

export const generateQuantileBins = (data, colorScale, accessor, mapParams) => {
    if (mapParams.Bins) return mapParams.Bins;
    if (mapParams.bins) return mapParams.bins;
    const nBins = colorScale?.length || 6;
    const features = data?.features || [];
    //console.log('generating bins: ' + nBins);
    const columnData = features.map((f) => f.properties[accessor]).filter(filterMissing).sort((a,b) => a - b)
    const bins = Array(nBins).fill(0).map((_, i) => {
      return columnData[Math.round((features?.length/nBins)*i)]
    }).slice(1,)
    return bins;
}
