if (Meteor.isServer) {

    Meteor.startup(function () {

        // Listen to incoming HTTP requests, can only be used on the server
        WebApp.rawConnectHandlers.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            return next();
        });

        //Изначальное заполнение БД
        if (Meteor.users.find().count() == 0) {

            let id = 0;

            //Создаем пользователя Клиент1
            _id = UserModel.add({
                emails: [{
                    address: 'client1@test.ru',
                    verified: true
                }],
                profile: {
                    name: 'Client 1',
                    role: 'Client'
                }
            });
            Meteor.users.update(_id, {$set: {"emails.0.verified": true}});

            //Создаем пользователя Клиент2
            _id = UserModel.add({
                emails: [{
                    address: 'client2@test.ru',
                    verified: true
                }],
                profile: {
                    name: 'Client 2',
                    role: 'Client'
                }
            });
            Meteor.users.update(_id, {$set: {"emails.0.verified": true}});
            
            //Создаем пользователя Администратор
            _id = UserModel.add({
                emails: [{
                    address: 'admin@test.ru',
                    verified: true
                }],
                profile: {
                    name: 'Test Admin',
                    role: 'Admin'
                }
            });
            Meteor.users.update(_id, {$set: {"emails.0.verified": true}});
        }
    })
}