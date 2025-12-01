// macOS Clone Service Worker with Full Offline Support
// Version: 2.0.0

const CACHE_VERSION = 'macos-v2';
const API_CACHE = 'macos-api-cache-v2';
const STATIC_CACHE = 'macos-static-v2';
const IMAGE_CACHE = 'macos-images-v2';
const FONT_CACHE = 'macos-fonts-v2';

// Cache duration for API responses (30 minutes)
const API_CACHE_DURATION = 30 * 60 * 1000;

// Cache duration for images (7 days)
const IMAGE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

// API endpoints to cache
const CAC

HED_API_PATTERNS = [
    /news\.api/i,
    /music\.api/i,
    /tv\.api/i,
    /tmdb\.org/i,
    /news/i,
];

// OPFS Helper Functions
class OPFSHelper {
    static async getRoot() {
        return navigator.storage.getDirectory();
    }

    static async fileExists(path) {
        try {
            const root = await this.getRoot();
            const parts = path.split('/').filter(p => p);

            let current = root;
            for (let i = 0; i < parts.length - 1; i++) {
                current = await current.getDirectoryHandle(parts[i]);
            }

            const fileName = parts[parts.length - 1];
            await current.getFileHandle(fileName);
            return true;
        } catch {
            return false;
        }
    }

    static async readFile(path) {
        try {
            const root = await this.getRoot();
            const parts = path.split('/').filter(p => p);

            let current = root;
            for (let i = 0; i < parts.length - 1; i++) {
                current = await current.getDirectoryHandle(parts[i]);
            }

            const fileName = parts[parts.length - 1];
            const fileHandle = await current.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            return file;
        } catch (error) {
            console.error('OPFS read error:', error);
            return null;
        }
    }

    static async writeFile(path, data) {
        try {
            const root = await this.getRoot();
            const parts = path.split('/').filter(p => p);

            let current = root;
            for (let i = 0; i < parts.length - 1; i++) {
                current = await current.getDirectoryHandle(parts[i], { create: true });
            }

            const fileName = parts[parts.length - 1];
            const fileHandle = await current.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();
            return true;
        } catch (error) {
            console.error('OPFS write error:', error);
            return false;
        }
    }
}

// Cache Management
class CacheManager {
    static async isAPIResponse(url) {
        return CACHED_API_PATTERNS.some(pattern => pattern.test(url));
    }

    static async getCachedAPIResponse(request) {
        const cache = await caches.open(API_CACHE);
        const response = await cache.match(request);

        if (!response) return null;

        const cachedTime = response.headers.get('sw-cached-time');
        if (cachedTime) {
            const age = Date.now() - parseInt(cachedTime);
            if (age > API_CACHE_DURATION) {
                await cache.delete(request);
                return null;
            }
        }

        return response;
    }

    static async cacheAPIResponse(request, response) {
        const cache = await caches.open(API_CACHE);
        const clonedResponse = response.clone();
        const headers = new Headers(clonedResponse.headers);
        headers.set('sw-cached-time', Date.now().toString());

        const newResponse = new Response(clonedResponse.body, {
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
            headers: headers
        });

        await cache.put(request, newResponse);
    }

    static async clearExpiredCache() {
        const cache = await caches.open(API_CACHE);
        const requests = await cache.keys();

        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const cachedTime = response.headers.get('sw-cached-time');
                if (cachedTime && (Date.now() - parseInt(cachedTime) > API_CACHE_DURATION)) {
                    await cache.delete(request);
                }
            }
        }
    }

    static async invalidateAllCache() {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('All caches cleared');
    }
}

