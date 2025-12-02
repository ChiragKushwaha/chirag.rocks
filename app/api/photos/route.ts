import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ALBUM_URL =
      "https://photos.google.com/share/AF1QipNMPWE5PRakqLpSqtQBJz8XT9AcTI97vu-Uhhjnq7HbeWInhdQLFX7Ue6oXssZ1Aw?key=QU1JMmM1MkdWV0RHV29OY3picW9VcENhcUhHaklR";

    const response = await fetch(ALBUM_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        "Failed to fetch album from Google Photos: " + response.status
      );
    }

    const html = await response.text();

    // Extract the JSON blob for ds:1
    const regex =
      /AF_initDataCallback\({key: 'ds:1', hash: '[^']+', data:([\s\S]*?), sideChannel: {}}\);/m;
    const match = html.match(regex);

    if (!match || !match[1]) {
      console.error("Could not find AF_initDataCallback for ds:1");
      return NextResponse.json({ photos: [] });
    }

    const jsonString = match[1];
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON data", e);
      return NextResponse.json({ photos: [] });
    }

    // data[1] contains the list of photos
    const photoList = data[1];

    if (!Array.isArray(photoList)) {
      console.error("Unexpected data structure: photoList is not an array");
      return NextResponse.json({ photos: [] });
    }

    const photos = photoList
      .map((item: any) => {
        try {
          const id = item[0];
          const urlInfo = item[1];
          const baseUrl = urlInfo[0];
          const width = urlInfo[1];
          const height = urlInfo[2];
          const creationTime = item[2]; // Timestamp
          const description = item[3]; // Description/Caption

          // Extract Metadata if available
          // urlInfo[8][4] is [Make, Model, ...]
          let camera = null;
          const metadata = urlInfo[8];
          if (
            metadata &&
            Array.isArray(metadata) &&
            metadata[4] &&
            Array.isArray(metadata[4])
          ) {
            const make = metadata[4][0];
            const model = metadata[4][1];
            if (make || model) {
              camera = (make ? make + " " : "") + (model || "");
              camera = camera.trim();
            }
          }

          // Construct high-res URL
          const url = baseUrl + "=w1600-h1600-no";
          const thumbnail = baseUrl + "=w500-h500-c";

          return {
            id,
            url,
            thumbnail,
            originalUrl: baseUrl + "=d",
            width,
            height,
            creationTime,
            description,
            camera,
          };
        } catch (err) {
          console.warn("Error parsing individual photo item", err);
          return null;
        }
      })
      .filter((p: any) => p !== null);

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error scraping photos:", error);
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}
