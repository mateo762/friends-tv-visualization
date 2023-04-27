const width = 800;
const height = 600;

d3.json("https://mateo762.github.io/friends_data/graph_data.json").then(function (graph) {
    // Your d3.js code goes here
    // You can access the nodes and links using graph.nodes and graph.links
    // const nodes = [
    //     { id: 'Ross', name: 'Ross Geller', group: 1 },
    //     { id: 'Rachel', name: 'Rachel Green', group: 1 },
    //     { id: 'Monica', name: 'Monica Geller', group: 1 },
    //     { id: 'Chandler', name: 'Chandler Bing', group: 1 },
    //     { id: 'Joey', name: 'Joey Tribbiani', group: 1 },
    //     { id: 'Phoebe', name: 'Phoebe Buffay', group: 1 },
    //     { id: 'Janice', name: 'Janice Litman', group: 2 },
    //     { id: 'Gunther', name: 'Gunther', group: 2 }
    // ];

    // const edges = [ { source: 'Ross', target: 'Rachel', value: 150, sentiment: 'positive' },
    //     { source: 'Ross', target: 'Monica', value: 120, sentiment: 'positive' },
    //     { source: 'Ross', target: 'Chandler', value: 130, sentiment: 'positive' },
    //     { source: 'Ross', target: 'Joey', value: 110, sentiment: 'positive' },
    //     { source: 'Ross', target: 'Phoebe', value: 100, sentiment: 'positive' },
    //     { source: 'Rachel', target: 'Monica', value: 140, sentiment: 'positive' },
    //     { source: 'Rachel', target: 'Chandler', value: 90, sentiment: 'neutral' },
    //     { source: 'Rachel', target: 'Joey', value: 95, sentiment: 'neutral' },
    //     { source: 'Rachel', target: 'Phoebe', value: 105, sentiment: 'positive' },
    //     { source: 'Monica', target: 'Chandler', value: 200, sentiment: 'positive' },
    //     { source: 'Monica', target: 'Joey', value: 85, sentiment: 'neutral' },
    //     { source: 'Monica', target: 'Phoebe', value: 115, sentiment: 'positive' },
    //     { source: 'Chandler', target: 'Joey', value: 180, sentiment: 'positive' },
    //     { source: 'Chandler', target: 'Phoebe', value: 80, sentiment: 'neutral' },
    //     { source: 'Joey', target: 'Phoebe', value: 125, sentiment: 'positive' },
    //     { source: 'Chandler', target: 'Janice', value: 60, sentiment: 'negative' },
    //     { source: 'Ross', target: 'Janice', value: 20, sentiment: 'negative' },
    //     { source: 'Rachel', target: 'Gunther', value: 30, sentiment: 'neutral' },
    //     { source: 'Gunther', target: 'Ross', value: 25, sentiment: 'negative' }
    // ];

    const nodes = graph.nodes
    const edges = graph.links

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Calculate the domain (min and max weights) from the graph.links data
    const minWeight = d3.min(edges, d => d.value);
    const maxWeight = d3.max(edges, d => d.value);

    // Create a linear scale for the edge weights
    const edgeWeightScale = d3.scaleLinear()
        .domain([minWeight, maxWeight])
        .range([1, 10]); // Adjust the range to suitable values for the edge thickness

    const linkColor = d3.scaleOrdinal()
        .domain(['positive', 'neutral', 'negative'])
        .range(['#2ECC40', '#F1C40F', '#E74C3C']);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(edges).id(d => d.id).distance(50))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height]);


    // Create the tooltip-like element
    const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("width", 150)
        .attr("height", 50)
        .attr("fill", "#ccc")
        .attr("stroke", "#000")
        .attr("rx", 5)
        .attr("ry", 5);

    tooltip.append("image")
        .attr("x", 5)
        .attr("y", 5)
        .attr("width", 40)
        .attr("height", 40);

    tooltip.append("text")
        .attr("x", 50)
        .attr("y", 30)
        .attr("font-size", "14px");

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(edges)
        .join("line")
        .attr("stroke-width", d => edgeWeightScale(d.value))
        .attr("stroke", d => linkColor(d.sentiment));

    svg.on("click", function (event) {
        // Check if the event target is not a node
        if (!event.target.classList.contains("node")) {
            // Hide the tooltip
            tooltip.style("display", "none");
        }
    });

    // Update the node class
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .join("circle")
        .attr("class", "node") // Add this line
        .attr("r", 5)
        .attr("fill", d => color(d.group))
        .call(drag(simulation))
        .on("click", function (event, d) {
            // Show the tooltip with character's name
            tooltip.style("display", "block");
            tooltip.select("text").text(d.id);

            // Set the image source based on the character's name
            const imageName = d.id.split(' ')[0].toLowerCase();

            tooltip.select("image").attr("href", `pictures/${imageName}.png`);

            // Position the tooltip based on the node's coordinates
            tooltip.attr("transform", `translate(${d.x + 10}, ${d.y - 25})`);
        });

    node.append("title")
        .text(d => d.name);

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    document.body.appendChild(svg.node());
});

