Schema.game = new SimpleSchema({

    dt: {
        type: Date,
        label: 'Дата создания',
        defaultValue: new Date
    },

    users: {
        type: [String],
        label: 'Уникальные идентификаторы играющих пользователей'
    }
});

Game = new Mongo.Collection('game');
Game.attachSchema(Schema.game);


Schema.game_Object = new SimpleSchema({
    user_id: {
        type: String,
        label: 'Уникальный идентификатор пользователя'
    },

    position: {
        type: [Number],
        label: 'Позиция персонажа'
    }
});
