import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

import * as API from '../../api/';
import { Modal } from '../shared/';

const Invoices = () => {
  const [invoices, setInvoices] = useState();
  const [formData, setFormData] = useState();
  const [showModal, setShowModal] = useState(false);

  const dollarUSLocale = Intl.NumberFormat('en-US');

  const fetchInvoices = async () => {
    let invoiceData = await API.fetchAllInvoices();
    console.log(invoiceData);
    setInvoices(invoiceData);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  //   useEffect(() => {
  //     if (formData) {
  //       // TODO: delete this
  //       //   console.log('formData: ', formData);
  //       setShowModal(true);
  //     }
  //   }, [formData]);

  const clickHandler = async (e) => {
    const id = e?.target?.dataset?.id;

    let result = await API.fetchInvoiceById(id);

    if (result && result.current_status !== 'draft') {
      // TODO: delete this
      console.log('Cannot edit a non-draft invoice');
    } else {
      // TODO: delete this
      console.log('result: ', result);
      setFormData(result);
      setShowModal(true);
    }
  };

  const showModalCallback = (status) => {
    setShowModal(status);
  };

  const changeHandler = (e, fiield) => {};

  const renderStatus = (status) => {
    let colorConfig;

    if (!status) {
      return;
    }

    switch (status.toUpperCase()) {
      case 'DRAFT':
        colorConfig = {
          textColor: 'text-blue-900',
          bgColor: 'bg-blue-200',
        };
        break;

      case 'APPROVED':
        colorConfig = {
          textColor: 'text-orange-900',
          bgColor: 'bg-orange-200',
        };
        break;

      case 'SENT':
        colorConfig = {
          textColor: 'text-yellow-900',
          bgColor: 'bg-yellow-200',
        };
        break;

      case 'PAID':
        colorConfig = {
          textColor: 'text-green-900',
          bgColor: 'bg-green-200',
        };
        break;

      case 'PAST DUE':
        colorConfig = {
          textColor: 'text-red-900',
          bgColor: 'bg-red-200',
        };
        break;

      default:
      // do nothing
    }

    return (
      <span
        className={
          'relative inline-block px-3 py-1 font-semibold ' +
          colorConfig.textColor
        }
      >
        <span
          aria-hidden="true"
          className={
            'absolute inset-0 opacity-50 rounded-full ' + colorConfig.bgColor
          }
        ></span>
        <span className="relative text-xs">{status}</span>
      </span>
    );
  };

  const renderInvoices = () => {
    let today = new Date(Date.now());
    let invoiceEditable, invoiceDueDate, invoiceStatus;

    if (!invoices || !Array.isArray(invoices)) {
      return;
    }

    return (
      <>
        {invoices.map((invoice, index) => {
          invoiceDueDate = new Date(invoice.due_date);

          if (invoice.current_status === 'draft') {
            invoiceEditable = true;
          } else {
            invoiceEditable = false;
          }

          if (invoiceDueDate < today) {
            invoiceStatus = 'past due';
          } else {
            invoiceStatus = invoice.current_status;
          }

          return (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                <div className="flex justify-center items-center">
                  <Icon
                    icon="el:file-edit"
                    className={
                      (invoiceEditable ? 'cursor-pointer ' : 'text-gray-400 ') +
                      'w-4 h-4 ml-0 mr-3'
                    }
                    data-id={invoice.id}
                    onClick={(e) => {
                      if (invoiceEditable) {
                        clickHandler(e);
                      }
                    }}
                  />
                </div>
              </td>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                <div className="flex items-center">
                  <div>
                    <p className="text-gray-900 whitespace-no-wrap">
                      {invoice.customer_name}
                    </p>
                    {/* <input
                      type="text"
                      className="text-gray-900 whitespace-no-wrap"
                      value={invoice.customer_name}
                    /> */}
                  </div>
                </div>
              </td>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                {/* <input
                  type="text"
                  className="text-gray-900 whitespace-no-wrap"
                  value={invoice.customer_email}
                /> */}
                <p className="text-gray-900 whitespace-no-wrap">
                  {invoice.customer_email}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                {/* <input
                  type="text"
                  className="text-gray-900 whitespace-no-wrap"
                  value={invoice.description}
                /> */}
                <p className="text-gray-900 whitespace-no-wrap">
                  {invoice.description}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm text-right">
                {/* $
                <input
                  type="text"
                  className="text-gray-900 whitespace-no-wrap w-20 text-right"
                  value={dollarUSLocale.format(invoice.total)}
                /> */}
                <p className="text-gray-900 whitespace-no-wrap">
                  ${dollarUSLocale.format(invoice.total)}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm text-right">
                {/* <input
                  type="text"
                  className="text-gray-900 whitespace-no-wrap w-20 text-right"
                  value={new Date(invoice.due_date).toLocaleDateString()}
                /> */}
                <p className="text-gray-900 whitespace-no-wrap">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-md text-center">
                {renderStatus(invoiceStatus)}
              </td>
            </tr>
          );
        })}
      </>
    );
  };

  const submitInvoice = async (payload) => {
    if (!payload) return;

    let newHistory = {
      invoice_status: payload?.current_status,
      status_date: Date.now,
    };
    let result;

    newHistory =
      Array.isArray(payload.history) && payload.history.length > 0
        ? payload.history.concat(newHistory, payload.history)
        : [newHistory];

    // TODO: delete this
    console.log('newHistory: ', newHistory);

    const postData = {
      ...payload,
      history: newHistory,
    };

    if (payload.submitType === 'new') {
      result = await API.postNewInvoice(postData);
    } else {
      result = await API.putInvoiceUpdate(postData);
    }

    // TODO: delete this
    console.log('result: ', result);
    setInvoices([result, ...invoices]);
  };

  return (
    <div className="px-9 w-screen">
      <div className="text-xl font-bold pl-2">Invoices</div>
      <div>
        <Modal
          buttonLabel={'New Invoice'}
          clickHandler={(p) => submitInvoice(p)}
          formData={formData}
          overrideShowModal={showModal}
          showModalCallback={showModalCallback}
        />
      </div>
      <div className="mx-auto">
        <div className="py-2">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                    >
                      Edit
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-right text-sm uppercase font-bold"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-right text-sm uppercase font-bold"
                    >
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-bold"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>{renderInvoices()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
