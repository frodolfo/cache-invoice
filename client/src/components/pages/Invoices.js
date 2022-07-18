import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import emailjs from '@emailjs/browser';

import * as API from '../../api/';
import { Modal } from '../shared/';

const Invoices = () => {
  const [invoices, setInvoices] = useState();
  const [formData, setFormData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('New Invoice');

  const dollarUSLocale = Intl.NumberFormat('en-US');

  const fetchInvoices = async () => {
    let invoiceData = await API.fetchAllInvoices();

    if (invoiceData) {
      setInvoices(invoiceData);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (formData) {
      setShowModal(true);
    }
  }, [formData]);

  // Event Handlers
  const clickHandler = async (e) => {
    const id = e?.target?.dataset?.id;

    if (!id) {
      console.error('*** ERROR: id not specified: ', e.target.dataset);
      return;
    }

    let result = await API.fetchInvoiceById(id);

    if (!result) {
      console.error(`*** ERROR: did not find invoice with id: ${id}`);
      return;
    }

    if (result.current_status === 'draft') {
      setModalTitle('Update Invoice');
      setFormData(result);
    }
  };

  const changeHandler = (e, fiield) => {};

  // Component Methods
  const showModalCallback = (status) => {
    setShowModal(status);
  };

  const reconcileInvoices = (updatedInvoice) => {
    let invoicesCopy = invoices;
    let invoiceIndex;

    if (updatedInvoice) {
      invoiceIndex = invoicesCopy.findIndex(
        (invoice) => invoice.id === updatedInvoice.id
      );

      if (invoiceIndex >= 0) {
        // update list of invoices
        invoicesCopy[invoiceIndex] = updatedInvoice;
        setInvoices([...invoicesCopy]);
      }

      if (formData) {
        setFormData(null);
      }
    }
  };

  const updateInvoice = async (id, action) => {
    let invoice, newActivity, updateData, result, status;

    if (!id || !action) return;

    status = action;

    invoice = await API.fetchInvoiceById(id);

    if (invoice) {
      // Set up new activity for the invoice's histoty
      newActivity = [
        {
          invoice_status: status,
          status_date: Date.now(),
        },
      ];

      // Set up update data for the PUT request
      updateData = {
        id,
        current_status: status,
        history: newActivity.concat(invoice.history),
      };

      result = await API.putInvoiceUpdate(updateData);

      reconcileInvoices(result);
    }
  };

  const approveInvoice = async (e) => {
    const id = e?.target?.dataset.id;

    if (!id) return;

    updateInvoice(id, 'approved');
  };

  const emailInvoice = async (e) => {
    const id = e?.target?.dataset.id;
    let templateParams, invoice, lineItems;

    if (!id) return;

    invoice = await API.fetchInvoiceById(id);
    updateInvoice(id, 'sent');

    lineItems = invoice.line_items.map((li) => {
      return (
        `<li>${li.item_name}:` +
        '$' +
        `${dollarUSLocale.format(li.item_price)}</li>`
      );
    });

    templateParams = {
      to_name: 'Fred',
      message: 'This is your invoice',
      total: '$' + dollarUSLocale.format(invoice.total),
      line_items: `<ul>${lineItems}</ul>`,
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const submitInvoice = async (payload) => {
    if (!payload) {
      console.error('*** ERROR: payload is missing');
      return;
    }

    let newHistory = {
      invoice_status: payload?.current_status,
      status_date: Date.now(),
    };
    let result, postData;

    newHistory =
      Array.isArray(payload.history) && payload.history.length > 0
        ? payload.history.concat(newHistory, payload.history)
        : [newHistory];

    postData = {
      ...payload,
      history: newHistory,
    };

    if (payload.submitType === 'new') {
      result = await API.postNewInvoice(postData);
      setInvoices([result, ...invoices]);
    } else {
      result = await API.putInvoiceUpdate(postData);
      reconcileInvoices(result);
    }
  };

  // Render Methods
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

  const renderApprovalButton = (invoiceStatus, id) => {
    let iconEl;

    if (!invoiceStatus) return;

    if (invoiceStatus === 'draft') {
      iconEl = (
        <Icon
          icon="bi:file-earmark-check"
          className="text-green-700 h-8 ml-2 cursor-pointer"
          data-id={id}
          onClick={(e) => approveInvoice(e)}
        />
      );
    } else if (invoiceStatus === 'approved') {
      iconEl = (
        <Icon
          icon="bx:mail-send"
          className="text-green-700 h-6 w-6 ml-2 cursor-pointer"
          data-id={id}
          onClick={(e) => emailInvoice(e)}
        />
      );
    } else {
      iconEl = null;
    }

    return iconEl;
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
                <div className="flex items-center">
                  {renderStatus(invoiceStatus)}
                  {renderApprovalButton(invoiceStatus, invoice.id)}
                </div>
              </td>
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <div className="px-9 w-screen">
      <div className="text-xl font-bold pl-2">Invoices</div>
      <div>
        <Modal
          modalTitle={modalTitle}
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
