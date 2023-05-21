function startEmotions() {
    
    const width = 900;
    const height = 600;
    const padding = 50;
    const legendWidth = 150; // Set the width for the legend
    const data = [
        {
            // x values are fixed for visual understanding -- give enough spacing between each
            // Not data related
            x: 5,
            // Total count of words out of which this analysis is made
            y: 95566,
            // Emotion proportion of values for each sector
            values: [0.18797, 0.108155, 0.292655, 0.096588, 0.072874, 0.066512, 0.175246],
            // picture name / piechart identifier
            picture: "ross"
        },
        {
            x: 35,
            y: 83099,
            values: [0.200974, 0.129111, 0.294153, 0.090743, 0.073082, 0.076736, 0.135201],
            picture: "monica"
        },
        {
            x: 65,
            y: 86845,
            values: [0.22191, 0.123034,	0.308427, 0.095506, 0.079775, 0.046067, 0.125281],
            picture: "chandler"
        },
        {
            x: 95,
            y: 81587,
            values: [0.247754, 0.077022, 0.287548, 0.094994, 0.078306, 0.082798, 0.131579],
            picture: "phoebe"
        },
        {
            x: 125,
            y: 86530,
            values: [0.235257, 0.077996, 0.296766, 0.093215, 0.090679, 0.065314, 0.140774],
            picture: "joey"
        },
        
    ];
    
    const svg = d3.select('#my_dataviz')
    .append('svg')
    .attr('width', width + legendWidth)
    .attr('height', height);
    
    
    // Create a group for the pie charts
    const chartsGroup = svg.append('g')
    .attr('transform', `translate(${padding},${padding})`);
    
    // Create a group for the legend
    const legendGroup = svg.append('g')
    .attr('transform', `translate(${width},${padding})`);
    
    // Append a text display element
    const textDisplay = legendGroup
    .append('text')
    .attr('id', 'text-display')
    .attr('x', 0)
    .attr('y', 300)
    .text('TEST');

    const xAxisWidth = width;
    const xAxisHeight = 20;
    const xAxisX = padding;
    const xAxisY = height - padding;

    const xAxis = svg
    .append('svg')
    .attr('class', 'x-axis')
    .attr('width', xAxisWidth)
    .attr('height', xAxisHeight)
    .attr('x', xAxisX)
    .attr('y', xAxisY);

    xAxis.style('background-color', '#f0f0f0').style('border', '1px solid #ccc');
    const seasons = ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 'Season 6','Season 7', 'Season 8', 'Season 9','Season 10', 'Season 11', 'Season 12']; // Replace with your season data
    const axisScale = d3
    .scaleBand()
    .domain(seasons)
    .range([0, width - 2*padding])
    .padding(0.1);

    const seasonRects = xAxis
    .selectAll('rect')
    .data(seasons)
    .enter()
    .append('rect')
    .attr('x', (d) => axisScale(d))
    .attr('y', 0)
    .attr('width', axisScale.bandwidth())
    .attr('height', xAxisHeight)
    .style('fill', '#ccc')
    .style('cursor', 'pointer')
    .on('click', handleSeasonClick);

    function handleSeasonClick(event, season) {
        // Update the data for the pie charts based on the selected season
        // Redraw the pie charts with the updated data
        console.log('Selected season:', season);
        // Implement your logic here to update and redraw the pie charts
      }
    
    const maxX = width - padding - legendWidth;
    
    const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([padding, maxX]);
    
    const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.y) - d3.min(data, d => d.y)/3, d3.max(data, d => d.y)])
    .range([height - padding, padding]);
    
    const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.values.length)])
    .range([5, 20]);
    
    const pieGenerator = d3.pie()
    .sort(null);
    
    const arcGenerator = d3.arc()
    .outerRadius(60)
    .innerRadius(35)
    .padAngle(0.1)
    .cornerRadius(0);
    
    const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    
    
    const colorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10);
    
    const groups = chartsGroup.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);
    
    groups.each(function (d) {
        const pieData = pieGenerator(d.values);
        const group = d3.select(this);
        
        // Add clipping path
        const clip = group.append("clipPath")
        .attr("id", "clip")
        .append("circle")
        .attr("r", arcGenerator.innerRadius());
        
        // Append the image element
        group.append("image")
        .attr("xlink:href", (d, i) => `pictures/${d.picture}.png`)
        .attr("clip-path", "url(#clip)") // Use the clip path
        .attr("x", -35)
        .attr("y", -35)
        .attr("width", 35 * 2)
        .attr("height", 35 * 2);
        
        group.selectAll('path')
        .data(pieData)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (d, i) => colorScale(i))
        .style('opacity', 0.6)
        .on('mouseover', function (d) {
            
            // Get the data associated with the hovered segment
            const segmentData = d3.select(this).datum().data;
            
            // Display the data in the tooltip
            tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);
            tooltip.html(`${(segmentData*100).toFixed(2)}%`)
            .style('left', `${d.pageX}px`)
            .style('top', `${d.pageY - 28}px`);
            
            
            // Increase outer radius of arc generator
            arcGenerator.outerRadius(60 + 10);
            arcGenerator.innerRadius(35 + 10);
            arcGenerator.padAngle(0);
            // Redraw sectors with updated arc generator
            d3.select(this)
            .transition()
            .attr('d', arcGenerator)
            .style('opacity', 1);
        })
        .on('mouseout', function (d) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
            // Reset outer radius of arc generator
            arcGenerator.outerRadius(60);
            arcGenerator.innerRadius(35);
            arcGenerator.padAngle(0.1);
            
            // Redraw sectors with updated arc generator
            d3.select(this)
            .transition()
            .attr('d', arcGenerator)
            .style('opacity', 0.6);
        });
    });
    
    const emotion_list = ["Joyful", "Mad", "Neutral", "Peaceful", "Powerful", "Sad", "Scared"]
    
    // Define the legend data
    const legendData = colorScale.domain().map(label => ({
        label : emotion_list[label],
        color: colorScale(label)
    }));
    
    
    // Create the legend
    const legend = legendGroup.selectAll('.legend')
    .data(legendData)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => `translate(0, ${i * 40})`)
    .attr('data-id', (d, i) => i); // Assign a unique identifier to each legend item
    
    
    legend.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 40)
    .attr('height', 20)
    .style('fill', d => d.color)
    .style('opacity', 0.6);
    
    legend.append('text')
    .attr('x', 60)
    .attr('y', 14)
    .text(d => d.label)
    .style('font-size', '18px');
    
    // Add click event listener to legend elements
    legend.selectAll('rect')
    .on('click', function(event, d) {
        const matchingPaths = [];
        const notMatchingPaths = [];
        const clickedRect = d3.select(this)
        const newRectOpacity = clickedRect.style('opacity') === '1' ? 0.6 : 1;
        clickedRect.transition().style('opacity', newRectOpacity)

        // Get the unique identifier of the clicked legend item
        const clickedId = clickedRect.node().parentNode.getAttribute('data-id');
        
        // Iterate over each legend rectangle
        legend.selectAll('rect')
        .each(function () {
            const rect = d3.select(this);
        // Get the unique identifier of the current legend item
        const rectId = rect.node().parentNode.getAttribute('data-id');
            if (clickedId !== rectId) {
                // Set the opacity based on the clicked legend item
                rect
                .transition()
                .style('opacity', 0.6);
            }
            else{
                rect
                .transition()
                .style('opacity', newRectOpacity);
            }
        });
        
        
        
        // Iterate over each pie chart group
        groups.each(function() {
            const group = d3.select(this);
            const legendIndex = legendData.findIndex(entry => entry.label === d.label);
            
            
            // Iterate over each path in the pie chart
            group.selectAll('path')
            .each(function(segmentData) {
                // console.log("segmentData.index: " + segmentData.index)
                // console.log("legendIndex: " + legendIndex)
                
                // Check if the data matches the clicked legend entry
                if (segmentData.index === legendIndex) {
                    matchingPaths.push(d3.select(this));
                }
                else{
                    notMatchingPaths.push(d3.select(this));
                }
            });
        });    
        
        // Update the style of the matching paths
        // Toggle the opacity and radii of the selected paths
        const currentOpacity = matchingPaths[0].style('opacity');
        const newOpacity = currentOpacity === '1' ? 0.6 : 1;
        matchingPaths.forEach(function(path) {
            path.transition()
            .style('opacity', newOpacity)
        })
        notMatchingPaths.forEach(function(path) {
            path.transition()
            .style('opacity', 0.6)
        }
        );
        
        // Change text box beneath legend
        const selectedText = d.label;
        textDisplay.text(selectedText);
        if(newRectOpacity === 0.6){
            textDisplay.text("TEST")
        }
        
    });
    
    
    
    
    
}

startEmotions()