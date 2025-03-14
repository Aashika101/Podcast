import { openDB } from 'idb';

export async function downloadPodcast(audioUrl: string, podcastId: string, podcastTitle: string, imageUrl: string, audioDuration: number) {
    try {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const db = await openDB('podcastDB', 1, {
            upgrade(db) {
                db.createObjectStore('podcasts');
            },
        });
        await db.put('podcasts', { blob, podcastTitle, imageUrl, audioDuration }, podcastId);
        console.log(`Podcast with ID ${podcastId} downloaded successfully.`);
    } catch (error) {
        console.error(`Error downloading podcast with ID ${podcastId}:`, error);
        throw error;
    }
}

export async function getDownloadedPodcast(podcastId: string) {
    const db = await openDB('podcastDB', 1);
    const podcast = await db.get('podcasts', podcastId);
    console.log(`Retrieved podcast with ID ${podcastId} from IndexedDB:`, podcast);
    return podcast;
}

export async function getAllDownloadedPodcasts() {
    const db = await openDB('podcastDB', 1);
    const allKeys = await db.getAllKeys('podcasts');
    const allPodcasts = await Promise.all(allKeys.map(async (key) => {
        const podcast = await db.get('podcasts', key);
        return { ...podcast, _id: key };
    }));
    console.log('Retrieved all downloaded podcasts from IndexedDB:', allPodcasts);
    return allPodcasts;
}

export async function deletePodcast(podcastId: string) {
    try {
        const db = await openDB('podcastDB', 1);
        await db.delete('podcasts', podcastId);
        console.log(`Podcast with ID ${podcastId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting podcast with ID ${podcastId}:`, error);
        throw error;
    }
}

