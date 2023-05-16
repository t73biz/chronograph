import { openDB } from 'idb';
const STORE_NAME = 'tasks';
async function setupDB() {
    return await openDB('time-tracker', 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, { autoIncrement: true });
        },
    });
}

export async function addTask(value) {
    const db = await setupDB();
    return db.add(STORE_NAME, value);
}

export async function getTask(key) {
    const db = await setupDB();
    return await db.get(STORE_NAME, key);
}

export async function getTasks() {
    const db = await setupDB();
    const tasks = [];
    const tx = db.transaction(STORE_NAME);
    const store = tx.objectStore(STORE_NAME);

    await store.openCursor().then(function cursorIterate(cursor) {
        if (!cursor) return;

        tasks.push({
            id: cursor.key,
            isRunning: cursor.value.isRunning,
            name: cursor.value.name,
            time: cursor.value.time,
        });
        cursor.continue().then(cursorIterate);
    });

    await tx.done;
    return tasks;
}

export async function editTask(key, time) {
    const db = await setupDB();
    const task = await db.get(STORE_NAME, key);
    if (!task) return;
    return await db.put(STORE_NAME, { ...task, time: time }, key);
}

export async function startTask(key) {
    const db = await setupDB();
    const task = await db.get(STORE_NAME, key);
    if (!task) return;
    if (task.isRunning) return;
    let startTime = Math.floor(Date.now() / 1000);
    await db.put(STORE_NAME, { ...task, isRunning: true, startTime: startTime }, key);
    return task;
}

export async function stopTask(key) {
    const db = await setupDB();
    const task = await db.get(STORE_NAME, key);
    if (!task) return;
    if (!task.isRunning) return;
    const currentTime = task.time;
    let calculatedTime = Math.floor(Date.now() / 1000) - task.startTime;
    return await db.put(STORE_NAME, { ...task, isRunning: false, time: currentTime + calculatedTime, startTime: 0 }, key);
}

export async function removeTask(key) {
    const db = await setupDB();
    return await db.delete(STORE_NAME, key);
}
