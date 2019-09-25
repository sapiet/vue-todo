<template src="./Todos.html"></template>
<style src="./Todos.css"></style>

<script>
import Vue from 'vue'
import store from './TodosStore';
import Vuex from 'vuex';

export default {
    store: store,
    data() {
        return {
            filters: {
                all: {code: 'all', label: 'All'},
                active: {code: 'active', label: 'Active'},
                completed: {code: 'completed', label: 'Completed'}
            },
            newTodo: '',
            selectedFilter: 'all',
            editingTodo: null,
            editingName: null
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
        ...Vuex.mapGetters([
            'requesting',
            'todos',
            'all',
            'active',
            'completed',
            'activeCount',
            'completedCount',
        ]),

        allDone: {
            get() {
                return this.activeCount === 0
            },

            set(value) {
                store.dispatch('updateTodosStates', value);
            }
        },

        filteredTodos() {
            return this[this.selectedFilter];
        },
    },
    methods: {
        ...Vuex.mapActions({
            addTodoStore: 'addTodo',
            deleteTodoStore: 'deleteTodo',
            updateTodoStateStore: 'updateTodoState',
            updateTodoNameStore: 'updateTodoName',
            deleteCompletedTodosStore: 'deleteCompletedTodos'
        }),

        updateTodoState(event, todo) {
            this.updateTodoStateStore({todo, completed: event.target.checked});
        },

        addTodo() {
            this.addTodoStore(this.newTodo);
            this.newTodo = '';
        },

        deleteTodo(todo) {
            if (confirm(`You are going to delete "${todo.name}", Are you sure ?`)) {
                this.deleteTodoStore(todo);
            }
        },

        deleteCompletedTodos() {
            if (confirm(`You are going to delete ${this.completedCount} completed todos, Are you sure ?`)) {
                this.deleteCompletedTodosStore();
            }
        },

        startEditing(todo) {
            this.editingName = todo.name;
            this.editingTodo = todo;
        },

        stopEditing() {
            this.updateTodoNameStore({todo: this.editingTodo, name: this.editingName});
            this.cancelEditing();
        },

        cancelEditing() {
            this.editingName = null;
            this.editingTodo = null;
        },

        applyFilter(filter) {
            this.selectedFilter = filter;
        }
    }
}
</script>
