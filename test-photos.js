import https from 'https';

const ALBUM_URL = 'https://photos.app.goo.gl/8thR6dvU5AtsQUMb8';

https.get(ALBUM_URL, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
        console.log('Redirecting to:', res.headers.location);
        if (res.headers.location) {
            https.get(res.headers.location, (res2) => {
                let data = '';
                res2.on('data', (chunk) => data += chunk);
                res2.on('end', () => {
                    console.log('Data length:', data.length);
                    // Try to find image URLs
                    const regex = /"(https:\/\/lh3\.googleusercontent\.com\/[^"]+)"/g;
                    const matches = [];
                    let match;
                    while ((match = regex.exec(data)) !== null) {
                        if (match[1].length > 80) { // Filter out short/irrelevant ones
                            matches.push(match[1]);
                        }
                    }
                    console.log('Found unique images:', [...new Set(matches)].slice(0, 5));
                });
            });
        }
    } else {
        console.log('Status:', res.statusCode);
    }
}).on('error', (e) => {
    console.error(e);
});
