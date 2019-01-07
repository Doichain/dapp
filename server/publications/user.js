Meteor.publish('users.user', function () {
  if (this.userId) {
    return Meteor.users.find({
      _id: this.userId
    }, {
      fields: {
        'emails': 1,
        'profile': 1,
        'services': 1
      }
    })
  } else {
    return this.ready()
  }
})
