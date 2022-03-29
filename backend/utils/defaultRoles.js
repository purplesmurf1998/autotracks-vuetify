exports.getTempRoles = (dealership) => {
  return [
    {
      dealership: dealership._id.toString(),
      title: 'Administration',
      permissions: [
        {
          resource: 'vehicle',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'location',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'account',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_list',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_property',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_sale',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true,
            approve: true
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        }
      ]
    },
    {
      dealership: dealership._id,
      title: 'Management',
      permissions: [
        {
          resource: 'vehicle',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'location',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        },
        {
          resource: 'account',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'vehicle_list',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_property',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'vehicle_sale',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false,
            approve: true
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        }
      ]
    },
    {
      dealership: dealership._id,
      title: 'Sales Rep',
      permissions: [
        {
          resource: 'vehicle',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'location',
          policy: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        },
        {
          resource: 'account',
          policy: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        },
        {
          resource: 'vehicle_list',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_property',
          policy: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        },
        {
          resource: 'vehicle_sale',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true,
            approve: false
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        }
      ]
    },
    {
      dealership: dealership._id,
      title: 'Sales Rep +',
      permissions: [
        {
          resource: 'vehicle',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'location',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        },
        {
          resource: 'account',
          policy: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        },
        {
          resource: 'vehicle_list',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'vehicle_property',
          policy: {
            create: false,
            read: true,
            update: true,
            delete: false
          }
        },
        {
          resource: 'vehicle_sale',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true,
            approve: false
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        }
      ]
    },
    {
      dealership: dealership._id,
      title: 'Reception',
      permissions:[
        {
          resource: 'vehicle',
          policy: {
            create: true,
            read: true,
            update: true,
            delete: true
          }
        },
        {
          resource: 'location',
          policy: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        },
        {
          resource: 'account',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        },
        {
          resource: 'vehicle_list',
          policy: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        },
        {
          resource: 'vehicle_property',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        },
        {
          resource: 'vehicle_sale',
          policy: {
            create: false,
            read: false,
            update: false,
            delete: false
          }
        },
        {
          resource: 'dealership',
          policy: {
            create: false,
            read: true,
            update: false,
            delete: false
          }
        }
      ]
    }
  ];
}