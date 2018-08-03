module.exports = {
  'definitions': {
    'message': {
      'description': 'This API allows you to send, access, and delete mesages programmatically.',
      'links': [{
        'description': 'Returns a single message in JSON format. To get full MIME message set MIME to true',
        'href': '/messages/{message}',
        'method': 'GET',
        'title': 'info',
        'properties': {
          'MIME': {
            'type': 'boolean'
          }
        }
      },
      {
        'description': 'Sends a message by assembling it from the components.',
        'href': '/messages',
        'method': 'POST',
        'title': 'send',
        'properties': {
          'from': {
            'type': 'string'
          }
        },
        'required': ['from']
      },
      {
        'description': 'Sends a message in MIME format.',
        'href': '/messages.mime',
        'method': 'POST',
        'title': 'send-mime',
        'properties': {
          'message': {
            'type': ['string', 'object']
          }
        }
      },
      {
        'description': 'To delete an inbound message that has been stored via the store() action.',
        'href': '/messages/{message}',
        'method': 'DELETE',
        'title': 'delete'
      }
      ]
    },
    'domain': {
      'description': 'This API allows you to create, access, and validate domains programmatically.',
      'links': [{
        'description': 'Returns a list of domains under your account in JSON.',
        'href': '/domains',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          }
        }
      },
      {
        'description': 'Returns a single domain, including credentials and DNS records.',
        'href': '/domains/{domain}',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Create a new domain.',
        'href': '/domains',
        'method': 'POST',
        'title': 'create',
        'properties': {
          'name': {
            'type': 'string'
          },
          'wildcard': {
            'type': 'boolean'
          }
        },
        'required': ['name']
      },
      {
        'description': 'Delete a domain from your account.',
        'href': '/domains/{domain}',
        'method': 'DELETE',
        'title': 'delete'
      },
      {
        'description': 'Verifies and returns a single domain, including credentials and DNS records.',
        'href': '/domains/{domain}/verify',
        'method': 'PUT',
        'title': 'verify'
      }
      ]
    },
    'credentials': {
      'description': 'Programmatically get and modify domain credentials.',
      'links': [{
        'description': 'Returns a list of SMTP credentials for the defined domain.',
        'href': '/domains/{domain}/credentials',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          }
        }
      },
      {
        'description': 'Creates a new set of SMTP credentials for the defined domain.',
        'href': '/domains/{domain}/credentials',
        'method': 'POST',
        'title': 'create',
        'properties': {
          'login': {
            'type': 'string'
          },
          'password': {
            'type': 'string'
          }
        },
        'required': ['login', 'password']
      },
      {
        'description': 'Updates the specified SMTP credentials. Currently only the password can be changed.',
        'href': '/domains/{domain}/credentials/{login}',
        'method': 'PUT',
        'title': 'update',
        'properties': {
          'password': {
            'type': 'string'
          }
        },
        'required': ['password']
      },
      {
        'description': 'Deletes the defined SMTP credentials.',
        'href': '/domains/{domain}/credentials/{login}',
        'method': 'DELETE',
        'title': 'delete'
      }
      ]
    },
    'complaints': {
      'description': 'This API allows you to programmatically download the list of users who have complained, add a complaint, or delete a complaint.',
      'links': [{
        'description': 'Fetches the list of complaints.',
        'href': '/complaints',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          }
        }
      },
      {
        'description': 'Adds an address to the complaints table.',
        'href': '/complaints',
        'method': 'POST',
        'title': 'create',
        'properties': {
          'address': {
            'type': 'string'
          }
        },
        'required': ['address']
      },
      {
        'description': 'Fetches a single spam complaint by a given email address.',
        'href': '/complaints/{address}',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Removes a given spam complaint.',
        'href': '/complaints/{address}',
        'method': 'DELETE',
        'title': 'delete'
      }
      ]
    },
    'unsubscribes': {
      'description': 'This API allows you to programmatically download the list of recipients who have unsubscribed from your emails. You can also programmatically “clear” the unsubscribe event.',
      'links': [{
        'description': 'Fetches the list of unsubscribes.',
        'href': '/unsubscribes',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          }
        }
      },
      {
        'description': 'Retreives a single unsubscribe record.',
        'href': '/unsubscribes/{address}',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Removes an address from the unsubscribes table.',
        'href': '/unsubscribes/{address}',
        'method': 'DELETE',
        'title': 'delete'
      },
      {
        'description': 'Adds address to unsubscribed table.',
        'href': '/unsubscribes',
        'method': 'POST',
        'title': 'create'
      }
      ]
    },
    'bounces': {
      'description': 'Mailgun automatically handles bounced emails. The list of bounced addresses can be accessed programmatically.',
      'links': [{
        'description': 'Fetches the list of bounces.',
        'href': '/bounces',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          }
        }
      },
      {
        'description': 'Fetches a single bounce event by a given email address.',
        'href': '/bounces/{address}',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Clears a given bounce event.',
        'href': '/bounces/{address}',
        'method': 'DELETE',
        'title': 'delete'
      },
      {
        'description': 'Adds a permanent bounce to the bounces table. Updates the existing record if already here.',
        'href': '/bounces',
        'method': 'POST',
        'title': 'create',
        'properties': {
          'address': {
            'type': 'string'
          },
          'code': {
            'type': 'number'
          },
          'error': {
            'type': 'string'
          }
        },
        'required': ['address']
      }
      ]
    },
    'routes': {
      'description': 'Mailgun Routes are a powerful way to handle the incoming traffic. This API allows you to work with routes programmatically.',
      'links': [{
        'description': 'Fetches the list of routes.',
        'href': '/routes',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          }
        }
      },
      {
        'description': 'Returns a single route object based on its ID.',
        'href': '/routes/{id}',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Creates a new route.',
        'href': '/routes',
        'method': 'POST',
        'title': 'create',
        'properties': {
          'limit': {
            'priority': 'number'
          },
          'description': {
            'type': 'string'
          },
          'expression': {
            'type': 'string'
          }
        },
        'required': ['expression']
      },
      {
        'description': 'Updates a given route by ID.',
        'href': '/routes/{id}',
        'method': 'PUT',
        'title': 'update',
        'properties': {
          'limit': {
            'priority': 'number'
          },
          'description': {
            'type': 'string'
          },
          'expression': {
            'type': 'string'
          }
        }
      },
      {
        'description': 'Deletes a route based on the id.',
        'href': '/routes/{id}',
        'method': 'DELETE',
        'title': 'delete'
      }
      ]
    },
    'list': {
      'description': 'You can programmatically work with mailing lists and mailing list members using Mailgun Mailing List API.',
      'links': [{
        'description': 'Returns a list of mailing lists under your account.',
        'href': '/lists',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'address': {
            'type': 'string'
          },
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          }
        }
      },
      {
        'description': 'Returns a single mailing list by a given address.',
        'href': '/lists/{address}',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Creates a new mailing list.',
        'href': '/lists',
        'method': 'POST',
        'title': 'create',
        'properties': {
          'address': {
            'type': 'string'
          },
          'name': {
            'type': 'string'
          },
          'description': {
            'type': 'string'
          },
          'access_level': {
            'type': 'string'
          }
        },
        'required': ['address']
      },
      {
        'description': 'Update mailing list properties, such as address, description or name.',
        'href': '/lists/{address}',
        'method': 'PUT',
        'title': 'update',
        'properties': {
          'address': {
            'type': 'string'
          },
          'name': {
            'type': 'string'
          },
          'description': {
            'type': 'string'
          },
          'access_level': {
            'type': 'string'
          }
        }
      },
      {
        'description': 'Deletes a mailing list.',
        'href': '/lists/{address}',
        'method': 'DELETE',
        'title': 'delete'
      }
      ]
    },
    'members': {
      'description': 'Programatically work with mailing lists members.',
      'links': [{
        'description': 'Fetches the list of mailing list members.',
        'href': '/lists/{address}/members',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'subscribed': {
            'type': 'boolean'
          },
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          }
        }
      },
      {
        'description': 'Paginate over list members in the given mailing list',
        'href': '/lists/{address}/members/pages',
        'method': 'GET',
        'title': 'page',
        'properties': {
          'subscribed': {
            'type': 'boolean'
          },
          'limit': {
            'type': 'number'
          },
          'page': {
            'type': 'string'
          },
          'address': {
            'type': 'string'
          }
        }
      },
      {
        'description': 'Retrieves a mailing list member.',
        'href': '/lists/{address}/members/{member_address}',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Adds a member to the mailing list.',
        'href': '/lists/{address}/members',
        'method': 'POST',
        'title': 'create',
        'properties': {
          'address': {
            'type': 'string'
          },
          'name': {
            'type': 'string'
          },
          'vars': {
            'type': 'object'
          },
          'subscribed': {
            'type': 'boolean'
          },
          'upsert': {
            'type': 'string'
          }
        },
        'required': ['address']
      },
      {
        'description': 'Adds multiple members, up to 1,000 per call, to a Mailing List.',
        'href': '/lists/{address}/members.json',
        'method': 'POST',
        'title': 'add',
        'properties': {
          'members': {
            'type': 'array'
          },
          'upsert': {
            'type': 'boolean'
          }
        },
        'required': ['members']
      },
      {
        'description': 'Updates a mailing list member with given properties.',
        'href': '/lists/{address}/members/{member_address}',
        'method': 'PUT',
        'title': 'update',
        'properties': {
          'address': {
            'type': 'string'
          },
          'name': {
            'type': 'string'
          },
          'vars': {
            'type': 'object'
          },
          'subscribed': {
            'type': 'string'
          }
        }
      },
      {
        'description': 'Delete a mailing list member.',
        'href': '/lists/{address}/members/{member_address}',
        'method': 'DELETE',
        'title': 'delete'
      }
      ]
    },
    'stats': {
      'description': 'Various data and event statistics for you mailgun account. See http://documentation.mailgun.com/api-stats.html',
      'links': [{
        'description': 'Returns a list of event stat items. Each record represents counts for one event per one day.',
        'href': '/stats',
        'method': 'GET',
        'title': 'list',
        'properties': {
          'limit': {
            'type': 'number'
          },
          'skip': {
            'type': 'number'
          },
          'start-date': {
            'type': 'string'
          }
        }
      }]
    },
    'tags': {
      'description': 'Deletes all counters for particular tag and the tag itself. See http://documentation.mailgun.com/api-stats.html',
      'links': [{
        'description': 'List all tags.',
        'href': '/tags',
        'method': 'GET',
        'title': 'list'
      },
      {
        'description': 'Gets a specific tag.',
        'href': '/tags/{tag}',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Returns statistics for a given tag.',
        'href': '/tags/{tag}/stats',
        'method': 'GET',
        'title': 'info',
        'properties': {
          'event': {
            'type': 'array'
          },
          'start': {
            'type': 'string'
          },
          'end': {
            'type': 'string'
          },
          'resolution': {
            'type': 'string'
          },
          'duration': {
            'type': 'string'
          }
        },
        'required': ['event']
      },
      {
        'description': 'Returns a list of countries of origin for a given domain for different event types.',
        'href': '/tags/{tag}/stats/aggregates/countries',
        'method': 'GET',
        'title': 'list'
      },
      {
        'description': 'Returns a list of email providers for a given domain for different event types.',
        'href': '/tags/{tag}/stats/aggregates/providers',
        'method': 'GET',
        'title': 'list'
      },
      {
        'description': 'Returns a list of devices for a given domain that have triggered event types.',
        'href': '/tags/{tag}/stats/aggregates/devices',
        'method': 'GET',
        'title': 'list'
      },
      {
        'description': 'Deletes all counters for particular tag and the tag itself.',
        'href': '/tags/{tag}',
        'method': 'DELETE',
        'title': 'delete'
      }
      ]
    },
    'events': {
      'description': 'Query events that happen to your emails. See http://documentation.mailgun.com/api-events.html',
      'links': [{
        'description': 'Queries event records.',
        'href': '/events',
        'method': 'GET',
        'title': 'get',
        'properties': {
          'begin': {
            'type': 'string'
          },
          'end': {
            'type': 'string'
          },
          'ascending': {
            'type': 'string'
          },
          'limit': {
            'type': 'number'
          },
          'pretty': {
            'type': 'string'
          }
        }
      }]
    },
    'tracking': {
      'description': 'Programmatically get and modify domain tracking settings.',
      'links': [{
        'description': 'Returns tracking settings for a domain.',
        'href': '/domains/{domain}/tracking',
        'method': 'GET',
        'title': 'info'
      },
      {
        'description': 'Updates the open tracking settings for a domain.',
        'href': '/domains/{domain}/tracking/open',
        'method': 'PUT',
        'title': 'update',
        'properties': {
          'active': {
            'type': ['string', 'boolean']
          }
        },
        'required': ['active']
      },
      {
        'description': 'Updates the click tracking settings for a domain.',
        'href': '/domains/{domain}/tracking/click',
        'method': 'PUT',
        'title': 'update',
        'properties': {
          'active': {
            'type': ['string', 'boolean']
          }
        },
        'required': ['active']
      },
      {
        'description': 'Updates the unsubscribe tracking settings for a domain.',
        'href': '/domains/{domain}/tracking/unsubscribe',
        'method': 'PUT',
        'title': 'update',
        'properties': {
          'active': {
            'type': 'boolean'
          },
          'html_footer': {
            'type': 'string'
          },
          'text_footer': {
            'type': 'string'
          }
        },
        'required': ['active']
      }
      ]
    }
  }
}