// Install Event
self.addEventListener('install', (event) => {
    console.log('SW v2.0: Installing with offline support...');

    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.addAll(['/'].filter(Boolean));
        }).then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    console.log('SW v2.0: Activating...');

    event.waitUntil(
        caches.keys().then(names => {
            return Promise.all(
                names.filter(name =>
                    name !== CACHE_VERSION &&
                    name !== API_CACHE &&
                    name !== STATIC_CACHE &&
                    name !== IMAGE_CACHE &&
                    name !== FONT_CACHE
                ).map(name => caches.delete(name))
            );
        }).then(() => CacheManager.clearExpiredCache())
            .then(() => self.clients.claim())
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith((async () => {
        try {
            // 1. OPFS Files (User files)
            if (url.pathname.startsWith('/Users/') || url.pathname.startsWith('/System/')) {
                if (await OPFSHelper.fileExists(url.pathname)) {
                    const file = await OPFSHelper.readFile(url.pathname);
                    if (file) {
                        return new Response(file, {
                            status: 200,
                            headers: {
                                'Content-Type': file.type || 'application/octet-stream',
                                'X-Served-From': 'OPFS'
                            }
                        });
                    }
                }
            }

            // 2. Fonts (OPFS First, then Cache First)
            if (url.pathname.match(/\.(woff2|woff|ttf|otf)$/i)) {
                // Check OPFS first (e.g., /System/Library/Fonts/SF-Pro.ttf)
                const opfsPath = url.pathname;
                if (await OPFSHelper.fileExists(opfsPath)) {
                    const file = await OPFSHelper.readFile(opfsPath);
                    if (file) {
                        console.log('SW: Serving font from OPFS:', opfsPath);
                        return new Response(file, {
                            status: 200,
                            headers: {
                                'Content-Type': file.type || 'font/ttf',
                                'X-Served-From': 'OPFS-Font'
                            }
                        });
                    }
                }

                // Fallback to regular cache
                const cache = await caches.open(FONT_CACHE);
                const cached = await cache.match(event.request);
                if (cached) return cached;

                const response = await fetch(event.request);
                if (response.ok) cache.put(event.request, response.clone());
                return response;
            }

            // 3. Images (OPFS First, then Cache First with TTL)
            if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
                // Check OPFS first (e.g., /Users/Guest/Pictures/photo.jpg)
                const opfsPath = url.pathname;
                if (await OPFSHelper.fileExists(opfsPath)) {
                    const file = await OPFSHelper.readFile(opfsPath);
                    if (file) {
                        console.log('SW: Serving image from OPFS:', opfsPath);
                        return new Response(file, {
                            status: 200,
                            headers: {
                                'Content-Type': file.type || 'image/jpeg',
                                'X-Served-From': 'OPFS-Image'
                            }
                        });
                    }
                }

                // Fallback to regular cache
                const cache = await caches.open(IMAGE_CACHE);
                const cached = await cache.match(event.request);

                if (cached) {
                    const time = cached.headers.get('sw-cached-time');
                    if (time && (Date.now() - parseInt(time) < IMAGE_CACHE_DURATION)) {
                        return cached;
                    }
                }

                try {
                    const response = await fetch(event.request);
                    if (response.ok) {
                        const headers = new Headers(response.headers);
                        headers.set('sw-cached-time', Date.now().toString());
                        const newResp = new Response(response.body, {
                            status: response.status,
                            statusText: response.statusText,
                            headers
                        });
                        cache.put(event.request, newResp.clone());
                        return newResp;
                    }
                } catch {
                    if (cached) return cached;
                }
            }

            // 4. API Caching
            if (await CacheManager.isAPIResponse(url.href)) {
                const cached = await CacheManager.getCachedAPIResponse(event.request);
                if (cached) return cached;

                try {
                    const response = await fetch(event.request);
                    if (response.ok) {
                        await CacheManager.cacheAPIResponse(event.request, response.clone());
                    }
                    return response;
                } catch {
                    const stale = await caches.match(event.request);
                    if (stale) return stale;
                    throw new Error('Network unavailable');
                }
            }

            // 5. Static Assets (Network First, Cache Fallback)
            if (url.pathname.startsWith('/_next/') || url.pathname.match(/\.(js|css)$/)) {
                try {
                    const response = await fetch(event.request);
                    if (response.ok) {
                        const cache = await caches.open(STATIC_CACHE);
                        cache.put(event.request, response.clone());
                    }
                    return response;
                } catch {
                    const cached = await caches.match(event.request);
                    if (cached) return cached;
                    throw new Error('Offline');
                }
            }

            // 6. HTML Pages (Network First with offline fallback)
            if (event.request.headers.get('accept')?.includes('text/html')) {
                try {
                    const response = await fetch(event.request);
                    if (response.ok) {
                        const cache = await caches.open(STATIC_CACHE);
                        cache.put(event.request, response.clone());
                    }
                    return response;
                } catch {
                    const cached = await caches.match(event.request);
                    if (cached) return cached;

                    // Return cached home page as fallback
                    const home = await caches.match('/');
                    if (home) return home;
                }
            }

            // 7. Default: Network
            return await fetch(event.request);

        } catch (error) {
            console.error('SW Fetch Error:', error);

            const cached = await caches.match(event.request);
            if (cached) return cached;

            if (event.request.headers.get('accept')?.includes('text/html')) {
                const home = await caches.match('/');
                if (home) return home;
            }

            return new Response('Offline - No cache available', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
    })());
});

// Messages
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data?.type === 'CLEAR_CACHE') {
        event.waitUntil(
            CacheManager.invalidateAllCache().then(() => {
                event.ports[0]?.postMessage({ success: true });
            })
        );
    }

    if (event.data?.type === 'CACHE_FILE') {
        const { path, data } = event.data;
        event.waitUntil(
            OPFSHelper.writeFile(path, data).then(success => {
                event.ports[0]?.postMessage({ success });
            })
        );
    }
});

// Cleanup - runs every 1 hour
setInterval(() => CacheManager.clearExpiredCache(), 60 * 60 * 1000);

console.log('SW v2.0: Loaded with full offline support ✅');
