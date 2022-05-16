const fileName = "9679_w13_gt_13-2.pdf"

renameCAIE = function(fileName){
    const pattern = /\d{4}_(\S)(\d{2})_(\S{2})_*([^_]*)\./
    let result = fileName.match(pattern)
    const paper = {'year': 'other', 'season': 'other', 'num': 'other', 'region': 'other', 'type': 'other'}

    if (result) {
        // console.log(result)
        if (result[1] === 'm') {
            paper.season = "March"
        } else if (result[1] === 's') {
            paper.season = "May/June"
        } else if (result[1] === 'w') {
            paper.season = "November"
        }

        paper.year = "20" + result[2]
        paper.type = result[3].toUpperCase()

        if (result[4] && result[4].length <= 2) {
            if (result[4].length === 1) {
                paper.num = "Paper " + result[4][0]
            } else if (result[4][0] === "0") {
                paper.num = "Paper " + result[4][1]
            } else {
                paper.num = "Paper " + result[4][0]
                paper.region = "Region " + result[4][1]
            }
        }
    }

    return paper.year + " " + paper.season + " " + paper.num + " " + paper.region + " " + paper.type
}


// console.log(getPaperInfo(fileName))

