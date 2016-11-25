if (Meteor.isClient) {

    ApplicationController = RouteController.extend({
        onBeforeAction: function () {
            if (!Meteor.userId() && this._layout._template == 'AppLayoutPrivate') {
                Router.go('index');

            } else if(Meteor.userId() && this._layout._template == 'AppLayoutPublic') {
                Router.go('dashboard');
            }

            if(this.ready()) {
                this.next();
            }
        },
        waitOn: function () {

            if(this._layout._template == 'AppLayoutPrivate') {
            }

            return false;
        }

    });

    Router.configure({
        layoutTemplate: 'AppLayoutPrivate', //AppLayout.html
        notFoundTemplate: 'Error404', //Error404.html
        loadingTemplate: 'Loading', //Loading.html
        controller: ApplicationController
    });

    Router.route('/', { //index
        name: 'index',
        layoutTemplate: 'AppLayoutPublic',

        waitOn: function () {
            return [
            ];
        }
    });

    Router.route('/dashboard/', {
        name: 'dashboard',

        action: function () {
            this.render('dashboard');
        },

        waitOn: function () {
            return [
            ];
        }
    });

    Router.route('/pool/', {
        name: 'pool',

        action: function () {
            this.render('pool');
        },

        waitOn: function () {
            return [
            ];
        }
    });

    Router.route('/game/', {
        name: 'gameLayout',

        action: function () {
            this.render('gameLayout');
        },

        waitOn: function () {
            return [
            ];
        }
    });
}
