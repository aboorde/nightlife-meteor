import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({

  callYelp: function(searchLocation) {
    try {
      var url = 'https://api.yelp.com/v3/businesses/search?term=bar&location=' + searchLocation;
      var response = HTTP.call("GET", url, {
          headers: {
              "Authorization": process.env.YELP_KEY,
          }
      });
      return response;
    } catch(e) {
      console.log("cannot get yelp data")
    }
  }

});