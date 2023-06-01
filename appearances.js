function startAppearances() {

    function link(name) {
        return `https://enrico-benedettini.github.io/friends_data/${name}.json`
    }

    let mainCharacters = []
    let margin = {top: 10, right: 30, bottom: 30, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    d3.json(link("character_appearances")).then(function (apperancesData) {
        mainCharacters = Object.keys(apperancesData)
        // First, we convert the data to an array such that each index corresponds to a character and its appearances' count
        const dataArray = Object.entries(apperancesData).map(([name, count]) => ({ name, count }));
        
        /* 1. Set up phase */
        // We select the div with id=last_viz and append to it the svg that will contain the histogram
        let svg = d3.select("#last_viz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        // We create a group element within the SVG and translate it to account for the margins
        const chart = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        /* 2. Define the scales */
        // Create the x scale
        const x = d3
        .scaleBand()
        .domain(dataArray.map(d => d.name))
        .range([0, width])
        .padding(0.1);

        // Create the y scale
        const y = d3
        .scaleLinear()
        .domain([0, d3.max(dataArray, d => d.count)])
        .range([height, 0]);

        /* 3. Content addition */
        // We create the bars and add them to our chart
        chart
            .selectAll(".bar")
            .data(dataArray)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.count));
        
        /* 4. Define the axes */
        // Create the x axis
        const xAxis = d3.axisBottom(x);
        chart
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        // Create the y axis
        const yAxis = d3.axisLeft(y);
        chart
            .append("g")
            .attr("class", "y-axis")
            .call(yAxis);
    }).then(function (){

        d3.json(link("lines_counts")).then(function (linesData) {
            console.log(`linesData = ${linesData}`)
            console.log(linesData[mainCharacters[0]])


            // let svg = d3.select("#my_dataviz")
            //     .append("svg")
            //     .attr("width", width + margin.left + margin.right)
            //     .attr("height", height + margin.top + margin.bottom)
            
            // svg.selectAll("circle")
            // .data(linesData)
            // .enter()
            // .append("circle")
            // .style("fill","red")
            // .attr("cx", function(d) { return x(d.x); })
            // .attr("cy", function(d) { return y(d.y); })
            // .attr("r", 1);
        })
    }).then(function (){
        d3.json(link("words_per_line")).then(function (words_data) {
            console.log(words_data)
        })
    }).then(function (){
        d3.json(link("words_usages")).then(function (usages_data) {
            console.log(usages_data)
        })
    })
}

startAppearances()