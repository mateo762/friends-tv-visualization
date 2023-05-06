function startEmotions() {

    const width = 900;
    const height = 600;
    const padding = 50;
    const legendWidth = 150; // Set the width for the legend
    const data = [
        {
            x: 5,
            y: 20,
            values: [10, 20, 30, 40],
            picture: "ross"
        },
        {
            x: 35,
            y: 40,
            values: [25, 15, 30, 10],
            picture: "monica"
        },
        {
            x: 65,
            y: 25,
            values: [45, 10, 30, 15],
            picture: "chandler"
        },
        {
            x: 95,
            y: 45,
            values: [25, 50, 15, 10],
            picture: "phoebe"
        },
        {
            x: 125,
            y: 30,
            values: [25, 15, 30, 10],
            picture: "joey"
        },


        // Add more data points here...
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

    const maxX = width - padding - legendWidth;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x)])
        .range([padding, maxX]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y)])
        .range([height - padding, padding]);

    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.values.length)])
        .range([5, 20]);

    const pieGenerator = d3.pie()
        .sort(null);

    const arcGenerator = d3.arc()
        .outerRadius(50)
        .innerRadius(25)
        .padAngle(0.1)
        .cornerRadius(0);



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
            .attr("x", -25)
            .attr("y", -25)
            .attr("width", 25 * 2)
            .attr("height", 25 * 2);

        group.selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', (d, i) => colorScale(i))
            .style('opacity', 0.6)
            .on('mouseover', function (d) {
                // Increase outer radius of arc generator
                arcGenerator.outerRadius(50 + 10);
                arcGenerator.innerRadius(25 + 10);
                arcGenerator.padAngle(0.2 - 0.15);
                // Redraw sectors with updated arc generator
                d3.select(this)
                    .transition()
                    .attr('d', arcGenerator)
                    .style('opacity', 1);
            })
            .on('mouseout', function (d) {
                // Reset outer radius of arc generator
                arcGenerator.outerRadius(50);
                arcGenerator.innerRadius(25);
                arcGenerator.padAngle(0.2);

                // Redraw sectors with updated arc generator
                d3.select(this)
                    .transition()
                    .attr('d', arcGenerator)
                    .style('opacity', 0.6);
            });
    });

    // Define the legend data
    const legendData = colorScale.domain().map(label => ({
        label,
        color: colorScale(label)
    }));


    // Create the legend
    const legend = legendGroup.selectAll('.legend')
        .data(colorScale.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0, ${i * 40})`);

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 40)
        .attr('height', 20)
        .style('fill', colorScale)
        .style('opacity', 0.6);

    legend.append('text')
        .attr('x', 60)
        .attr('y', 14)
        .text(d => d.label)
        .style('font-size', '12px');
}

startEmotions()