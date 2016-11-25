Schema.user_profile = new SimpleSchema({

    role: {
        type: String,
        label: 'Права пользователя',
        defaultValue: 'Client'

    },

    name: {
        type: String,
        label: 'Имя',
        min: 1,
        max: 50
    },

    image: {
        type: String,
        optional: true,
        label: 'Фотография'
    },

    status: {
        type: Number,
        label: 'Статус профиля'
    }
});

Schema.users = new SimpleSchema({

    username: {
        type: String,
        label: 'Никнэйм',
        regEx: /^[a-z0-9A-Z_]{3,15}$/,
        optional: true
    },
    emails: {
        type: [Object],
        label: 'E-mail адреса'
    },
    "emails.$.address": {
        type: String,
        label:'E-mail',
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean,
        label:'проверенный'
    },
    createdAt: {
        label: 'Дата регистации',
        type: Date
    },
    profile: {
        type: Schema.user_profile,
        label: 'Профиль пользователя',
        optional: true
    },
    services: {
        type: Object,
        label: 'Аккаунты соц. сетей',
        optional: true,
        blackbox: true
    },
    status: {
        type: Object,
        label: 'status',
        optional: true,
        blackbox: true
    }
});


Meteor.users.attachSchema(Schema.users);