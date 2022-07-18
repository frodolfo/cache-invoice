import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import emailjs from '@emailjs/browser';

import * as API from '../../api/';
import { Modal } from '../shared/';

const Invoices = () => {
  const [invoices, setInvoices] = useState();
  const [invoicesCache, setInvoicesCache] = useState();
  const [formData, setFormData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('New Invoice');
  const [invoiceFilter, setInvoiceFilter] = useState();

  const dollarUSLocale = Intl.NumberFormat('en-US');

  const fetchInvoices = async () => {
    let invoiceData = await API.fetchAllInvoices();

    if (invoiceData) {
      setInvoices(invoiceData);
      setInvoicesCache(invoiceData);

      if (invoiceFilter) {
        filterInvoices(invoiceFilter);
      }
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

  // Component Methods
  const showModalCallback = (status) => {
    setShowModal(status);
  };

  const reconcileInvoices = (updatedInvoice) => {
    let invoicesCopy = invoicesCache;
    let invoiceIndex;

    if (updatedInvoice) {
      invoiceIndex = invoicesCopy.findIndex(
        (invoice) => invoice.id === updatedInvoice.id
      );

      if (invoiceIndex >= 0) {
        // update list of invoices
        invoicesCopy[invoiceIndex] = updatedInvoice;
        setInvoices([...invoicesCopy]);
        setInvoicesCache([...invoicesCopy]);
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
    const id = e.target.dataset.id;

    if (!id) return;

    updateInvoice(id, 'approved');
  };

  const emailInvoice = async (e, emailType) => {
    const id = e.target.dataset.id;
    let templateParams, invoice, lineItems;

    if (!id) return;

    if (!emailType) {
      emailType = 'notify';
    }

    invoice = await API.fetchInvoiceById(id);
    updateInvoice(id, 'sent');

    lineItems = invoice.line_items.map((li, index) => {
      return (
        `<li key="item-${index}">${li.item_name}:` +
        '$' +
        `${dollarUSLocale.format(li.item_price)}</li>`
      );
    });

    if (emailType === 'reminder') {
      templateParams = {
        to_name: 'Fred',
        message:
          'This is a friendly reminder that your invoice is past due.  Please see details below and contact us immediately.',
        total: '$' + dollarUSLocale.format(invoice.total),
        line_items: `<ul>${lineItems}</ul>`,
      };
    } else {
      templateParams = {
        to_name: 'Fred',
        message:
          'Thank you for your business.  Here is a copy of your invoice.',
        total: '$' + dollarUSLocale.format(invoice.total),
        line_items: `<ul>${lineItems}</ul>`,
      };
    }

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

  const payInvoice = async (e) => {
    const id = e.target.dataset.id;

    if (!id) return;

    updateInvoice(id, 'paid');
  };

  const submitInvoice = async (payload) => {
    if (!payload) {
      console.error('*** ERROR: payload is missing');
      return;
    }

    let newHistory = [
      {
        invoice_status: payload?.current_status,
        status_date: Date.now(),
      },
    ];
    let result, postData;

    newHistory =
      Array.isArray(payload.history) && payload.history.length > 0
        ? newHistory.concat(payload.history)
        : newHistory;

    postData = {
      ...payload,
      history: newHistory,
    };

    if (payload.submitType === 'new') {
      result = await API.postNewInvoice(postData);
      setInvoices([result, ...invoices]);
      setInvoicesCache([result, ...invoices]);
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

    switch (invoiceStatus) {
      case 'draft':
        iconEl = (
          <Icon
            icon="bi:file-earmark-check"
            className="text-orange-700 h-8 w-5 ml-2 cursor-pointer"
            data-id={id}
            onClick={(e) => approveInvoice(e)}
          />
        );
        break;

      case 'approved':
        iconEl = (
          <Icon
            icon="bx:mail-send"
            className="text-yellow-500 h-6 w-6 ml-2 cursor-pointer"
            data-id={id}
            onClick={(e) => emailInvoice(e, 'notify')}
          />
        );
        break;

      case 'sent':
        iconEl = (
          <Icon
            icon="bx:credit-card"
            className="text-green-700 h-6 w-6 ml-2 cursor-pointer"
            data-id={id}
            onClick={(e) => payInvoice(e)}
          />
        );
        break;

      case 'past due':
        iconEl = (
          <Icon
            icon="ant-design:warning-filled"
            className="text-red-700 h-6 w-6 ml-2 cursor-pointer"
            data-id={id}
            onClick={(e) => emailInvoice(e, 'reninder')}
          />
        );
        break;

      default:
        // do nothing
        iconEl = null;
    }
    // if (invoiceStatus === 'draft') {
    //   iconEl = (
    //     <Icon
    //       icon="bi:file-earmark-check"
    //       className="text-green-700 h-8 ml-2 cursor-pointer"
    //       data-id={id}
    //       onClick={(e) => approveInvoice(e)}
    //     />
    //   );
    // } else if (invoiceStatus === 'approved') {
    //   iconEl = (
    //     <Icon
    //       icon="bx:mail-send"
    //       className="text-green-700 h-6 w-6 ml-2 cursor-pointer"
    //       data-id={id}
    //       onClick={(e) => emailInvoice(e)}
    //     />
    //   );
    // } else {
    //   iconEl = null;
    // }

    return iconEl;
  };

  const renderHistory = (index, id) => {
    if (!index) return;

    const invoiceHistory = invoices[index].history || [];
    let historyEl;

    if (invoiceHistory.length > 0) {
      historyEl = invoiceHistory.map((event, index) => (
        <tr key={`event-${id}-${index}`}>
          <td
            key={`event-status-${id}-${index}`}
            className="px-2 py-1 border-b border-gray-400 bg-white text-xs"
          >
            {event.invoice_status}
          </td>
          <td
            key={`event-date-${id}-${index}`}
            className="px-2 py-1 border-b border-gray-400 bg-white text-xs"
          >
            {new Date(event.status_date).toLocaleDateString()}
          </td>
        </tr>
      ));
    }

    return historyEl;
  };

  const toggleHistory = (e) => {
    const id = e?.target?.dataset?.id;

    if (!id) return;

    if (document.querySelector(`#history-${id}`).classList.contains('hidden')) {
      document.querySelector(`#history-${id}`).classList.remove('hidden');
    } else {
      document.querySelector(`#history-${id}`).classList.add('hidden');
    }
  };

  const filterInvoices = (filter) => {
    let filteredInvoices;

    if (!filter) return;

    if (filter === 'all') {
      filteredInvoices = invoices;
    } else {
      if (filter === 'past due') {
        let today = new Date(Date.now());
        let invoiceDueDate;

        filteredInvoices = invoices.filter((invoice) => {
          invoiceDueDate = new Date(invoice.due_date);
          if (invoiceDueDate < today) {
            return invoice;
          } else {
            return false;
          }
        });
      } else {
        filteredInvoices = invoices.filter(
          (invoice) => invoice.current_status === filter
        );
      }
      setInvoiceFilter(filter);
    }

    setInvoicesCache(filteredInvoices);
  };

  const renderInvoices = () => {
    let today = new Date(Date.now());
    let invoiceEditable, invoiceDueDate, invoiceStatus;

    if (!invoicesCache || !Array.isArray(invoicesCache)) {
      return;
    }

    return (
      <>
        {invoicesCache.map((invoice, index) => {
          invoiceDueDate = new Date(invoice.due_date);
          invoiceEditable = invoice.current_status === 'draft';

          if (invoiceDueDate < today) {
            invoiceStatus = 'past due';
          } else {
            invoiceStatus = invoice.current_status;
          }

          return (
            <>
              <tr key={`details-${invoice.id}`}>
                <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                  <div className="flex">
                    <div className="flex justify-center items-center">
                      <Icon
                        icon="el:file-edit"
                        className={
                          (invoiceEditable
                            ? 'cursor-pointer '
                            : 'text-gray-400 ') + 'w-4 h-4 ml-0 mr-3'
                        }
                        data-id={invoice.id}
                        onClick={(e) => {
                          clickHandler(e);
                        }}
                      />
                    </div>
                    <div className="flex justify-center items-center">
                      <Icon
                        icon="ant-design:plus-square-outlined"
                        className="w-4 h-4 cursor-pointer"
                        data-id={index}
                        id={`toggleIcon${index}`}
                        onClick={(e) => {
                          toggleHistory(e);
                        }}
                      />
                      {/* 
                      TODO: use this icon when History is visible
                      <Icon icon="ant-design:minus-square-twotone" /> 
                      */}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                  <div className="flex items-center">
                    <div>
                      <p className="text-gray-900 whitespace-no-wrap">
                        {invoice.customer_name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {invoice.customer_email}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {invoice.description}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm text-right">
                  <p className="text-gray-900 whitespace-no-wrap">
                    ${dollarUSLocale.format(invoice.total)}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm text-right">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-400 bg-white text-md text-center">
                  <div className="flex items-center justify-between">
                    {renderStatus(invoiceStatus)}
                    {renderApprovalButton(invoiceStatus, invoice.id)}
                  </div>
                </td>
              </tr>
              <tr
                id={`history-${invoice.id}`}
                key={`history-${invoice.id}`}
                className="hidden"
              >
                <td
                  className="px-5 pt-1 pb-5 border-b border-gray-400 bg-white text-sm"
                  colSpan="7"
                >
                  <div className="py-2 font-md font-bold">History</div>
                  <table>
                    <thead>
                      <tr key={`history-header-${invoice.id}`}>
                        <th
                          key={`history-status-${invoice.id}`}
                          scope="col"
                          className="px-2 py-1 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-xs uppercase font-bold"
                        >
                          Status
                        </th>
                        <th
                          key={`history-date-${invoice.id}`}
                          scope="col"
                          className="px-2 py-1 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-xs uppercase font-bold"
                        >
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>{renderHistory(index, invoice.id)}</tbody>
                  </table>
                </td>
              </tr>
            </>
          );
        })}
      </>
    );
  };

  return (
    <div className="px-9 w-screen">
      <div className="text-xl font-bold pl-2">Invoices</div>
      <div className="flex w-full justify-between">
        <Modal
          modalTitle={modalTitle}
          clickHandler={(p) => submitInvoice(p)}
          formData={formData}
          overrideShowModal={showModal}
          showModalCallback={showModalCallback}
        />
        <div className="flex">
          <button
            key="filterAll"
            className="m-2 p-2 text-xs font-bold text-gray-900 bg-gray-200 rounded transition duration-150 ease-in-out hover:bg-gray-100"
            onClick={(e) => filterInvoices('all')}
          >
            All
          </button>
          <button
            key="filterDraft"
            className="m-2 p-2 text-xs font-bold text-blue-900 bg-blue-200 rounded transition duration-150 ease-in-out hover:bg-blue-100"
            onClick={(e) => filterInvoices('draft')}
          >
            Draft
          </button>
          <button
            key="filterApproved"
            className="m-2 p-2 text-xs font-bold text-orange-900 bg-orange-200 rounded transition duration-150 ease-in-out hover:bg-orange-100"
            onClick={(e) => filterInvoices('approved')}
          >
            Approved
          </button>
          <button
            key="filterSent"
            className="m-2 p-2 text-xs font-bold text-yellow-900 bg-yellow-200 rounded transition duration-150 ease-in-out hover:bg-yellow-100"
            onClick={(e) => filterInvoices('sent')}
          >
            Semt
          </button>
          <button
            key="filterPaid"
            className="m-2 p-2 text-xs font-bold text-green-900 bg-green-200 rounded transition duration-150 ease-in-out hover:bg-green-100"
            onClick={(e) => filterInvoices('paid')}
          >
            Paid
          </button>
          <button
            key="filterPastDue"
            className="m-2 p-2 text-xs font-bold text-red-900 bg-red-200 rounded transition duration-150 ease-in-out hover:bg-red-100"
            onClick={(e) => filterInvoices('past due')}
          >
            Past Due
          </button>
        </div>
      </div>
      <div className="mx-auto">
        <div className="py-2">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr key="invoiceHeader">
                    <th
                      key="headerEdit"
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                    >
                      Edit
                    </th>
                    <th
                      key="headerName"
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                    >
                      Name
                    </th>
                    <th
                      key="headerEmail"
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                    >
                      Email
                    </th>
                    <th
                      key="headerDescription"
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-bold"
                    >
                      Description
                    </th>
                    <th
                      key="headerTotal"
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-right text-sm uppercase font-bold"
                    >
                      Total
                    </th>
                    <th
                      key="headerDueDate"
                      scope="col"
                      className="px-5 py-3 bg-gray-300 border-b border-gray-200 text-gray-800 text-right text-sm uppercase font-bold"
                    >
                      Due Date
                    </th>
                    <th
                      key="headerStatus"
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
