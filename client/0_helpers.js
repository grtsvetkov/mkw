Template.registerHelper('hasRole', function (r) {
    if (r !== undefined) {
        return Meteor.user() && Meteor.user().profile.role === r;
    } else {
        return Meteor.user();
    }
});

Template.registerHelper('userProfile', function (uID, params) {

    let p = (params ? ('profile.' + params) : 'profile').split('.'),
        prf = Meteor.users.findOne(uID);

    if (prf) {
        _.each(p, function (t) {
            prf = prf[t] || '';
        });
    }

    return prf;
});

Template.registerHelper('currentUserId', function () {
    return Meteor.userId();
});

Template.registerHelper('currentUser', function () {
    return Meteor.user();
});

Template.registerHelper('currentTemplate', function () {
    return Router.current() && Router.current().route.options;
});

Template.registerHelper('isActive', function (name) {
    return Router.current() && Router.current().route.options.name == name ? 'active' : '';
});

Template.registerHelper('timeAgo', function (dt, notUpdate) {
    if (notUpdate !== undefined && notUpdate != true) {
        Session.get('rightNow');
    }
    return moment(dt).fromNow();
});

Template.registerHelper('timeString', function (dt, withTime) {
    return moment(dt).format(withTime == true ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY');
});

Template.registerHelper('timeFormat', function (dt, format) {
    moment.updateLocale('ru', {
        months : ['Января', 'Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря']
    });
    return moment(dt).format(format);
});

Template.registerHelper('eq', function (op1, op2) {
    return op1 == op2;
});
Template.registerHelper('eqq', function (op1, op2) {
    return op1 === op2;
});
Template.registerHelper('not', function (op) {
    return !op;
});

Template.registerHelper('lt', function (op1, op2) {
    return op1 < op2;
});

Template.registerHelper('substr', function (str, start, length) {
    return str.substr(start, length);
});

Template.registerHelper('filesize', function (size) {
    let i = Math.floor(Math.log(size) / Math.log(1024));
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
});

Template.registerHelper('inArray', function (array, item) {
    return array && array.length && array.indexOf(item) != -1;
});

Template.registerHelper('notNull', function (a) {
    return a != undefined && ((typeof a == 'object') ? Object.keys(a).length > 0 : a != null && a != '');
});

Template.registerHelper('MathRound', function (a) {
    return Math.round(a);
});


var declension = function (val, one, two, five, notIncludeCount) {
    var number = Math.abs(val);
    number %= 100;
    if (number >= 5 && number <= 20) {
        return (notIncludeCount === true ? '' : val + ' ') + five;
    }
    number %= 10;
    if (number == 1) {
        return (notIncludeCount === true ? '' : val + ' ') + one;
    }
    if (number >= 2 && number <= 4) {
        return (notIncludeCount === true ? '' : val + ' ') + two;
    }
    return (notIncludeCount === true ? '' : val + ' ') + five;
};

Template.registerHelper('declension', function (number, one, two, five, notIncludeCount) {
    return declension(number, one, two, five, notIncludeCount);
});

Template.registerHelper('consoleLog', function (obj) {
    console.log(obj);
});