<template src="./todos.html"></template>
<style src="./todos.css"></style>

<script>
import Vue from 'vue'

export default {
    data() {
        return {
            filters: {
                all: {
                    code: 'all',
                    label: 'All',
                    filter: todos => todos
                },
                active: {
                    code: 'active',
                    label: 'Active',
                    filter: todos => todos.filter(todo => !todo.completed)
                },
                completed: {
                    code: 'completed',
                    label: 'Completed',
                    filter: todos => todos.filter(todo => todo.completed)
                }
            },
            todos: [
                {id: 1, name: 'Installer NodeJS', completed: true},
                {id: 2, name: 'Apprendre VueJS', completed: false}
            ],
            newTodo: '',
            selectedFilter: 'all',
            editingTodo: null,
            lastName: null
        }
    },
    directives: {
        focus(element, value) {
            if (value) {
                Vue.nextTick(() => element.focus())
            }
        }
    },
    computed: {
        remaining() {
            return this.filters.active.filter(this.todos).length
        },

        filteredTodos() {
            return this.filters[this.selectedFilter].filter(this.todos)
        },

        allDone: {
            get() {
                return this.remaining === 0
            },

            set(value) {
                this.todos.map(todo => todo.completed = value)
            }
        },

        hasTodos() {
            return this.todos.length > 0
        },

        hasCompletedTodos() {
            return this.filters.completed.filter(this.todos).length > 0;
        }
    },
    methods: {
        addTodo() {
            this.todos.push({
                name: this.newTodo,
                completed: false
            });

            this.newTodo = '';
        },

        deleteTodo(todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        },

        deleteCompletedTodos() {
            for (let todo of this.filters.completed.filter(this.todos)) {
                this.todos.splice(this.todos.indexOf(todo), 1)
            }
        },

        startEditing(todo) {
            this.lastName = todo.name;
            this.editingTodo = todo
        },

        stopEditing() {
            this.lastName = null;
            this.editingTodo = null
        },

        cancelEditing() {
            this.editingTodo.name = this.lastName;
            this.stopEditing()
        },

        applyFilter(filter) {
            this.selectedFilter = filter;
        }
    }
}
</script>
