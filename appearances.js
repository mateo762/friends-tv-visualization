function startAppearances() {

    function link(name) {
        return `https://enrico-benedettini.github.io/friends_data/${name}.json`
    }

    d3.json(link("character_appearances")).then(function (apperances_data) {
        console.log(apperances_data)
    })
    d3.json(link("lines_counts")).then(function (lines_data) {
        console.log(lines_data)
    })
    d3.json(link("words_per_line")).then(function (words_data) {
        console.log(words_data)
    })
    d3.json(link("words_usages")).then(function (usages_data) {
        console.log(usages_data)
    })
}

startAppearances()