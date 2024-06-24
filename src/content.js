import FlexSearch from 'flexsearch';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.event === 'searchButtonClicked') {
        console.log('Query:', request.query);
        // const elements = document.querySelectorAll('div[data-e2e="favorites-item"]');
        const category = request.query.category;
        const elements = selectElementsBasedOnDropdown(category);
        let count = 1; 

        // create a new FlexSearch index
        const index = new FlexSearch.Document({
            id: 'id',
            index: [{
                field: 'imgSrc',
                tokenize: 'strict',
                optimize: true
            },{
                field: 'altText',
                tokenize: 'full',
            },{
                field: 'videoLink',
                tokenize: 'strict',
            },{
                field: 'videoDate',
                tokenize: 'strict',
            }]
        });

        const documents = {};

        const startDate = request.query.startDate ? new Date(request.query.startDate) : null;
        const endDate = request.query.endDate ? new Date(request.query.endDate) : null;
        console.log('Start date:', startDate);
        console.log('End date:', endDate);

        elements.forEach((element, id) => {
            count += 1;
            const imgElement = element.querySelector('img');
            let imgSrc, altText, videoLink, videoDate;
            if (imgElement) {
                imgSrc = imgElement.src;
                altText = imgElement.alt;
                console.log('Image src:', imgSrc);
                console.log('Alt text:', altText);
                console.log('Count:', count);
            }

            // extract the video link
            if (imgSrc && !imgSrc.includes('gif')) {
                const linkElement = element.querySelector('a[href*="tiktok.com/@"]');
                if (linkElement) {
                    videoLink = linkElement.getAttribute('href');
                    console.log('Video link:', videoLink);
                    
                    // get the video date
                    const vidId = getVidId(videoLink);
                    const unixTimestamp = extractUnixTimestamp(vidId);
                    videoDate = unixTimestampToHumanDate(unixTimestamp);
                    videoDate = new Date(videoDate)
                    console.log('Video date:', videoDate);
                

                    // add the document to the index
                    if ((!startDate || videoDate >= startDate) && (!endDate || videoDate <= endDate)) {
                        const doc = {
                            id: id,
                            imgSrc: imgSrc,
                            altText: altText,
                            videoLink: videoLink,
                            videoDate: videoDate.toLocaleDateString(),
                        };
                        
                        index.add(doc);
                        documents[id] = doc;
                        }
                    }
                }
                    
            });

        // Search the index
        const results = index.search(request.query.keywords, {
            index: 'altText', enrich: true
        });
        
        console.log('Query:', request.query.keywords);
        console.log('Docs:', documents);
        if (results.length === 0) {
            console.log('No results found');
            chrome.runtime.sendMessage({event: 'noResults'});
        }
        else {
            let structuredResults = [];
            results[0]['result'].forEach(id => {
                structuredResults.push(documents[id]);
            });
            chrome.runtime.sendMessage({event: "resultsFound", documents: structuredResults});
        }
    }
});

function getVidId(tiktokUrl) {
    const regex = /(?<=\/(video|photo)\/)(.*?)(?=$|[^0-9])/;
    const vidId = regex.exec(tiktokUrl)[0];
    return vidId;
}

function extractUnixTimestamp(vidId) {
    const asBinary = BigInt(vidId).toString(2);
    const first31Chars = asBinary.slice(0, 31);
    const timestamp = parseInt(first31Chars, 2);
    return timestamp;
}

function unixTimestampToHumanDate(timestamp) {
    const milliseconds = timestamp * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toUTCString()+" (UTC)";
    return humanDateFormat;
}

function selectElementsBasedOnDropdown(selectedItem) {
    const elementMap = {
      'Posts': 'div[data-e2e="user-post-item"]',
      'Reposts': 'div[data-e2e="user-repost-item"]',
      'Liked': 'div[data-e2e="user-liked-item"]',
      'Favorites': 'div[data-e2e="favorites-item"]',
      'Collections': 'div[data-e2e="collection-item"]',
    };
    const querySelector = elementMap[selectedItem];
    const elements = document.querySelectorAll(querySelector);
    return elements
  }
