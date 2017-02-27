Template.SearchBars.events({
    'submit .search-bars-form': function(event, template) {
        event.preventDefault();
        var searchText = event.target.text.value;
        Meteor.call('callYelp', searchText, function(err, res) {
            console.log(res);
        });
        
    }
})