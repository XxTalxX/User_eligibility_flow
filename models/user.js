const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  ID: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  eligibility_checked: {
    required: false,
    type: Boolean
  },
  eligibility_details: {
    blood_pressure: {type: Number, required: true},
    glucose: {type: Number, required: true},
    BMI: {type: Number, required: true},
    age: {type: Number, required: true}
  },
  resetToken: String,
  resetTokenExpiration: Date,
  eligible_devices: {
    items: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: false
        },
      }
    ]
  }
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.checkEligibleDevice = function(products) {

    const calculatedEligibilityScore = this.eligibility_details.blood_pressure*0.2 + this.eligibility_details.glucose*0.2
     + this.eligibility_details.BMI*0.1 + this.eligibility_details.age*0.1;

    const eligible_products = products.filter((device) => calculatedEligibilityScore >= device.eligibility_score);

    const updatedItems = [...eligible_products];
    const updatedEligibleDevices = {
      items: updatedItems
    };
    this.eligible_devices = updatedEligibleDevices;
    return this.save();
};


module.exports = mongoose.model('User', userSchema);

