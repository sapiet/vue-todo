import Vuex from 'vuex';
import Api from './Api';

const state = {
    requesting: false,
    todos: []
};

const getters = {
    requesting: state => state.requesting,
    todos: state => state.todos,
    all: state => state.todos,
    active: state => state.todos.filter(todo => !todo.completed),
    completed: state => state.todos.filter(todo => todo.completed),
    activeCount: () => getters.active(state).length,
    completedCount: () => getters.completed(state).length,
};

const mutations = {
    startRequesting: state => state.requesting = true,

    stopRequesting: state => state.requesting = false,

    loadTodos: (state, todos) => {
        state.todos = todos;
    },

    addTodo: (state, todo) => {
        state.todos.push(todo);
    },

    deleteTodo: (state, todo) => {
        state.todos.splice(state.todos.indexOf(todo), 1);
    },

    updateTodoState: (state, parameters) => {
        state.todos[state.todos.indexOf(parameters.todo)].completed = parameters.completed;
    },

    updateTodoName: (state, parameters) => {
        state.todos[state.todos.indexOf(parameters.todo)].name = parameters.name;
    }
};

const actions = {
    startRequesting: store => store.commit('startRequesting'),

    stopRequesting: store => store.commit('stopRequesting'),

    loadTodos: store => {
        Api.getTodos().then(response => {
            store.commit('loadTodos', response.data['hydra:member']);
        });
    },

    addTodo: (store, name) => {
        const todo = {
          name, completed: false
        };

        Api.addTodo(todo).then(response => store.commit('addTodo', response.data));
    },

    deleteTodo: (store, todo) => {
        Api.deleteTodo(todo).then();
        store.commit('deleteTodo', todo);
    },

    updateTodosStates: (store, completed) => {
        for (let todo of getters.todos(state)) {
            actions.updateTodoState(store, {todo, completed});
        }
    },

    updateTodoState: (store, parameters) => {
        Api.updateTodo(parameters.todo, {completed: parameters.completed}).then();
        store.commit('updateTodoState', parameters);
    },

    updateTodoName: (store, parameters) => {
        Api.updateTodo(parameters.todo, {name: parameters.name}).then();
        store.commit('updateTodoName', parameters);
    },

    deleteCompletedTodos: () => {
        for (let todo of getters.completed(state)) {
            actions.deleteTodo(store, todo);
        }
    }
};

let store =  new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    strict: true,
});

async function init() {
    await Api.init(store);
    actions.loadTodos(store);
}

init();

export default store;
