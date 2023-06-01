function startAppearances() {

    function updateScatterplot(scatterplotSvg,data,name,max) {
        // Clear the scatterplot
        scatterplotSvg.selectAll("*").remove();

        // Transform the data for the selected character into an array
        const countArrayData = Object.entries(data[name]).map(([name, count]) => ({ name, count }));


        let countArrayDataSeason1 = countArrayData.filter((name) => name.name.startsWith('s01'));
        countArrayDataSeason1Split = []
        countArrayDataSeason1.forEach((object) => {
            val = {}
            val.count = object.count
            let splittedName = object.name.split('_')
            splittedName = splittedName.reduce((accumulator, current, currentIndex) => {
                if (currentIndex != 0 && currentIndex != 3) {
                    return accumulator + current;
                }
                return accumulator
            }, '');  
            val.name = splittedName
            countArrayDataSeason1Split.push(val)
        });

        // Create the x scale
        const xScatterplotScale = d3
        .scaleBand()
        .domain(countArrayDataSeason1Split.map(d => d.name))
        .range([0, width])
        .padding(0.1);

        // Create the y scale
        const yScatterplotScale = d3
        .scaleLinear()
        // .domain([0, d3.max(countArrayDataSeason1Split, d => d.count)]) // we could adjust the domain for each character
        .domain([0,max]) // but rather, we set it such that it's fix for each of them as it makes it easier to compare between each character
        .range([height, 0]);

        // Create the circles for the scatterplot
        scatterplotSvg.selectAll(".circle")
            .data(countArrayDataSeason1Split)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function (d) { return xScatterplotScale(d.name); })
            .attr("cy", function (d) { return yScatterplotScale(d.count); })
            .attr("r", 5);

        // Add the x-axis for the scatterplot
        scatterplotSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScatterplotScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add the y-axis for the scatterplot
        scatterplotSvg.append("g")
            .call(d3.axisLeft(yScatterplotScale));
    }

    function link(name) {
        return `https://enrico-benedettini.github.io/friends_data/${name}.json`
    }

    let mainCharacters = []
    let linesCountData = []
    let wordsCountData = []
    let wordsUsagesCountData = []
    let margin = {top: 10, right: 30, bottom: 30, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    

    d3.json(link("character_appearances")).then(function (apperancesData) {
        function histogram(svg,data,perCharacter=false,name) {
            
            /* Prepare element for the following viz (scatter plot of number of lines per appearance) */
            mainCharacters = Object.keys(data)
            if (perCharacter == true) {
                data = data[name]
            }
            // First, we convert the data to an array such that each index corresponds to a character and its appearances' count
            const dataArray = Object.entries(data).map(([name, count]) => ({ name, count }));
            
            /* 1. Set up phase */
            svg.selectAll("*").remove();

            /* 2. Define the scales */
            // Create the x scale
            const xHistogramScale = d3
            .scaleBand()
            .domain(dataArray.map(d => d.name))
            .range([0, width])
            .padding(0.1);

            // Create the y scale
            const yHistogramScale = d3
            .scaleLinear()
            .domain([0, d3.max(dataArray, d => d.count)])
            .range([height, 0]);

            /* 3. Content addition */
            // We create the bars and add them to our chart
            const bars = svg
                .selectAll(".bar")
                .data(dataArray)
                .enter()
                .append("rect")
                .style("fill", "blue")
                .attr("class", "bar")
                .attr("x", d => xHistogramScale(d.name))
                .attr("y", d => yHistogramScale(d.count))
                .attr("width", xHistogramScale.bandwidth())
                .attr("height", d => height - yHistogramScale(d.count));
            
            /* 4. Define the axes */
            // Create the x axis
            const xAxis = d3.axisBottom(xHistogramScale);
            svg
                .append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);

            // Create the y axis
            const yAxis = d3.axisLeft(yHistogramScale);
            svg
                .append("g")
                .attr("class", "y-axis")
                .call(yAxis);
            return bars
        }

        function createSvg(){
            // Create the SVG element
            // We select the div with id=last_viz and append to it the svg that will contain the viz (plot or histogram)
            return d3.select("#last_viz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        // Create the SVG elements for the scatterplots and histogram
        let histogramSvg = createSvg()
        let linesScatterplotSvg = createSvg()
        let wordsScatterplotSvg = createSvg()
        let wordsUsagesHistogramSvg = createSvg()


        const bars = histogram(histogramSvg,apperancesData)
        // Add event listener to the bars
        bars.on("click", function (d) {
            // updateLinesScatterplot(this.__data__.name);
            updateScatterplot(linesScatterplotSvg, linesCountData, this.__data__.name,30)
            updateScatterplot(wordsScatterplotSvg, wordsCountData, this.__data__.name,200)
            histogram(wordsUsagesHistogramSvg,wordsUsagesCountData,true,this.__data__.name)
        });
    }).then(function (){
        d3.json(link("lines_counts")).then(function (linesData) {
            linesCountData = linesData
        })
    }).then(function (){
        d3.json(link("words_per_line")).then(function (words_data) {
            wordsCountData = words_data
        })
    }).then(function (){
        d3.json(link("words_usages")).then(function (usages_data) {
            wordsUsagesCountData = usages_data
        })
    })
}

startAppearances()