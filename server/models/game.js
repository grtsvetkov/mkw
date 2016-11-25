GameModel = {

    _create: function (users) {

        let game = Game.insert({users: users});

        let object = new Mongo.Collection('game_object_' + game);
        object.attachSchema(Schema.game_Object);

        _.each(users, function(u){
            GameModel._createPlayer(u, object);
        });

        return game;
    },

    _createPlayer: function (user_id, game_object) {
        game_object.insert({user_id: Meteor.userId(), position: [0,0,0]});
    },
    
    _destroy: function(_id) {
        new Mongo.Collection('game_object_' + _id).rawCollection().drop();
    },


    get: function() {
        let game = Game.findOne({users: Meteor.userId()});

        if(game) {
            return game;
        }

        throw new Meteor.Error('500', 'Ошибка инициализации игры');
    }
};

/**
 * Методы Game
 */
Meteor.methods({
    'game.get': GameModel.get
});