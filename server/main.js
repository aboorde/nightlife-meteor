import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({

  callYelp: function() {
    try {
      var response = HTTP.call("GET", "https://api.yelp.com/v3/businesses/search", {
          headers: {
              "Authorization": "Bearer",
          }
      });
      return response;
    } catch(e) {
      console.log("cannot get yelp data")
    }
  }

});