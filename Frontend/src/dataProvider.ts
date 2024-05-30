/* eslint-disable @typescript-eslint/no-explicit-any */
import { stringify } from 'query-string';
import { fetchUtils, DataProvider } from 'ra-core';

export const API_URL = 'https://staff-score-frontend.vercel.app/api';

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const response = await fetchUtils.fetchJson(
      `${API_URL}/${resource}?_page=${page}&_limit=${perPage}&_sort=${field}&_order=${order}`
    );

    const jsonResponse = await response.json;

    return {
      data: jsonResponse.data || [],
      total: jsonResponse.total || 10,
      page: page,
      perPage: perPage
    };
  },

  getOne: async (resource, params) => {
    const response = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`);
    return { data: response.json };
  },

  getMany: async (resource, params) => {
    const query = {
      id: params.ids
    };

    const response = await fetchUtils.fetchJson(`${API_URL}/${resource}/${stringify(query)}`);
    return { data: response.json };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      [params.target]: params.id,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage
    };

    const response = await fetchUtils.fetchJson(`${API_URL}/${resource}/${stringify(query)}`);
    if (!response.headers.has('x-total-count')) {
      throw new Error(
        'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
      );
    }
    return {
      data: response.json,
      total: parseInt(response.headers.get('x-total-count') || '', 10)
    };
  },

  update: async (resource, params) => {
    const reponse = await fetchUtils.fetchJson(`${API_URL}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data)
    });

    return { data: reponse.json };
  },

  updateMany: async (resource, params) =>
    Promise.all(
      params.ids.map(
        async id =>
          await fetchUtils.fetchJson(`${API_URL}/${resource}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data)
          })
      )
    ).then(responses => ({ data: responses.map(({ json }) => json.id) })),

  create: async (resource, params) =>
    await fetchUtils
      .fetchJson(`${API_URL}/${resource}`, {
        method: 'POST',
        body: JSON.stringify(params.data)
      })
      .then(({ json }) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { ...params.data, id: json.id } as any
      })),

  delete: async (resource, params) =>
    await fetchUtils
      .fetchJson(`${API_URL}/${resource}/${params.id}`, {
        method: 'DELETE'
      })
      .then(response => ({ data: response.json })),

  deleteMany: async (resource, params) =>
    Promise.all(
      params.ids.map(
        async id =>
          await fetchUtils.fetchJson(`${API_URL}/${resource}/${id}`, {
            method: 'DELETE'
          })
      )
    ).then(responses => ({ data: responses.map(({ json }) => json.id) }))
};
