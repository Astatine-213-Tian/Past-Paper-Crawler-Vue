const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs')
const path = require('path');
const mainURL = "https://papers.xtremepape.rs/";

const getContent = function (base) {
    const url = mainURL + base
    const options = {
        headers:{'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'}
    };

    return new Promise((resolve, reject) => {
        let cachePath = base !== '' ? '../cache/' + base.substr(0, base.length - 1).replace(/\//g, '-') : '../cache/Main'
        cachePath = path.join(__dirname, cachePath)
        // console.log('url: ', url)

        // Try to find Cache
        if (fs.existsSync(cachePath)) {
            // Read Cache
            fs.readFile(cachePath, 'utf8', (err, data) => {
                // console.log(data)
                resolve(eval(data));
            })
        } else { // Crawl Page content
            let html = "";
            console.log('getting response')
            console.log(url)
            https.get(url, options, (res) => {
                res.on('data', (chunk) => {
                    html += chunk;
                });

                res.on('end', () => {
                    console.log('parsing response')
                    const contents = []
                    const $ = cheerio.load(html);
                    $('a[class=autoindex_a]').each(function (i, elem) {
                        const name = $(this).attr('href')
                        if (name !== '../') {
                            if (name[name.length - 1] === "/") {
                                contents.push({'name': name.substr(0, name.length - 1), 'url': base + name, 'type': 'folder', 'starred': ''})
                            } else {
                                contents.push({'name': name, 'url': base + name, 'type': name.substring(name.lastIndexOf('.') + 1, name.length)})
                            }
                        }
                    })

                    // Store Cache
                    fs.writeFile(cachePath, JSON.stringify(contents), 'utf8', (err) => {
                        if (err) throw err;
                        console.log('File saved')
                    });

                    resolve(contents);
                })

            }).on('error', (error) => {
                console.log(error)
                reject(error);
            });
        }
    })

}

// getContent(url).then(res => {
//     console.log(res)
// }).catch(e => {
//     console.log(e)
// })

module.exports = {getContent}