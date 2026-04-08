// webworker.js

const within = (point, bounds) => (point[0] > bounds[0] && point[0] < bounds[2] && point[1] < bounds[1] && point[1] > bounds[3])

function generateFilteredData(params) {
  // Instead of destructuring for older ES support
  const { centroids, extent, ranges } = params;
  const geojsonData = params.storedGeojson;
  const columns = params.columnNames;
  const filters = params.filterValues;
  // declare return arrays and object
  // return array will hold the list of objects with data information
  // data columns have the names of the data from geojson
  // maximums contains the scale
  let histCounts = {};
  let sums = {};
  let totalPop = 0;
  let totalTrees = 0;
  let totalTreesArea = 0;
  let heatIsland = 0;
  let treeCoverage = 0;
  let communityCounts = {};
  let count = 0;

  for (let n = 0; n < columns.length; n++) {
    sums[columns[n]] = 0
    histCounts[columns[n]] = []
    for (let x = 0; x < 9; x++) {
      histCounts[columns[n]].push(
        {
          binNumber: x,
          count: 0,
          min: x === 0 ? ranges[columns[n]].min : ranges[columns[n]].histogramBins[x - 1],
          max: ranges[columns[n]].histogramBins[x]
        }
      )
    }
  }
  ;

  let filterPresent = false;
  if (Object.keys(filters).length) filterPresent = true;

  const { features } = geojsonData;
  for (let i = 0; i < features?.length; i++) {
    const { properties } = features?.[i];
    const { community } = properties;
    const centroid = centroids?.[i]
    if (within(centroid?.feature?.geometry?.coordinates, extent)) {

      if (communityCounts[community] === undefined) {
        communityCounts[community] = 1
      } else {
        communityCounts[community] += 1
      }

      let filterPass = true;

      if (filterPresent) {
        const filterList = Object.keys(filters);
        const filterValues = Object.values(filters);

        for (let n = 0; n < filterList.length; n++) {
          if (typeof filterValues[n][0] === 'string') {
            if (!filterValues[n][0].includes(properties[filterList[n]])) {
              filterPass = false;
              break;
            }
          } else {
            if (properties[filterList[n]] < filterValues[n][0] || properties[filterList[n]] > filterValues[n][1]) {
              filterPass = false;
              break;
            }
          }
        }
      }

      if (filterPass) {
        totalPop += properties.acs_population
        totalTrees += properties.trees_n
        totalTreesArea += properties.trees_area
        heatIsland += properties.heatisl
        treeCoverage += properties.trees_crown_den
        count += 1;
      }


      for (var n = 0; n < columns.length; n++) {
        if (!properties[columns[n]]) continue
        sums[columns[n]] += properties[columns[n]]

        for (x = 0; x < 9; x++) {
          if (properties[columns[n]] <= ranges[columns[n]].histogramBins[x]) {
            histCounts[columns[n]][x].count += 1
            break
          }
        }
      }
    } else {
      continue
    }
  }
  heatIsland /= count
  treeCoverage /= count
  sums['count'] = count

  return {
    success: true,
    communityCounts,
    ranges,
    histCounts,
    sums,
    totalPop,
    totalTrees,
    totalTreesArea,
    treeCoverage,
    heatIsland
  };
}


onmessage = function (e) {
  var workerResult = generateFilteredData(e.data);
  postMessage(workerResult);
}
