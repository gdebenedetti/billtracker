var mongoose = require('mongoose')
var Schema = mongoose.Schema

var options = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
}

var politicianSchema = new Schema({
  name: String,
  lastname: String,
  bio: String,
  pictureURL: String,
  appoinment: String,
  party: String,
  social: Schema.Types.Mixed,
  jurisdiction: { type: Schema.Types.ObjectId, ref: 'Jurisdiction' }
}, options)

politicianSchema.virtual('fullname').get(function () {
  return this.name + ' ' + this.lastname
})

module.exports = mongoose.model('Politician', politicianSchema)
