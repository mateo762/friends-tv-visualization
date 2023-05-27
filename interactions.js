function startInteractions() {
    const width = 1500;
    const height = 800;

    d3.json("https://mateo762.github.io/friends_data/interactions.json").then(function (graph) {

        const nodes = graph.nodes
        const edges = graph.links

        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const colorCloud = d3.scaleOrdinal(d3.schemeCategory10);


        // Calculate the domain (min and max weights) from the graph.links data
        const minWeight = d3.min(edges, d => d.value);
        const maxWeight = d3.max(edges, d => d.value);

        // Create a linear scale for the edge weights
        const edgeWeightScale = d3.scaleLinear()
            .domain([minWeight, maxWeight])
            .range([1, 10]); // Adjust the range to suitable values for the edge thickness

        // Modify the linkColor scale
        const linkColorMain = d3.scaleSequential(t => d3.interpolateBlues(0.2 + 0.8 * t)).domain([672, 976]);
        const linkColorSec = d3.scaleSequential(t => d3.interpolateOranges(0.2 + 0.8 * t)).domain([31, 55]);


        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(edges).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-4200))
            .force("center", d3.forceCenter(width / 3, height / 2));

        const svg = d3.select("#interaction").append("svg")
            //.attr("viewBox", [0, 0, width, height]);
            .attr("width", width)
            .attr("height", height)
            .attr("class", "interaction-div")


        const edgeTooltip = svg.append("g")
            .attr("class", "edge-tooltip")
            .style("display", "none");

        const xRect = width * 2 / 3

        edgeTooltip.append("rect")
            .attr("class", "edge-tooltip-rect")
            .attr("width", width / 3)
            .attr("height", height)
            .attr("fill", "#ccc")
            .attr("stroke", "#000")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", xRect)

        edgeTooltip.append("image")
            .attr("x", xRect + 20)
            .attr("y", 20)
            .attr("width", 100)
            .attr("height", 100)
            .attr("class", "image-1");

        edgeTooltip.append("image")
            .attr("x", xRect + 400 - 20)
            .attr("y", 20)
            .attr("width", 100)
            .attr("height", 100)
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
            .attr("stroke-width", d => 18)
            .attr("class", "link")
            .attr("stroke", d => {
                if (d.source.group == 2 || d.target.group == 2) {
                    return linkColorSec(d.value)
                } else {
                    return linkColorMain(d.value)
                }
            })
            .on("mouseover", function (event, d) {
                // Change the stroke color to green on hover
                d3.select(this).attr("stroke", "green");
            })
            .on("mouseout", function (event, d) {
                // Reset the stroke color to its original value when the mouse leaves
                if (d.source.group == 2 || d.target.group == 2) {
                    d3.select(this).attr("stroke", linkColorSec(d.value));
                } else {
                    d3.select(this).attr("stroke", linkColorMain(d.value));
                }
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

                // Prepare the data for the word cloud
                let words = d.phrases.map(word => ({ text: word[0], size: word[1] }));

                // Compute the domain of your size values
                let sizeDomain = d3.extent(words, d => d.size);

                // Decide on your font size range
                let fontSizeRange = [30, 60]; // Change this to fit your design

                // Create a scale for the font sizes
                let fontSizeScale = d3.scaleLinear()
                    .domain(sizeDomain)
                    .range(fontSizeRange);

                words = words.map(word => ({ text: word.text, size: fontSizeScale(word.size)}))
                console.log(words)

                // Create a new layout instance
                let layout = d3.layout.cloud()
                    .size([500, 800]) // Set the size of the word cloud to the same size as your tooltip
                    .words(words)
                    .padding(5)
                    .rotate(() => ~~(Math.random() * 2) * 90)
                    .font("Impact")
                    .fontSize(d => d.size) // Use the scale here
                    .on("end", draw);

                // Start the layout calculation
                layout.start();

                function draw(words) {
                    edgeTooltip.append("g")
                        .attr("transform", "translate(1250,400)") // Center the word cloud in the tooltip
                        .selectAll("text")
                        .data(words)
                        .enter().append("text")
                        .style("font-size", d => `${d.size}px`)
                        .style("font-family", "Impact")
                        .style("fill", (_d, i) => colorCloud(i))
                        .attr("text-anchor", "middle")
                        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                        .text(d => d.text);
                }

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
                // Set the image source based on the character's name
                const imageName = d.id.split(' ')[0].toLowerCase();

                tooltip.select("image").attr("href", `pictures/${imageName}.png`);

                // Position the tooltip based on the node's coordinates
                tooltip.attr("transform", `translate(${d.x + 10}, ${d.y - 25})`);
            });

        node.append("circle") // Add a circle element to the 'g' element
            .attr("r", 40) // Change the radius to 30
            .attr("fill", d => color(d.group));

        node.append("image") // Add an image element to the 'g' element
            .attr("x", -35) // Center the image horizontally
            .attr("y", -35) // Center the image vertically
            .attr("width", 70) // Set the image width
            .attr("height", 70) // Set the image height
            .attr("href", function (d) {
                // Set the image source based on the character's name
                const imageName = d.id.split(' ')[0].toLowerCase();
                return `pictures/${imageName}.png`;
            }); // Set the image source

        node.append("title")
            .text(d => d.name);

        simulation.on("tick", () => {
            nodes.forEach(function (d) {
                d.x = Math.max(40, Math.min(width - 40, d.x));
                d.y = Math.max(40, Math.min(height - 40, d.y));
            });

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


            function dragged(event, d) {
                d.fx = Math.max(40, Math.min(width - 40, event.x));
                d.fy = Math.max(40, Math.min(height - 40, event.y));
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

    });


}

startInteractions()