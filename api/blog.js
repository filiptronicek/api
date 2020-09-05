const fetch = require('node-fetch');

module.exports = (_req, res) => {
    fetch("https://api.github.com/repos/filiptronicek/blog/git/trees/master?recursive=1").then((response) => response.json()).then((data) => {
        let posts = [];
        let i = 0;
        for (const file of data.tree) {

            if(file.path.includes('_posts/')) {
                i++;
                const fileName = file.path;
                fetch(`https://raw.githubusercontent.com/filiptronicek/filiptronicek.github.io/master/${fileName}`)
                .then(resp => resp.text())
                .then(dta => {
                    let title = fileName.replace('_posts/', '')[1];
                    if(!dta.split("\n")[1].includes("layout")) {
                        title = dta.split("\n")[1].replace('title: ', '');
                    } else if(dta.split("\n")[2].includes("title")) {
                        title = dta.split("\n")[1].replace('title: ', '');
                    }

                    const revisionsURL = `https://github.com/filiptronicek/blog/commits/master/${fileName}`;

                    posts.push({title: title, revisions: revisionsURL});
                    if(i === posts.length + 1) res.json(JSON.parse(posts));
                });
            }
        }
    });
};