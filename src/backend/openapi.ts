const serverUrl =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8081/api';

const jsonContent = (schema: unknown, examples?: Record<string, unknown>) => ({
  'application/json': {
    schema,
    ...(examples ? { examples } : {}),
  },
});

const errorResponseRef = { $ref: '#/components/schemas/ErrorResponse' } as const;

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Blubber Baron Backend API',
    version: '1.1.0',
    description:
      'Vollständige Swagger/OpenAPI-Dokumentation für den Blubber Baron REST-Backend-Katalog inklusive Produkte, Reviews, Jobs, Bewerbungen, Nutzerprofile und Bestellungen.',
  },
  servers: [
    {
      url: serverUrl,
      description: 'Configured backend API',
    },
  ],
  tags: [
    { name: 'Products', description: 'Produktkatalog, Detailansicht und Admin-Pflege.' },
    { name: 'Reviews', description: 'Produktbewertungen und Review-Erfassung.' },
    { name: 'Careers', description: 'Stellenangebote und Karrieredaten.' },
    { name: 'Applications', description: 'Bewerbungseingänge für Stellenangebote.' },
    { name: 'Users', description: 'Benutzerprofile und Profilpflege.' },
    { name: 'Orders', description: 'Bestellungen und Bestellhistorie.' },
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
            content: jsonContent(
              {
                type: 'array',
                items: { $ref: '#/components/schemas/Product' },
              },
              {
                sample: {
                  value: [
                    {
                      id: '1',
                      name: 'Dominiks Dampfgriff',
                      description: 'Premium-Wasserpfeife mit markantem Zugverhalten.',
                      price: 30.0,
                      category: 'hookah',
                      imageUrl: '/images/product-1.jpg',
                      imageUrls: ['/images/product-1.jpg'],
                      imageHint: 'luxury hookah',
                      brand: 'Blubber Baron',
                      stockQuantity: 12,
                      features: ['Edelstahl', 'Leiser Diffusor'],
                      createdAt: '2026-07-05T13:10:00',
                      updatedAt: '2026-07-05T13:10:00',
                    },
                  ],
                },
              },
            ),
          },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create or sync a product',
        operationId: 'syncProduct',
        requestBody: {
          required: true,
          content: jsonContent(
            { $ref: '#/components/schemas/ProductInput' },
            {
              create: {
                value: {
                  name: 'Saschas Pfeifenreiniger',
                  description: 'Zuverlässiger Reiniger für Schäfte und Bowl.',
                  price: 14.67,
                  category: 'accessory',
                  imageUrl: 'data:image/png;base64,...',
                  imageUrls: ['data:image/png;base64,...'],
                  imageHint: 'hookah accessory',
                  brand: 'Blubber Baron',
                  stockQuantity: 20,
                  features: ['Flexibel', 'Wiederverwendbar'],
                  createdAt: '2026-07-05T14:00:00',
                },
              },
            },
          ),
        },
        responses: {
          '201': {
            description: 'Product created successfully.',
            content: jsonContent({ $ref: '#/components/schemas/Product' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalServerError' },
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
            content: jsonContent({ $ref: '#/components/schemas/Product' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      patch: {
        tags: ['Products'],
        summary: 'Partially update a product',
        operationId: 'patchProduct',
        parameters: [{ $ref: '#/components/parameters/ProductId' }],
        requestBody: {
          required: true,
          content: jsonContent(
            { $ref: '#/components/schemas/ProductPatchInput' },
            {
              priceUpdate: {
                value: {
                  price: 24.99,
                },
              },
              stockUpdate: {
                value: {
                  stockQuantity: 8,
                  brand: 'Blubber Baron',
                },
              },
            },
          ),
        },
        responses: {
          '200': {
            description: 'Product updated successfully.',
            content: jsonContent({ $ref: '#/components/schemas/Product' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        operationId: 'deleteProduct',
        parameters: [{ $ref: '#/components/parameters/ProductId' }],
        responses: {
          '204': { description: 'Product deleted successfully.' },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalServerError' },
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
            content: jsonContent({
              type: 'array',
              items: { $ref: '#/components/schemas/Review' },
            }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Create a product review',
        operationId: 'syncReview',
        requestBody: {
          required: true,
          content: jsonContent(
            { $ref: '#/components/schemas/ReviewInput' },
            {
              sample: {
                value: {
                  productId: '1',
                  userId: 'user_123',
                  userName: 'Dominik',
                  rating: 5,
                  comment: 'Starker Durchzug und sehr sauber verarbeitet.',
                },
              },
            },
          ),
        },
        responses: {
          '201': {
            description: 'Review created successfully.',
            content: jsonContent({ $ref: '#/components/schemas/Review' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalServerError' },
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
            content: jsonContent({
              type: 'array',
              items: { $ref: '#/components/schemas/JobOffer' },
            }),
          },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      post: {
        tags: ['Careers'],
        summary: 'Create or sync a job offer',
        operationId: 'syncJob',
        requestBody: {
          required: true,
          content: jsonContent(
            { $ref: '#/components/schemas/JobOfferInput' },
            {
              sample: {
                value: {
                  title: 'Shisha Tester',
                  department: 'Research and Development',
                  location: 'Memmingen',
                  type: 'Full-time',
                  description: 'Testet Setups, Durchzug und Rauchverhalten.',
                  requirements: ['Teamfähigkeit', 'Humor', 'Belastbare Lunge'],
                },
              },
            },
          ),
        },
        responses: {
          '201': {
            description: 'Job offer created successfully.',
            content: jsonContent({ $ref: '#/components/schemas/JobOffer' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalServerError' },
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
            content: jsonContent({ $ref: '#/components/schemas/JobOffer' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      delete: {
        tags: ['Careers'],
        summary: 'Delete job offer',
        operationId: 'deleteJob',
        parameters: [{ $ref: '#/components/parameters/JobId' }],
        responses: {
          '204': { description: 'Job offer deleted successfully.' },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalServerError' },
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
          content: jsonContent(
            { $ref: '#/components/schemas/JobApplicationInput' },
            {
              sample: {
                value: {
                  jobId: '3',
                  jobTitle: 'Shisha Tester',
                  applicantName: 'Esma Baron',
                  applicantEmail: 'esma@example.com',
                  message: 'Ich bringe Erfahrung in Produkttests und Eventbetrieb mit.',
                  resumeData: 'data:application/pdf;base64,...',
                },
              },
            },
          ),
        },
        responses: {
          '201': {
            description: 'Application submitted successfully.',
            content: jsonContent({ $ref: '#/components/schemas/JobApplication' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalServerError' },
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
            content: jsonContent({ $ref: '#/components/schemas/UserProfile' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user profile',
        operationId: 'updateUserProfile',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        requestBody: {
          required: true,
          content: jsonContent(
            { $ref: '#/components/schemas/UserProfileInput' },
            {
              sample: {
                value: {
                  firstName: 'Dominik',
                  lastName: 'Baron',
                  email: 'dominik@example.com',
                  isAdmin: true,
                },
              },
            },
          ),
        },
        responses: {
          '200': {
            description: 'User profile updated successfully.',
            content: jsonContent({ $ref: '#/components/schemas/UserProfile' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '500': { $ref: '#/components/responses/InternalServerError' },
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
            content: jsonContent({
              type: 'array',
              items: { $ref: '#/components/schemas/Order' },
            }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalServerError' },
        },
      },
    },
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create an order',
        operationId: 'syncOrder',
        requestBody: {
          required: true,
          content: jsonContent(
            { $ref: '#/components/schemas/OrderInput' },
            {
              sample: {
                value: {
                  userId: 'user_123',
                  totalAmount: 44.67,
                  status: 'Ausstehend',
                  shippingAddress: 'Musterstraße 1, 87700 Memmingen, Deutschland',
                  items: [
                    {
                      productId: '1',
                      name: 'Dominiks Dampfgriff',
                      quantity: 1,
                      price: 30.0,
                    },
                    {
                      productId: '2',
                      name: 'Saschas Pfeifenreiniger',
                      quantity: 1,
                      price: 14.67,
                    },
                  ],
                },
              },
            },
          ),
        },
        responses: {
          '201': {
            description: 'Order created successfully.',
            content: jsonContent({ $ref: '#/components/schemas/Order' }),
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '500': { $ref: '#/components/responses/InternalServerError' },
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
        description: 'Numeric product identifier serialized as string.',
        schema: { type: 'string', example: '1' },
      },
      JobId: {
        name: 'jobId',
        in: 'path',
        required: true,
        description: 'Numeric job identifier serialized as string.',
        schema: { type: 'string', example: '3' },
      },
      UserId: {
        name: 'userId',
        in: 'path',
        required: true,
        description: 'User profile identifier.',
        schema: { type: 'string', example: 'user_123' },
      },
    },
    responses: {
      BadRequest: {
        description: 'Request validation failed.',
        content: jsonContent(errorResponseRef),
      },
      NotFound: {
        description: 'Resource was not found.',
        content: jsonContent(errorResponseRef),
      },
      InternalServerError: {
        description: 'Unexpected server error.',
        content: jsonContent(errorResponseRef),
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          status: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Product not found' },
        },
        required: ['timestamp', 'status', 'message'],
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', example: 30.0 },
          category: { type: 'string', example: 'hookah' },
          imageUrl: { type: 'string' },
          imageUrls: {
            type: 'array',
            items: { type: 'string' },
          },
          imageHint: { type: 'string' },
          brand: { type: 'string' },
          stockQuantity: { type: 'integer', example: 10 },
          features: {
            type: 'array',
            items: { type: 'string' },
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'description', 'price', 'category'],
      },
      ProductInput: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', exclusiveMinimum: 0 },
          category: { type: 'string' },
          imageUrl: { type: 'string' },
          imageUrls: {
            type: 'array',
            items: { type: 'string' },
          },
          imageHint: { type: 'string' },
          brand: { type: 'string' },
          stockQuantity: { type: 'integer', minimum: 0 },
          features: {
            type: 'array',
            items: { type: 'string' },
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['name', 'description', 'price', 'category'],
      },
      ProductPatchInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', exclusiveMinimum: 0 },
          category: { type: 'string' },
          imageUrl: { type: 'string' },
          imageUrls: {
            type: 'array',
            items: { type: 'string' },
          },
          imageHint: { type: 'string' },
          brand: { type: 'string' },
          stockQuantity: { type: 'integer', minimum: 0 },
          features: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      Review: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '5' },
          productId: { type: 'string', example: '1' },
          userId: { type: 'string', example: 'user_123', nullable: true },
          userName: { type: 'string' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'productId', 'userName', 'rating', 'comment'],
      },
      ReviewInput: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          userId: { type: 'string' },
          userName: { type: 'string' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
        },
        required: ['productId', 'userName', 'rating', 'comment'],
      },
      JobOffer: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '3' },
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
        required: ['title', 'department', 'location', 'type', 'description'],
      },
      JobApplication: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '12' },
          jobId: { type: 'string', example: '3' },
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
        required: ['id', 'jobId', 'applicantName', 'applicantEmail', 'message', 'status'],
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
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['jobId', 'applicantName', 'applicantEmail', 'message'],
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user_123' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          isAdmin: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id'],
      },
      UserProfileInput: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          isAdmin: { type: 'boolean' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '41' },
          userId: { type: 'string', example: 'user_123' },
          totalAmount: { type: 'number', example: 44.67 },
          status: { type: 'string', example: 'Ausstehend' },
          shippingAddress: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
        },
        required: ['id', 'userId', 'totalAmount', 'status'],
      },
      OrderInput: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          totalAmount: { type: 'number' },
          status: { type: 'string' },
          shippingAddress: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItemInput' },
          },
        },
        required: ['userId', 'totalAmount', 'status', 'items'],
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '100' },
          productId: { type: 'string', nullable: true },
          name: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          price: { type: 'number', example: 14.67 },
        },
        required: ['name', 'quantity', 'price'],
      },
      OrderItemInput: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          name: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          price: { type: 'number' },
        },
        required: ['name', 'quantity', 'price'],
      },
    },
  },
} as const;
