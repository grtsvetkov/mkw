PoolModel = {

    _get: function(user_id, other) {
        let pool = Pool.findOne({user_id: user_id});

        if(pool) {
            return pool;
        } else {

            if(other == 'create') {

                pool = {user_id: user_id, state: 'Wait', game: '0'};

                pool._id = Pool.insert(pool);

                return pool;
            } else if(other == 'error') {
                throw new Meteor.Error('500', 'Ошибка обработки очереди');
            }
        }

    },

    getState: function() {

        let pool = PoolModel._get(Meteor.userId(), 'create');

        console.log(pool);

        return 'accept';
    },
    
    accept: function() {

        let pool = PoolModel._get(Meteor.userId(), 'error');
        
        return 'game';
    },
    
    game: function() {

        let pool = PoolModel._get(Meteor.userId(), 'error');
        
        if(!pool.game || pool.game == 0) {

            let game = GameModel._create([Meteor.userId()]);
            
            Pool.update({user_id: Meteor.userId()}, {$set: {game: game}});
        }

        console.log(PoolModel._get(Meteor.userId(), 'error'));
        
        return '';
    }
};

/**
 * Методы Pool
 */
Meteor.methods({
    'pool.getState': PoolModel.getState,
    'pool.accept': PoolModel.accept,
    'pool.game': PoolModel.game
});