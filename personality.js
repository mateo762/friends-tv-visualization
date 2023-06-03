let characterImages = d3.select(".character-images");
let svgContainer = characterImages.append("svg")
    .attr("width", 800)
    .attr("height", 150);

let characters = ["chandler", "joey", "monica", "phoebe", "rachel", "ross"];
let colors = ["#EDC951", "#CC333F", "#00A0B0", "#2E8B57", "#8A2BE2", "#FF8C00"]

// Define the image pattern
let defs = svgContainer.append("defs");

characters.forEach((character, i) => {
    let pattern = defs.append("pattern")
        .attr("id", character)
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 1)
        .attr("width", 1);

    pattern.append("image")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 80)
        .attr("width", 80)
        .attr("opacity", 1)
        .attr("class", `image-character image-${character}`)
        .attr("xlink:href", `./pictures/${character}.png`);

    svgContainer.append("circle")
        .attr("cx", (i * 130) + 70)
        .attr("cy", 70)
        .attr("r", 40)
        .style("fill", `url(#${character})`)
        .attr("class", `circle-character circle-${character}`)
        .style("stroke", colors[i])
        .style("stroke-width", 10);
});


// Set-Up
var margin = { top: 50, right: 100, bottom: 100, left: 100 },
    width = Math.min(600, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

// Data
var charactersData = {
    "Chandler": {
        "cAGR": 0.595238,
        "cCON": 0.309524,
        "cEXT": 0.380952,
        "cOPN": 0.619048,
        "cNEU": 0.523810
    },
    "Joey": {
        "cAGR": 0.512195,
        "cCON": 0.682927,
        "cEXT": 0.219512,
        "cOPN": 0.487805,
        "cNEU": 0.512195
    },
    "Monica": {
        "cAGR": 0.755102,
        "cCON": 0.428571,
        "cEXT": 0.408163,
        "cOPN": 0.673469,
        "cNEU": 0.551020
    },
    "Phoebe": {
        "cAGR": 0.510204,
        "cCON": 0.469388,
        "cEXT": 0.387755,
        "cOPN": 0.612245,
        "cNEU": 0.632653
    },
    "Rachel": {
        "cAGR": 0.511111,
        "cCON": 0.355556,
        "cEXT": 0.422222,
        "cOPN": 0.555556,
        "cNEU": 0.488889
    },
    "Ross": {
        "cAGR": 0.553191,
        "cCON": 0.382979,
        "cEXT": 0.702128,
        "cOPN": 0.765957,
        "cNEU": 0.446809
    }
};

// Transform into array of arrays with 'axis' and 'value'
var radarData = Object.keys(charactersData).map(function (name) {
    return Object.keys(charactersData[name]).map(function (category) {
        return {
            axis: getAxisName(category),
            value: charactersData[name][category]
        };
    });
});


// Draw the Chart
var color = d3.scaleOrdinal()
    .range(["#EDC951", "#CC333F", "#00A0B0", "#2E8B57", "#8A2BE2", "#FF8C00"]);  // Add more colors if you have more characters

var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,  // Since all the values are from 0 to 1
    levels: 5,
    roundStrokes: true,
    color: color
};

//Call function to draw the Radar chart
RadarChart(".radarChart", radarData, radarChartOptions);


function getAxisName(trait) {
    if (trait === "cAGR") {
        return "Agreeableness"
    } else if (trait === "cCON") {
        return "Conscientiousness"
    } else if (trait === "cEXT") {
        return "Extroversion"
    } else if (trait === "cOPN") {
        return "Openness"
    } else {
        return "Neuroticism"
    }
}