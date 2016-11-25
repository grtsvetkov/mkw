let state = new ReactiveVar('Wait');

Template.pool.rendered = function() {
    Meteor.call('pool.getState', function(err, data){
        err ? sAlert.error(err.reason) : state.set(data);
    });
};

Template.pool.helpers({
   'state': function() {
       return state.get();
   } 
});

Template.pool.events({
    'click #accept': function() {
        Meteor.call('pool.accept', function(err, data){
            err ? sAlert.error(err.reason) : state.set(data);
        });
    },

    'click #game': function() {
        Meteor.call('pool.game', function(err, data){
            err ? sAlert.error(err.reason) : Router.go('gameLayout');
        });
    }
});