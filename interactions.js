function startInteractions() {
    const width = 600;
    const height = 600;

    d3.json("https://mateo762.github.io/friends_data/interactions.json").then(function (graph) {

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

        // Modify the linkColor scale
        const linkColor = d3.scaleSequential(t => d3.interpolatePurples(0.3 + 0.7 * t)).domain([minWeight, maxWeight]);


        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-1200))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const svg = d3.create("svg")
            //.attr("viewBox", [0, 0, width, height]);
            .attr("width", width)
            .attr("height", height)


        const edgeTooltip = svg.append("g")
            .attr("class", "edge-tooltip")
            .style("display", "none");

        edgeTooltip.append("rect")
            .attr("class", "edge-tooltip-rect")
            .attr("width", 200)
            .attr("height", 120)
            .attr("fill", "#ccc")
            .attr("stroke", "#000")
            .attr("rx", 5)
            .attr("ry", 5);

        edgeTooltip.append("image")
            .attr("x", 5)
            .attr("y", 5)
            .attr("width", 60)
            .attr("height", 60)
            .attr("class", "image-1");

        edgeTooltip.append("image")
            .attr("x", 135)
            .attr("y", 5)
            .attr("width", 60)
            .attr("height", 60)
            .attr("class", "image-2");

        // Create the tooltip-like element
        const tooltip = svg.append("g")
            .attr("class", "tooltip")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 300)
            .attr("height", 80)
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
            .attr("class", "text-name")
            .attr("x", 50)
            .attr("y", 30)
            .attr("font-size", "14px");
        tooltip.append("text")
            .attr("class", "text-user")
            .attr("x", 50)
            .attr("y", 50)
            .attr("font-size", "14px");
        tooltip.append("text")
            .attr("class", "text-word")
            .attr("x", 50)
            .attr("y", 70)
            .attr("font-size", "14px");


        svg.on("click", function (event) {
            // Check if the event target is not a node
            console.log(event.target.classList)
            if (
                !event.target.classList.contains("node") &&
                !(event.target.parentElement && event.target.parentElement.classList.contains("node")) &&
                !event.target.classList.contains("link") &&
                !(event.target.parentElement && event.target.parentElement.classList.contains("link"))
            ) {
                // Hide the tooltip
                tooltip.style("display", "none");
                // Hide the edgeTooltip
                edgeTooltip.style("display", "none");
            }
        });

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(edges)
            .join("line")
            .attr("stroke-width", d => 8)
            .attr("class", "link")
            .attr("stroke", d => linkColor(d.value))
            .on("mouseover", function (event, d) {
                // Change the stroke color to green on hover
                d3.select(this).attr("stroke", "green");
            })
            .on("mouseout", function (event, d) {
                // Reset the stroke color to its original value when the mouse leaves
                d3.select(this).attr("stroke", linkColor(d.value));
            })
            .on("click", function (event, d) {
                // Hide the character tooltip
                tooltip.style("display", "none");

                // Get the mouse position
                const [x, y] = d3.pointer(event);

                // Display the edge tooltip
                edgeTooltip.style("display", "block")

                // Clear previous text elements
                edgeTooltip.selectAll("text").remove();
                console.log(d)

                // Add a single text element for the phrases
                const phraseText = edgeTooltip.append("text")
                    .attr("x", 100) // Half of the rectangle width
                    .attr("y", 100) // Half of the rectangle height
                    .attr("text-anchor", "middle") // Horizontally center the text
                    .attr("dominant-baseline", "middle") // Vertically center the text
                    .attr("font-size", "13px");

                const imageName1 = d.source.id.split(' ')[0].toLowerCase();
                const imageName2 = d.target.id.split(' ')[0].toLowerCase();
                edgeTooltip.select('.image-1').attr("href", `pictures/${imageName1}.png`)
                edgeTooltip.select('.image-2').attr("href", `pictures/${imageName2}.png`)


                // Create a variable to keep track of the current phrase index
                let phraseIndex = 0;

                // Use d3.interval to update the displayed phrase every second
                // Use d3.interval to update the displayed phrase every second
                const interval = d3.interval(() => {
                    // Fade out the current phrase
                    phraseText.transition()
                        .duration(500)
                        .style("opacity", 0)
                        .on("end", () => {
                            // Increment the phrase index
                            phraseIndex++;

                            // If we've reached the end of the phrases, reset the index to 0
                            if (phraseIndex >= d.phrases.length) {
                                phraseIndex = 0;
                            }

                            // Update the text with the current phrase
                            //phraseText.text(d.phrases[phraseIndex].join(" "));
                            phraseText.text("words/phrases exchange by them");

                            // Fade in the updated phrase
                            phraseText.transition()
                                .duration(500)
                                .style("opacity", 1);
                        });
                }, 1000);

                // Stop the interval when the edge tooltip is hidden
                edgeTooltip.on("mouseleave", () => {
                    interval.stop();
                });
            });


        // Update the node class
        const node = svg.append("g")
            .attr('class', "g-nodes")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .join("g") // Change this to 'g' instead of 'circle'
            .attr("class", "node") // Add this line
            .call(drag(simulation))
            .on("mouseover", function (event, d) {
                // Change the node color to green on hover
                d3.select(this).select("circle").attr("fill", "green");
            })
            .on("mouseout", function (event, d) {
                // Reset the node color to its original value when the mouse leaves
                d3.select(this).select("circle").attr("fill", color(d.group));
            })
            .on("click", function (event, d) {
                // Show the tooltip with character's name
                tooltip.style("display", "block");
                d3.select('.text-name').html(d.id);
                d3.select('.text-user').html("User he likes to interact more with");
                d3.select('.text-word').html("Favourite words/phrases to use");
                console.log(d)
                // Set the image source based on the character's name
                const imageName = d.id.split(' ')[0].toLowerCase();

                tooltip.select("image").attr("href", `pictures/${imageName}.png`);

                // Position the tooltip based on the node's coordinates
                tooltip.attr("transform", `translate(${d.x + 10}, ${d.y - 25})`);
            });

        node.append("circle") // Add a circle element to the 'g' element
            .attr("r", 20) // Change the radius to 30
            .attr("fill", d => color(d.group));

        node.append("image") // Add an image element to the 'g' element
            .attr("x", -15) // Center the image horizontally
            .attr("y", -15) // Center the image vertically
            .attr("width", 30) // Set the image width
            .attr("height", 30) // Set the image height
            .attr("href", function (d) {
                // Set the image source based on the character's name
                const imageName = d.id.split(' ')[0].toLowerCase();
                return `pictures/${imageName}.png`;
            }); // Set the image source

        node.append("title")
            .text(d => d.name);

        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("transform", d => `translate(${d.x}, ${d.y})`);
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


}

startInteractions()