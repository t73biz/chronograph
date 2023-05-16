<template>
    <v-card theme="dark">
        <v-card-text>
            <v-form>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="2">
                            <v-text-field density="compact" variant="outlined" label="Task" v-model="name" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-btn color="green" type="submit" @click.prevent="addTask">Add</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useTasksStore } from "@/stores/tasks";
import {ref} from "vue";
const tasksStore = useTasksStore();
const name = ref("");
const addTask = () => {
    if (name.value !== "") {
        tasksStore.addTask(name.value);
        tasksStore.getTasks();
    }
    name.value = "";
}
</script>

<style scoped>
.v-form {
  padding-top: 5px;
}
.v-card-text, .v-container {
  padding: 0;
}
</style>