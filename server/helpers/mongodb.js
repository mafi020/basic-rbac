const mongoose = require('mongoose');

module.exports = {
  connect: async url => {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
    } catch (err) {
      throw new Error(err);
    }
  },
};
