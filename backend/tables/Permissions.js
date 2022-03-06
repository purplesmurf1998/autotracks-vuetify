const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Roles",
    required: [true, 'Subject required.']
  },
  object: {
    type: String,
    enum: [
      'vehicle',
      'location',
      'dealership',
      'account',
      'vehicle_list',
      'vehicle_property',
      'vehicle_sale'
    ],
    required: [true, 'Object required.']
  },
  permissions: {
    type: [String],
    enum: [
      'create',
      'read',
      'update',
      'delete',
      'approve'
    ]
  },
});

module.exports = mongoose.model("Permissions", PermissionSchema);