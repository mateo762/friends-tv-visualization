const width = 500;
const height = 600;

function drag(simulation) {
    function dragStarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragEnded(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
}

d3.json("https://mateo762.github.io/friends_data/gossips_z_scores.json").then(function (graph) {

    const nodes = graph.nodes
    const edges = graph.links

    // Convert source and target IDs to node objects
    edges.forEach(edge => {
        edge.source = nodes.find(node => node.id === edge.source);
        edge.target = nodes.find(node => node.id === edge.target);
    });

    const svg = d3.select("#gossip-visualization")

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Calculate the domain (min and max weights) from the graph.links data
    const minWeight = d3.min(edges, d => d.value);
    const maxWeight = d3.max(edges, d => d.value);

    // Modify the linkColor scale
    const linkColor = d3.scaleSequential(t => d3.interpolatePurples(0.3 + 0.7 * t)).domain([minWeight, maxWeight]);

    function generateCharacterGraph(centerCharacterName) {

        const centerNode = nodes.find(node => node.id === centerCharacterName);
        if (!centerNode) {
            console.error(`Character ${centerCharacterName} not found`);
            return;
        }

        const characterEdges = edges.filter(edge => edge.source.id === centerNode.id).map(edge => ({ ...edge }));
        const characterNodes = characterEdges.map(edge => nodes.find(node => node.id === edge.target.id)).map(node => ({ ...node }));

        characterNodes.push({ ...centerNode });

        // Update source and target references in characterEdges
        characterEdges.forEach(edge => {
            edge.source = characterNodes.find(node => node.id === edge.source.id);
            edge.target = characterNodes.find(node => node.id === edge.target.id);
        });

        const characterSimulation = d3.forceSimulation(characterNodes)
            .force("link", d3.forceLink(characterEdges).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-2200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const characterSvg = d3.create("svg")
            .attr("width", width)
            .attr("height", height);

        const arrowhead = characterSvg.append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 22)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 2)
            .attr('markerHeight', 2)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke', 'none');

        const characterLink = characterSvg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(characterEdges)
            .join("line")
            .attr("stroke-width", d => 8)
            .attr("class", "link")
            .attr("stroke", d => linkColor(d.value))
            .attr("marker-end", "url(#arrowhead)");


        const characterNode = characterSvg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(characterNodes)
            .join("g")
            .call(drag(characterSimulation));

        characterNode.append("circle")
            .attr("r", 30)
            .attr("fill", d => color(d.group));

        characterNode.append("image")
            .attr("x", -25)
            .attr("y", -25)
            .attr("width", 50)
            .attr("height", 50)
            .attr("href", d => {
                const imageName = d.id.split(' ')[0].toLowerCase();
                return `../pictures/${imageName}.png`;
            });


        characterSimulation.on("tick", () => {
            characterLink
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            characterNode.attr("transform", d => `translate(${d.x}, ${d.y})`);

        });

        const characterDiv = document.createElement("div");
        characterDiv.classList.add("character-graph");
        characterDiv.appendChild(characterSvg.node());
        document.querySelector(".grid-container").appendChild(characterDiv);
    }

    nodes.forEach(node => {
        generateCharacterGraph(node.id);
    });


    document.body.appendChild(svg.node());


});

