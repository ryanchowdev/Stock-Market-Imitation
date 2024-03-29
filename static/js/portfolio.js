// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        holdings : [],
        user_info : {},
        editing : false,
        profile_fn : "",
        profile_ln : "",
        filename : "No file selected",
        file_url : null,
        transactions : [],
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.get_holdings = function() {
        axios.get(get_holdings_url, {}).then(function(r) {
            app.vue.holdings = r.data.holdings;
        });
    }

    app.get_user_info = function() {
        axios.get(get_user_info_url).then(function(r) {
            app.vue.user_info = r.data;
            app.vue.profile_fn = r.data.first_name;
            app.vue.profile_ln = r.data.last_name;
        });
    }

    app.to_company = function(id) {
        window.location.href = "../company/" + id;
    }

    app.update_user_profile = function() {
        axios.post(update_user_profile_url, {
            first_name : app.vue.profile_fn,
            last_name : app.vue.profile_ln,
            pfp : app.vue.file_url
        }).then(function(r) {
            app.vue.user_info.first_name = app.vue.profile_fn;
            app.vue.user_info.last_name = app.vue.profile_ln;
            app.vue.editing = false;
            if (app.vue.file_url != null) {
                app.vue.user_info.pfp = app.vue.file_url;
                document.getElementById("pfp_upload").value = null;
                app.vue.filename = "No file selected";
                app.vue.file_url = null;
            }
        });
    }

    app.cancel_profile_edit = function() {
        app.vue.editing = false;
        app.vue.profile_fn = app.vue.user_info.first_name;
        app.vue.profile_ln = app.vue.user_info.last_name;
        document.getElementById("pfp_upload").value = null;
        app.vue.filename = "No file selected";
        app.vue.file_url = null;
    }

    app.upload_pfp = function(event) {
        let file = event.target.files[0];
        app.vue.filename = file.name;
        let reader = new FileReader()
        reader.addEventListener("load", function() {
            app.vue.file_url = reader.result;
        });
        reader.readAsDataURL(file);
    }

    app.load_net_worth = function() {
        axios.post(get_net_worth_url).then(function(r) {
            plotter.plot_stock_history(r.data.dates, r.data.history, "performance_chart", "")
        });
    };

    app.get_transactions = function() {
        axios.post(get_transactions_url).then(function(r) {
            app.vue.transactions = r.data.transactions;
        });
    };

    // This contains all the methods
    app.methods = {
        get_holdings : app.get_holdings,
        get_user_info : app.get_user_info,
        to_company : app.to_company,
        update_user_profile : app.update_user_profile,
        cancel_profile_edit : app.cancel_profile_edit,
        upload_pfp : app.upload_pfp,
        load_net_worth : app.load_net_worth,
        get_transactions : app.get_transactions,
    };

    // This creates the Vue instance
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    app.init = () => {
        app.get_holdings();
        app.get_user_info();
        app.get_transactions();
        google.charts.setOnLoadCallback(app.load_net_worth);
    };

    // Call to the initializer
    app.init();
};

let plotter = new Plotter();
// Initialize the app object
init(app);

