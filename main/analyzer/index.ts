import { spawn, Pool, Worker } from 'threads';

import db from '../db';
import getAppPath from '../../util/getAppPath';
import glob from 'glob-promise';

/**
 * Recursively finds all the sound files (mp3, wav, aif) in the given folder
 * @param folder
 * @returns an array of sound file names
 */
function getSoundFiles(folder: string) {
    return glob.promise(`${folder}/**/*.{mp3,wav,aif,flac}`);
}

/**
 * This function spawns a worker thread to analyze the given sound files
 * @param folder
 * @param callback called after each analysis
 */
export async function analyzeSounds(folder: string, callback: (data: AnalyzerMessage) => void) {
    console.log('spawning analyzer worker');

    const pool = Pool(() => spawn(new Worker(`${getAppPath()}/main/analyzer/worker`)), 8);

    (await getSoundFiles(folder)).forEach((filename) => {
        pool.queue(async (analyzer) => {
            try {
                const result = await analyzer.analyze(filename);
                await db.sounds.insert(result);
                callback({ result });
            } catch (error) {
                callback({ error, result: { filename } });
            }
        });
    });

    await pool.settled();
    callback({ done: true });
}
