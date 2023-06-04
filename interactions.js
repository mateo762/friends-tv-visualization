function startInteractions() {
    const width = 1500;
    const height = 700;

    // get all radio buttons
    const radioButtons = document.getElementsByName('season-interaction');

    // iterate through each radio button
    for (let i = 0; i < radioButtons.length; i++) {
        // add an event listener for the 'change' event
        radioButtons[i].addEventListener('change', function (e) {
            // if this radio button is checked
            if (e.target.checked) {
                // call the changeGraph function with the id of the checked radio button
                changeGraph(e.target.id);
            }
        });
    }

    function changeGraph(checkedRadioTopicId) {

        d3.select("#interaction-svg").html("")

        let link_csv;
        let simulationStrength;
        if (checkedRadioTopicId == 'season-interaction-1') {
            link_csv = "https://mateo762.github.io/friends_data/interactions_season_1_to_3.json"
            simulationStrength = -4400
        } else if (checkedRadioTopicId == 'season-interaction-4') {
            link_csv = "https://mateo762.github.io/friends_data/interactions_season_4_to_7.json"
            simulationStrength = -4400
        } else if (checkedRadioTopicId == 'season-interaction-8') {
            link_csv = "https://mateo762.github.io/friends_data/interactions_season_8_to_10.json";
            simulationStrength = -4400
        } else if (checkedRadioTopicId == 'season-interaction-all') {
            link_csv = "https://mateo762.github.io/friends_data/interactions_all.json"
            simulationStrength = -2200
        }

        d3.json(link_csv).then(function (graph) {

            const nodes = graph.nodes
            const edges = graph.links

            const color = d3.scaleOrdinal(d3.schemeCategory10);
            const colorCloud = d3.scaleOrdinal(d3.schemeCategory10);


            // Calculate the domain (min and max weights) from the graph.links data

            // Create a map of node ids to their groups
            const nodeGroups = new Map(nodes.map(node => [node.id, node.group]));

            // Filter the edges where the source and the target are in group 1
            const group1Edges = edges.filter(edge => nodeGroups.get(edge.source) === 1 && nodeGroups.get(edge.target) === 1);

            // Get the edge values for group 1
            const group1Values = group1Edges.map(edge => edge.value);

            // Filter the edges where either the source or the target are in group 2
            const group2Edges = edges.filter(edge => nodeGroups.get(edge.source) === 2 || nodeGroups.get(edge.target) === 2);

            // Get the edge values for group 2
            const group2Values = group2Edges.map(edge => edge.value);

            // Compute the maximum and minimum values for each group
            const maxGroup1Value = Math.max(...group1Values);
            const minGroup1Value = Math.min(...group1Values);
            const maxGroup2Value = Math.max(...group2Values);
            const minGroup2Value = Math.min(...group2Values);


            // Modify the linkColor scale
            const linkColorMain = d3.scaleSequential(t => d3.interpolateBlues(0.2 + 0.8 * t)).domain([minGroup1Value, maxGroup1Value]);
            const linkColorSec = d3.scaleSequential(t => d3.interpolateOranges(0.2 + 0.8 * t)).domain([minGroup2Value, maxGroup2Value]);


            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(edges).id(d => d.id).distance(50))
                .force("charge", d3.forceManyBody().strength(simulationStrength))
                .force("center", d3.forceCenter(width / 3, height / 2));

            const svg = d3.select("#interaction-svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "interaction-div")


            const xRect = width * 2 / 3

            const infoTooltip = svg.append("g")
                .attr("class", "info-tooltip")
                .style("display", "block")


            infoTooltip.append("rect")
                .attr("class", "edge-tooltip-rect")
                .attr("width", width / 3)
                .attr("height", height)
                .attr("fill", "#ccc")
                .attr("stroke", "#000")
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("x", xRect)


            // infoTooltip.append("text")
            //     .attr("class", "title-info")
            //     .text("The Friendships Web")
            //     .attr("x", xRect + width / 6)
            //     .attr("y", 50)
            //     .attr("font-size", "24px")
            //     .attr("font-weight", "bold")
            //     .attr("text-anchor", "middle")

            const textParagraph1 = wordWrap("Welcome to 'The Friendships Web', our first visualization that draws you into the heart of Friends' complex relationships. This interactive graph illuminates the connections between our beloved characters across the show's lifespan. Select between the early years (Seasons 1-3), the middle years (Seasons 4-7), the later years (Seasons 8-10), or plunge into the entire series at a glance with our comprehensive graph. Each character is a node in this network, with the edge's thickness and color indicating the depth and frequency of their interactions - the darker the edge, the stronger the connection. Blue edges are interactions between main characters only and orange edges are when at least one character is secondary.", 50)


            infoTooltip.append("text")
                .attr("y", 30)
                .attr("font-size", "18px")
                .attr("text-anchor", "middle")
                .attr("class", "text-paragraph-1")

            infoTooltip.select(".text-paragraph-1")
                .selectAll("tspan")
                .data(textParagraph1)
                .enter()
                .append("tspan")
                .text(d => d)
                .attr("x", xRect + width / 6)
                .attr("dy", () => "1.2em")

            const textParagraph2 = wordWrap("Clicking on a character node unveils a wealth of insights. Discover a word cloud of each character's most characteristic words, and see who they most enjoy gossiping about. You can also click on the connecting edges to reveal the common words exchanged between the connected characters and find out who is more talkative. It's a unique, data-driven dive into the exchanges that kept us laughing, crying, and rooting for our favorite characters across ten seasons. Step into this engaging web of relationships, and see Friends in a whole new light with 'The Friendships Web'. Enjoy your journey!", 50)

            infoTooltip.append("text")
                .attr("y", 390)
                .attr("font-size", "18px")
                .attr("text-anchor", "middle")
                .attr("class", "text-paragraph-2")

            infoTooltip.select(".text-paragraph-2")
                .selectAll("tspan")
                .data(textParagraph2)
                .enter()
                .append("tspan")
                .text(d => d)
                .attr("x", xRect + width / 6)
                .attr("dy", () => "1.2em")


            const edgeTooltip = svg.append("g")
                .attr("class", "edge-tooltip")
                .style("display", "none");

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
                .attr("x", xRect + 60)
                .attr("y", 20)
                .attr("width", 130)
                .attr("height", 130)
                .attr("class", "image-1");

            edgeTooltip.append("text")
                .attr("x", xRect + width / 12)
                .attr("y", 200)
                .attr("font-size", "22px")
                .style("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr("class", "text-name-1")

            edgeTooltip.append("image")
                .attr("x", xRect + 400 - 100)
                .attr("y", 20)
                .attr("width", 130)
                .attr("height", 130)
                .attr("class", "image-2");

            edgeTooltip.append("text")
                .attr("class", "text-name-2")
                .attr("x", xRect + 365)
                .attr("y", 200)
                .attr("font-size", "22px")
                .style("font-weight", "bold")
                .attr("text-anchor", "middle")


            edgeTooltip.append("text")
                .attr("class", "text-words")
                .attr("x", xRect + width / 6)
                .attr("y", 570)
                .attr("font-size", "22px")
                .style("font-weight", "bold")
                .attr("text-anchor", "middle")

            // Create the tooltip-like element
            const tooltip = svg.append("g")
                .attr("class", "edge-tooltip")
                .style("display", "none");

            tooltip.append("rect")
                .attr("class", "edge-tooltip-rect")
                .attr("width", width / 3)
                .attr("height", height)
                .attr("fill", "#ccc")
                .attr("stroke", "#000")
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("x", xRect)

            tooltip.append("image")
                .attr("x", xRect + 60)
                .attr("y", 20)
                .attr("width", 130)
                .attr("height", 130)
                .attr("class", "image");

            tooltip.append("text")
                .attr("class", "text-name")
                .attr("x", xRect + (width / 12))
                .attr("y", 200)
                .attr("font-size", "22px")
                .style("font-weight", "bold")
                .attr("text-anchor", "middle");

            tooltip.append("text")
                .attr("class", "text-description")
                .attr("y", 40)
                .attr("font-size", "22px")
                .attr("text-anchor", "middle");



            tooltip.append("image")
                .attr("x", xRect + 190 - 150)
                .attr("y", 580)
                .attr("width", 100)
                .attr("height", 100)
                .attr("class", "image-gossip image-gossip-1");


            tooltip.append("image")
                .attr("x", xRect + 190)
                .attr("y", 580)
                .attr("width", 100)
                .attr("height", 100)
                .attr("class", "image-gossip image-gossip-2");

            tooltip.append("image")
                .attr("x", xRect + 190 + 150)
                .attr("y", 580)
                .attr("width", 100)
                .attr("height", 100)
                .attr("class", "image-gossip image-gossip-3");

            tooltip.append("text")
                .attr("class", "text-gossip")
                .attr("x", xRect + width / 6)
                .attr("y", 560)
                .attr("font-size", "22px")
                .attr("text-anchor", "middle")

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
                .attr("stroke-width", d => 10)
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
                    edgeTooltip.selectAll("text").html("")

                    d3.select(".bar-chart").remove()

                    // Add a single text element for the phrases
                    const phraseText = edgeTooltip.append("text")
                        .attr("x", 100) // Half of the rectangle width
                        .attr("y", 100) // Half of the rectangle height
                        .attr("text-anchor", "middle") // Horizontally center the text
                        .attr("dominant-baseline", "middle") // Vertically center the text
                        .attr("font-size", "13px");

                    const imageName1 = d.source.id.split(' ')[0].toLowerCase();
                    const imageName2 = d.target.id.split(' ')[0].toLowerCase();
                    edgeTooltip.select('.image-1').attr("href", `./pictures/${imageName1}.png`)
                    edgeTooltip.select('.image-2').attr("href", `./pictures/${imageName2}.png`)

                    d3.select('.text-name-1').html(d.source.id.split(' ')[0])
                    d3.select('.text-name-2').html(d.target.id.split(' ')[0])
                    d3.select('.text-words').html("Who says the most words?")


                    // Create a variable to keep track of the current phrase index
                    let phraseIndex = 0;

                    // Use d3.interval to update the displayed phrase every second
                    // Use d3.interval to update the displayed phrase every second

                    // Prepare the data for the word cloud
                    let words = d.phrases.map(word => ({ text: word[0], size: word[1] }));

                    // Compute the domain of your size values
                    let sizeDomain = d3.extent(words, d => d.size);

                    // Decide on your font size range
                    let fontSizeRange = [20, 30]; // Change this to fit your design

                    // Create a scale for the font sizes
                    let fontSizeScale = d3.scaleLinear()
                        .domain(sizeDomain)
                        .range(fontSizeRange);

                    words = words.map(word => ({ text: word.text, size: fontSizeScale(word.size) }))
                    console.log(words)

                    // Create a new layout instance
                    let layout = d3.layout.cloud()
                        .size([500, 300]) // Set the size of the word cloud to the same size as your tooltip
                        .words(words)
                        .padding(5)
                        .rotate(() => ~~(Math.random() * 2) * 0)
                        .font("Impact")
                        .fontSize(d => d.size) // Use the scale here
                        .on("end", draw);

                    // Start the layout calculation
                    layout.start();

                    function draw(words) {
                        edgeTooltip.append("g")
                            .attr("transform", "translate(1250,380)") // Center the word cloud in the tooltip
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


                    // Start of new bar chart code
                    const barChartData = d.number_words;
                    console.log(d)
                    const barChartHeight = 80;
                    const barChartWidth = 300;

                    const barChart = edgeTooltip.append("g")
                        .attr("class", "bar-chart")
                        .attr("transform", `translate(${width * 2 / 3}, 600)`);  // move the g element

                    let cumValue = 0;

                    // Initial creation of bars
                    barChart.selectAll("rect")
                        .data(barChartData)
                        .enter()
                        .append("rect")
                        .attr("y", 0)
                        .attr("x", 200)
                        .attr("height", barChartHeight)
                        .attr("fill", (_d, i) => i == 0 ? "#7ECCC3" : "#CC7E87");

                    // Initial creation of text
                    barChart.selectAll("text")
                        .data(barChartData)
                        .enter()
                        .append("text")
                        .text(d => d)
                        .attr("y", barChartHeight / 2 + 5)
                        .attr("x", (d, i) => {
                            let result = 100 + (barChartWidth * (cumValue + d / 2) / d3.sum(barChartData));
                            cumValue += d;
                            return result;
                        })
                        .attr("opacity", "0")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "18px")
                        .attr("fill", "black")
                        .attr("text-anchor", "middle");


                    cumValue = 0;

                    // Update bars and text on click
                    barChart.selectAll("rect")
                        .data(barChartData)
                        .transition()  // Start a transition
                        .duration(1000)  // Set its duration to 1000 milliseconds
                        .attr("x", d => { let result = cumValue; cumValue += d; return 100 + (barChartWidth * result / d3.sum(barChartData)); })
                        .attr("width", d => barChartWidth * d / d3.sum(barChartData));

                    // Reset cumValue for text

                    barChart.selectAll("text")
                        .data(barChartData)
                        .transition()  // Start a transition
                        .duration(500)  // Set its duration to 1000 milliseconds
                        .delay(1000)
                        .attr("opacity", "1")
                });


            // Update the node class
            const node = svg.append("g")
                .attr('class', "g-nodes")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes)
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
                    console.log(d)

                    edgeTooltip.style("display", "none")
                    // Show the tooltip with character's name
                    tooltip.style("display", "block");

                    tooltip.selectAll("text").html("")
                    tooltip.selectAll(".image-gossip").attr("href", "")

                    const characterName = d.id.split(' ')[0]
                    const imageName = characterName.toLowerCase();
                    tooltip.select("image").attr("href", `./pictures/${imageName}.png`);

                    tooltip.select(".text-name").html(d.id)

                    let descriptionLines = wordWrap(d.description, 25);  // 50 characters per line

                    tooltip.select(".text-description").selectAll("tspan")
                        .data(descriptionLines)
                        .enter()
                        .append("tspan")
                        .text(d => d)
                        .attr("x", xRect + 350)
                        .attr('dy', (_d, i) => `1em`);  // '1em' means the height of the text in this case


                    tooltip.select(".text-gossip")
                        .html(`Who does <tspan style="font-weight:bold">${characterName}</tspan> gossip about?`);

                    d.gossips.forEach((character, index) => {
                        let gossipName = character[0].split(' ')[0].toLowerCase()
                        tooltip.select(`.image-gossip-${index + 1}`).attr("href", `./pictures/${gossipName}.png`)
                    })


                    // Prepare the data for the word cloud
                    let words = d.words.map(word => ({ text: word[0], size: word[1] }));

                    // Compute the domain of your size values
                    let sizeDomain = d3.extent(words, d => d.size);

                    // Decide on your font size range
                    let fontSizeRange = [20, 30]; // Change this to fit your design

                    // Create a scale for the font sizes
                    let fontSizeScale = d3.scaleLinear()
                        .domain(sizeDomain)
                        .range(fontSizeRange);

                    words = words.map(word => ({ text: word.text, size: fontSizeScale(word.size) }))

                    // Create a new layout instance
                    let layout = d3.layout.cloud()
                        .size([500, 300]) // Set the size of the word cloud to the same size as your tooltip
                        .words(words)
                        .padding(5)
                        .rotate(() => ~~(Math.random() * 2) * 0)
                        .font("Impact")
                        .fontSize(d => d.size) // Use the scale here
                        .on("end", draw);

                    // Start the layout calculation
                    layout.start();

                    function draw(words) {
                        tooltip.append("g")
                            .attr("transform", "translate(1250,380)") // Center the word cloud in the tooltip
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
                    return `./pictures/${imageName}.png`;
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

    function wordWrap(str, maxLength) {
        const words = str.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + words[i].length >= maxLength) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine += ' ' + words[i];
            }
        }
        lines.push(currentLine);  // push the last line

        return lines;
    }

    changeGraph("season-interaction-all")
}

startInteractions()