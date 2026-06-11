const serverUrl =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8080/api';

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Blubber Baron Backend API',
    version: '1.0.0',
    description:
      'REST API documentation for products, orders, careers, applications, reviews, and user profiles.',
  },
  servers: [
    {
      url: serverUrl,
      description: 'Configured backend API',
    },
  ],
  tags: [
    { name: 'Products', description: 'Product catalog and admin product synchronization.' },
    { name: 'Orders', description: 'User order history and order synchronization.' },
    { name: 'Careers', description: 'Job listings and job administration.' },
    { name: 'Applications', description: 'Job application submission.' },
    { name: 'Reviews', description: 'Product reviews.' },
    { name: 'Users', description: 'User profile operations.' },
  ],
  paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products',
        operationId: 'listProducts',
        responses: {
          '200': {
            description: 'Products returned successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create or sync a product',
        operationId: 'syncProduct',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Product synchronized successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          '201': {
            description: 'Product created successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
        },
      },
    },
    '/products/{productId}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        operationId: 'getProduct',
        parameters: [{ $ref: '#/components/parameters/ProductId' }],
        responses: {
          '200': {
            description: 'Product returned successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        operationId: 'deleteProduct',
        parameters: [{ $ref: '#/components/parameters/ProductId' }],
        responses: {
          '204': { description: 'Product deleted successfully.' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/products/{productId}/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'List reviews for a product',
        operationId: 'listProductReviews',
        parameters: [{ $ref: '#/components/parameters/ProductId' }],
        responses: {
          '200': {
            description: 'Reviews returned successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Review' },
                },
              },
            },
          },
        },
      },
    },
    '/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Create or sync a product review',
        operationId: 'syncReview',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Review created successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Review' },
              },
            },
          },
        },
      },
    },
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create or sync an order',
        operationId: 'syncOrder',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Order created successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' },
              },
            },
          },
        },
      },
    },
    '/users/{userId}/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List orders for a user',
        operationId: 'listUserOrders',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          '200': {
            description: 'Orders returned successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Order' },
                },
              },
            },
          },
        },
      },
    },
    '/jobs': {
      get: {
        tags: ['Careers'],
        summary: 'List job offers',
        operationId: 'listJobs',
        responses: {
          '200': {
            description: 'Job offers returned successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/JobOffer' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Careers'],
        summary: 'Create or sync a job offer',
        operationId: 'syncJob',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/JobOfferInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Job offer created successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JobOffer' },
              },
            },
          },
        },
      },
    },
    '/jobs/{jobId}': {
      get: {
        tags: ['Careers'],
        summary: 'Get job offer by ID',
        operationId: 'getJob',
        parameters: [{ $ref: '#/components/parameters/JobId' }],
        responses: {
          '200': {
            description: 'Job offer returned successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JobOffer' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Careers'],
        summary: 'Delete job offer',
        operationId: 'deleteJob',
        parameters: [{ $ref: '#/components/parameters/JobId' }],
        responses: {
          '204': { description: 'Job offer deleted successfully.' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/applications': {
      post: {
        tags: ['Applications'],
        summary: 'Submit a job application',
        operationId: 'syncApplication',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/JobApplicationInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Application submitted successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JobApplication' },
              },
            },
          },
        },
      },
    },
    '/users/{userId}': {
      get: {
        tags: ['Users'],
        summary: 'Get user profile',
        operationId: 'getUserProfile',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          '200': {
            description: 'User profile returned successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user profile',
        operationId: 'updateUserProfile',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserProfileInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'User profile updated successfully.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
  components: {
    parameters: {
      ProductId: {
        name: 'productId',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      },
      JobId: {
        name: 'jobId',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      },
      UserId: {
        name: 'userId',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      },
    },
    responses: {
      NotFound: {
        description: 'Resource was not found.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
        required: ['message'],
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'],
      },
      UserProfileInput: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          imageUrl: { type: 'string', format: 'uri' },
          imageUrls: {
            type: 'array',
            items: { type: 'string', format: 'uri' },
          },
          imageHint: { type: 'string' },
          brand: { type: 'string' },
          stockQuantity: { type: 'number' },
          features: {
            type: 'array',
            items: { type: 'string' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'description', 'price', 'category', 'imageUrl'],
      },
      ProductInput: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          imageUrl: { type: 'string', format: 'uri' },
          imageUrls: {
            type: 'array',
            items: { type: 'string', format: 'uri' },
          },
          imageHint: { type: 'string' },
          brand: { type: 'string' },
          stockQuantity: { type: 'number' },
          features: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['name', 'description', 'price', 'category', 'imageUrl'],
      },
      Review: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          productId: { type: 'string' },
          userId: { type: 'string' },
          userName: { type: 'string' },
          rating: { type: 'number', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'productId', 'userId', 'userName', 'rating', 'comment', 'createdAt'],
      },
      ReviewInput: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          userId: { type: 'string' },
          userName: { type: 'string' },
          rating: { type: 'number', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
        },
        required: ['productId', 'userId', 'userName', 'rating', 'comment'],
      },
      JobOffer: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          department: { type: 'string' },
          location: { type: 'string' },
          type: { type: 'string', enum: ['Full-time', 'Part-time', 'Contract'] },
          description: { type: 'string' },
          requirements: {
            type: 'array',
            items: { type: 'string' },
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'title', 'department', 'location', 'type', 'description'],
      },
      JobOfferInput: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          department: { type: 'string' },
          location: { type: 'string' },
          type: { type: 'string', enum: ['Full-time', 'Part-time', 'Contract'] },
          description: { type: 'string' },
          requirements: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['title', 'department', 'location', 'type', 'description'],
      },
      JobApplication: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          jobId: { type: 'string' },
          jobTitle: { type: 'string' },
          applicantName: { type: 'string' },
          applicantEmail: { type: 'string', format: 'email' },
          message: { type: 'string' },
          resumeData: { type: 'string' },
          status: {
            type: 'string',
            enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'jobId', 'jobTitle', 'applicantName', 'applicantEmail', 'status'],
      },
      JobApplicationInput: {
        type: 'object',
        properties: {
          jobId: { type: 'string' },
          jobTitle: { type: 'string' },
          applicantName: { type: 'string' },
          applicantEmail: { type: 'string', format: 'email' },
          message: { type: 'string' },
          resumeData: { type: 'string' },
        },
        required: ['jobId', 'jobTitle', 'applicantName', 'applicantEmail'],
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          totalAmount: { type: 'number' },
          status: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'userId', 'totalAmount', 'status', 'createdAt'],
      },
      OrderInput: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          totalAmount: { type: 'number' },
          status: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'number' },
                price: { type: 'number' },
              },
              required: ['productId', 'quantity', 'price'],
            },
          },
        },
        required: ['userId', 'totalAmount', 'items'],
      },
    },
  },
} as const;
