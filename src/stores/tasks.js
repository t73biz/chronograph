import { defineStore } from 'pinia'
import {getTask, getTasks, addTask, removeTask, startTask, stopTask, editTask} from './db';

export const useTasksStore = defineStore('tasks', {
    state: () => {
        return {
            elapsedTime: 0,
            tasks: [],
            timer: null
        }
    },
    actions: {
        async addTask(name) {
            return await addTask( {
                name: name,
                time: 0,
                isRunning: false,
                startTime: 0,
            });
        },
        getTotalTime() {
            let total = 0;
            this.tasks.forEach(task => {
                total += task.time;
            })
            return total;
        },
        async getTasks() {
            const tasks = await getTasks();
            this.tasks = [];
            if(tasks) {
                this.tasks = tasks;
            }
        },
        async removeTask(id) {
            return await removeTask(id);
        },
        async saveEdit(id, time) {
            return await editTask(id, time);
        },
        async startTask(id) {
            if (this.timer !== null) return; // Prevent multiple timers
            await startTask(id).then(() => {
                this.timer = setInterval(() => {
                    getTask(id).then((task) => {
                        let timeNow = Math.floor(Date.now() / 1000);
                        this.elapsedTime = timeNow - task.startTime;
                    });

                }, 1000);

            });
        },
        async stopTask(id) {
            clearInterval(this.timer);
            this.timer = null;
            this.elapsedTime = 0;
            return await stopTask(id);
        }
    },
})