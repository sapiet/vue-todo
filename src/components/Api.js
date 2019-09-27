import Vue from 'vue';

const host = process.env.VUE_APP_API_HOST;

Vue.http.options.root = host;

class Api {
    async init(store) {
        Vue.http.interceptors.push(() => {
            store.dispatch('startRequesting');

            // return response callback
            return () => {
                store.dispatch('stopRequesting');
            };
        });

        await Vue.http.get(`${host}/routing`)
            .then(response => {
                window.Routing.setRoutingData(response.data)
            });
    }

    generateUrl(endpoint, parameters = {}) {
        return window.Routing.generate(endpoint, parameters).substr(1);
    }

    transformIRI(iri) {
        return iri.substr(1);
    }

    getTodos() {
        return Vue.http.get(this.generateUrl('api_todos_get_collection'));
    }

    addTodo(todo) {
        return Vue.http.post(this.generateUrl('api_todos_post_collection'), todo);
    }

    updateTodo(todo, data) {
        return Vue.http.put(this.transformIRI(todo['@id']), data);
    }
}

export default new Api
