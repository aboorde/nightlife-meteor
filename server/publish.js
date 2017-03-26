Meteor.publish('attending', function() {
    return Going.find({});
});
