Template.index.events({
    'submit #signin': function(e) {

        e.preventDefault();

        let data = Meteor.getDataFromTpl({
            email: {val: $('#email').val(), field: 'Email'},
            password: {val: $('#password').val(), field: 'Password'}
        });

        if(!data) {
            return false;
        }

        Meteor.loginWithPassword(data.email, data.password, function (err) {
            err ? sAlert.error(err.reason) : Router.go('dashboard');
        });

        return false;
    }
});