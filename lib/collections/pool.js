Schema.pool = new SimpleSchema({

    user_id: {
        type: String,
        label: 'Уникальный индентификатор пользователя'
    },

    state: {
        type: String,
        label: 'Состояние в пуле'
    },
    
    game: {
        type: String,
        label: 'Уникальный идентификатор текущей игры'
    }
});

Pool = new Mongo.Collection('pool');
Pool.attachSchema(Schema.pool);