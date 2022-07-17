const base = '/api/invoices';
const fetchConfig = {
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer',
};

const fetchCallback = (endpoint, method, data) => {
  return data
    ? fetch(endpoint, {
        method: method,
        ...fetchConfig,
        body: JSON.stringify(data),
      }).then((response) => response.json())
    : fetch(endpoint).then((response) => response.json());
};

export const fetchAllInvoices = () => {
  return fetchCallback(`${base}`);
};

export const fetchInvoiceById = (id) => {
  if (!id) return;

  return fetchCallback(`${base}/${id}`);
};

export const postNewInvoice = (invoiceData) => {
  return fetchCallback(`${base}`, 'POST', invoiceData);
};

export const putInvoiceUpdate = (invoiceData) => {
  if (!invoiceData) return;

  return fetchCallback(`${base}/${invoiceData.id}`, 'PUT', invoiceData);
};
