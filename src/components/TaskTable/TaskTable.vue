<template>
    <div>
        <v-sheet theme="dark" class="pl-12">
           Total Time {{ formatTime(totalTime) }}
        </v-sheet>
        <v-table theme="dark">
            <thead>
            <tr>
                <th class="text-left">Task</th>
                <th class="text-left">Time</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="task in tasksStore.tasks" :key="task.id">
                <td>{{ task.name }}</td>
                <td>
                    <template v-if="currentlyEditing === task.id">
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="2">
                                    <v-text-field label="Hours" type="number" v-model="hours" min="0" max="24"/>
                                </v-col>
                                <v-col cols="12" sm="2">
                                    <v-text-field label="Minutes" type="number" v-model="minutes" min="0" max="59"/>
                                </v-col>
                                <v-col cols="12" sm="2">
                                    <v-text-field label="Seconds" type="number" v-model="seconds" min="0" max="59"/>
                                </v-col>
                                <v-col cols="12" sm="2">
                                    <v-btn
                                            class="ma-1"
                                            color="warning"
                                            @click="cancelEdit()"
                                            icon
                                    >
                                        <v-icon
                                                icon="mdi-cancel"
                                        ></v-icon>
                                    </v-btn>
                                    <v-btn
                                            class="ma-1"
                                            color="success"
                                            @click="saveEdit(task.id)"
                                            icon
                                    >
                                        <v-icon
                                                icon="mdi-check"
                                        ></v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>
                    <template v-else>
                        <template v-if="task.isRunning">
                            {{ formatTime(task.time, tasksStore.elapsedTime) }}
                        </template>
                        <template v-else>
                            {{ formatTime(task.time) }}
                        </template>
                    </template>
                </td>
                <td>
                    <v-btn
                            class="ma-1"
                            color="warning"
                            @click="stopTask(task.id)"
                            icon
                            v-if="task.isRunning"
                    >
                        <v-icon
                                icon="mdi-stop"
                        ></v-icon>
                    </v-btn>
                    <v-btn
                            class="ma-1"
                            color="green"
                            @click="startTask(task.id)"
                            icon
                            :disabled="tasksStore.elapsedTime !== 0 || (currentlyEditing !== null && currentlyEditing === task.id)"
                            v-else
                    >
                        <v-icon
                                icon="mdi-play"
                        ></v-icon>
                    </v-btn>
                    <v-btn
                            class="ma-1"
                            color="blue"
                            @click="editTask(task.id, task.time)"
                            icon
                            :disabled="(currentlyEditing !== null && currentlyEditing === task.id) || task.isRunning"
                    >
                        <v-icon
                                icon="mdi-pencil-outline"
                        ></v-icon>
                    </v-btn>
                    <v-btn
                            class="ma-1"
                            color="red"
                            @click="removeTask(task.id)"
                            icon
                    >
                        <v-icon
                                icon="mdi-trash-can-outline"
                        ></v-icon>
                    </v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import {useTasksStore} from "@/stores/tasks";
import {getHours, getMinutes, getSeconds, formatTime} from "@/stores/utils";
import {computed, onMounted, ref} from "vue";

const tasksStore = useTasksStore();
const currentlyEditing = ref(null);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const totalTime = computed(() => {
    return tasksStore.getTotalTime();
})

onMounted(() => {
    tasksStore.getTasks();
})

function cancelEdit() {
    this.currentlyEditing = null;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
}

function editTask(id, time) {
    this.hours = getHours(time);
    this.minutes = getMinutes(time);
    this.seconds = getSeconds(time);
    this.currentlyEditing = id;
}

async function saveEdit(id) {
    const time = this.hours * 3600 + this.minutes * 60 + parseInt(this.seconds, 10);

    await tasksStore.saveEdit(id, time);
    this.currentlyEditing = null;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    await tasksStore.getTasks();
}

async function startTask(id) {
    await tasksStore.startTask(id);
    await tasksStore.getTasks();
}

async function stopTask(id) {
    await tasksStore.stopTask(id);
    await tasksStore.getTasks();
}

async function removeTask(id) {
    await tasksStore.removeTask(id);
    await tasksStore.getTasks();
}

</script>
