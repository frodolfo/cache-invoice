const base = '/api';
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
    ? fetch(`${base}/invoices`, {
        method: method,
        ...fetchConfig,
        body: JSON.stringify(data),
      }).then((response) => response.json())
    : fetch(endpoint).then((response) => response.json());
};

export const fetchAllInvoices = () => {
  return fetchCallback(`${base}/invoices`);
};

export const fetchInvoiceById = (id) => {
  if (!id) return;

  return fetchCallback(`${base}/invoices/${id}`);
};

export const postNewInvoice = (invoiceData) => {
  //   return fetch(`${base}/invoices`, {
  //     method: 'POST',
  //     ...fetchConfig,
  //     body: JSON.stringify(invoiceData),
  //   }).then((response) => response.json());
  return fetchCallback(`${base}/invoices`, 'POST', invoiceData);
};

export const putInvoiceUpdate = (invoiceData) => {
  if (!invoiceData) return;

  //   return fetch(`${base}/invoices/${invoiceData.id}`, {
  //     method: 'PUT',
  //     ...fetchConfig,
  //     body: JSON.stringify(invoiceData),
  //   }).then((response) => response.json());
  return fetchCallback(
    `${base}/invoices/${invoiceData.id}`,
    'PUT',
    invoiceData
  );
};
