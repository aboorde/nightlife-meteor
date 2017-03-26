Template.SearchBars.onCreated(function () {
    if (window.location.search.substring(0,3) === "?q=") {
        var previousSearch = window.location.search.substr(window.location.search.indexOf("q=") + 2);
        Session.set('searchTerm', previousSearch);
        Meteor.call('callYelp', previousSearch, function(err, res) {
            var attending = {};
            var attendingData = [];
            var barIdList = [];
            res.data.businesses.forEach(function(business) {
                barIdList.push(business.id);
                business.image_url = business.image_url.replace('o.jpg', 'ms.jpg');
            });
            attending = Going.find({barId: {$in:barIdList}}).forEach(function(doc) { attendingData.push(doc) });

            res.data.businesses.forEach(function(business, i) {
                if (attendingData.filter(function(obj) { return obj.barId === business.id; }).length > 0) {
                    business.attending = attendingData.filter(function(obj) { return obj.barId === business.id; })[0].attending.length;
                } else {
                    business.attending = 0;
                }
            Session.set("searchResults", res.data.businesses);    
                
            });
        });
    }
    Session.set("userId", "User4");
    var self = this;
    self.autorun(function() {
        self.subscribe('attending');
    });
});

Template.SearchBars.helpers({
    searchTerm: () => {
        return Session.get("searchTerm");
    },
    searchResults: () => {
        return Session.get("searchResults");
    },
    getUserId: () => {
        return Session.get("userId");
    }
})

Template.SearchBars.events({
    'submit .search-bars-form': function(event, template) {
        event.preventDefault();
        var searchText = event.target.text.value;
        var attending = {};
        var attendingData = [];
        var barIdList = [];
        Session.set("searchTerm", searchText);
        Meteor.call('callYelp', searchText, function(err, res) {
            res.data.businesses.forEach(function(business) {
                barIdList.push(business.id);
                business.image_url = business.image_url.replace('o.jpg', 'ms.jpg');
            });
            attending = Going.find({barId: {$in:barIdList}}).forEach(function(doc) { attendingData.push(doc) });

            res.data.businesses.forEach(function(business, i) {
                if (attendingData.filter(function(obj) { return obj.barId === business.id; }).length > 0) {
                    business.attending = attendingData.filter(function(obj) { return obj.barId === business.id; })[0].attending.length;
                } else {
                    business.attending = 0;
                }
            Session.set("searchResults", res.data.businesses);    
                
            });
        });
        FlowRouter.setQueryParams({q: searchText});
    },
    'click .btn-attend': function(event, template) {
        event.preventDefault();
        var that = this;
        var currentlyAttending = false;

        if(Meteor.userId()) {
            console.log("There is a real user");
        
            console.log(Going.findOne({barId: this.id}))
            if (Going.findOne({barId: this.id})) {
                Going.findOne({barId: this.id}).attending.forEach(function(user) {
                    if(user.userId === Meteor.userId()) {
                        currentlyAttending = true;
                    }
                });

                if(currentlyAttending) {
                    Meteor.call('removeUser', Meteor.userId(), this.id);
                    var temp = Session.get('searchResults');
                    temp.forEach(function(obj) {
                        if(obj.id === that.id) {
                            obj.attending--;
                        }
                    });
                    Session.set('searchResults', temp);
                } else {
                    Meteor.call('addAttendingUser', Meteor.userId(), this.id);
                    var temp = Session.get('searchResults');
                    temp.forEach(function(obj) {
                        if(obj.id === that.id) {
                            obj.attending++;
                        }
                    });
                    Session.set('searchResults', temp);
                }
            } else {
                // Add bar with user
                Meteor.call('addBarAndUser', Meteor.userId(), this.id);
                var temp = Session.get('searchResults');
                temp.forEach(function(obj) {
                    if(obj.id === that.id) {
                        obj.attending++;
                    }
                });
                Session.set('searchResults', temp);
            }

        } else {
            console.log(" Ya fucked up ")
            $('#myModal').modal('toggle')
        }

    }
})