Meteor.startup(function () {
    sAlert.config({
        effect: 'flip',
        position: 'top',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        offset: 0,
        beep: false,
        onClose: _.noop
    });

    Meteor.getDataFromTpl = function (struct) {

        let data = {};

        for (let key in struct) {

            let el = struct[key];

            if ( (_.isUndefined(el.notRequired) || !el.notRequired) && !el.val) {
                sAlert.error('Заполните поле "' + el.field + '"');
                return false;
            }

            data[key] = el.val;
        }

        return data;

    };
});