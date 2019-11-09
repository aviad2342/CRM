const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  images: [{ type: String }],
  creator: {
    id: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      userImage: { type: String, required: true }
    }
});

module.exports = mongoose.model('Album', albumSchema);
