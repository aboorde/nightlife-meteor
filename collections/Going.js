Going = new Mongo.Collection('going');

Going.allow({
    insert: function(userId, doc) {
        return !!userId;
    },
    update: function(userId, doc) {
        return !!userId;
    }
});


AttendingUser = new SimpleSchema({
    userId: {
        type: String,
        label: "User",
    },
    isAttending: {
        type: Boolean,
        defaultValue: true
    }
})

AttendingSchema = new SimpleSchema({
    barId: {
        type: String,
        label: "Bar"
    },
    attending: {
        type: [AttendingUser]
    }
});

Meteor.methods({
    removeUser: function(user, bar) {
        Going.update({'barId': bar}, { '$pull': {'attending': {'userId': user, 'isAttending': true} } }, {getAutoValues: false} )
    },
    addAttendingUser: function(user, bar) {
        Going.update( {'barId': bar}, { '$push': {'attending': {'userId': user, 'isAttending': true} } }, { getAutoValues: false } );
    },
    addBarAndUser: function(user, bar) {
        Going.insert({'barId': bar, 'attending': [ {'userId': user, 'isAttending': true} ] });
    }
});

Going.attachSchema(AttendingSchema);