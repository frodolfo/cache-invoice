const base = '/api';

export const fetchAllInvoices = () => {
  return fetch(`${base}/invoices`).then((response) => response.json());
};

export const fetchInvoiceById = (id) => {
  if (!id) return;

  return fetch(`${base}/invoices/${id}`).then((response) => response.json());
};

export const postNewInvoice = (invoiceData) => {
  return fetch(`${base}/invoices`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(invoiceData),
  }).then((response) => response.json());
};
