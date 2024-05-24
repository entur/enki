// src/mocks/handlers.js
import { graphql, http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/bootstrap.json', () => {
    return HttpResponse.json({
      uttuApiUrl: 'http://other/bar',
    });
  }),
  graphql.query('GetUserContext', ({ query }) => {
    return HttpResponse.json({
      data: {
        userContext: {
          preferredName: 'John Doe',
          isAdmin: true,
          providers: [
            {
              name: 'Test provider',
              code: 'TST',
            },
          ],
        },
      },
    });
  }),
];
