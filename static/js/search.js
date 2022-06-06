// This will be the object that will contain the Vue attributes
// and be used to initialize it.
// This is in main
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        proof: "Search Proof",
        company_rows: [],
        search_rows: [],
        search: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.search_company = function(){
        app.vue.search_rows = []
        for(let r in app.vue.company_rows){
            let row = app.vue.company_rows[r]

            if (app.fuzzy_match(row.company_name,app.vue.search) || app.fuzzy_match(row.company_symbol,app.vue.search)){
                app.vue.search_rows.push(row);
            }
        }
    }

    app.fuzzy_match = function(str1, str2){
        str1 = str1.toLowerCase()
        str2 = str2.toLowerCase()
        return str1.includes(str2) || str2.includes(str1)
    }

    // This contains all the methods
    app.methods = {
        search_company: app.search_company,
    };

    // This creates the Vue instance
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    app.init = () => {
        axios.get(search_data_url).then(function (response) {
            for(let r in response.data.company_rows){
                response.data.company_rows[r].url = company_url.concat("/".concat(response.data.company_rows[r].company_symbol));
                app.vue.company_rows.push(response.data.company_rows[r]);
                app.vue.search_rows.push(response.data.company_rows[r])
            }
        });
    };

    // Call to the initializer
    app.init();
};
// Initialize the app object
init(app);

