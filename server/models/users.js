UserModel = {

    /** Создание нового пользователя
     * @param {Object} data данные пользователя
     * @returns {*}
     */
    add: function (data) {

        if (!data.email && data.emails !== undefined && data.emails.length > 0) {
            data.email = data.emails[0].address;
        }

        if (!data.email) {
            throw new Meteor.Error('500', 'Не указан Email');
        }

        if (data.services == undefined && !data.password) {
            data.password = '123';//
            //throw new Meteor.Error(500, 'Не указан Пароль');
        }

        if (!data.profile.name) {
            throw new Meteor.Error('500', 'Не указано Имя');
        }

        data.status = {online: false};
        data.profile.status = 0;

        let result = {};

        switch (data.profile.role) {
            case 'Client':
                result.user_id = Accounts.createUser(data);
                break;

            case 'Admin':
                result.user_id = Accounts.createUser(data);
                break;

            default:
                throw new Meteor.Error('500', 'Указан неверный тип пользователя');
        }

        return result;
    }

};

/**
 * Методы Users
 */
Meteor.methods({
    'user.add': UserModel.add //Создание нового пользователя
});