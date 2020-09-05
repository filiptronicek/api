const fetch = require('node-fetch');

fetch("https://api.github.com/repos/filiptronicek/blog/git/trees/master?recursive=1").then((response) => response.json()).then((data) => {
    for (const file of data.tree) {
        if(file.path.includes('_posts/')) {
            const fileName = file.path;
            fetch(`https://raw.githubusercontent.com/filiptronicek/filiptronicek.github.io/master/${fileName}`)
            .then(resp => resp.text())
            .then(data => {
                let title = fileName.replace('_posts/', '')[1];
                if(!data.split("\n")[1].includes("layout")) {
                    title = data.split("\n")[1].replace('title: ', '');
                } else if(data.split("\n")[2].includes("title")) {
                    title = data.split("\n")[1].replace('title: ', '');
                }
                console.log(title);
            });
        }
    }
});
