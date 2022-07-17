import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

import { fetchAllInvoices, fetchInvoiceById, postNewInvoice } from '../../api/';
import { Modal } from '../shared/';

const Invoices = () => {
  const [invoices, setInvoices] = useState();

  const dollarUSLocale = Intl.NumberFormat('en-US');

  const fetchInvoices = async () => {
    let invoiceData = await fetchAllInvoices();
    console.log(invoiceData);
    setInvoices(invoiceData);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const clickHandler = async (e) => {
    const id = e?.target?.dataset?.id;

    let result = await fetchInvoiceById(id);

    if (result && result.invoice_status !== 'draft') {
      // TODO: delete this
      console.log('Cannot edit a non-draft invoice');
    } else {
      // TODO: delete this
      console.log('result: ', result);
    }
  };

  const renderStatus = (status) => {
    let colorConfig;

    if (!status) {
      return;
    }

    switch (status) {
      case 'draft':
        colorConfig = {
          textColor: 'text-blue-900',
          bgColor: 'bg-blue-200',
        };
        break;

      case 'sent':
        colorConfig = {
          textColor: 'text-yellow-900',
          bgColor: 'bg-yellow-200',
        };
        break;

      case 'paid':
        colorConfig = {
          textColor: 'text-green-900',
          bgColor: 'bg-green-200',
        };
        break;

      case 'past due':
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
          'relative inline-block px-3 py-1 font-semibold text-green-900 ' +
          colorConfig.textColor
        }
      >
        <span
          aria-hidden="true"
          className={
            'absolute inset-0 bg-green-200 opacity-50 rounded-full ' +
            colorConfig.bgColor
          }
        ></span>
        <span className="relative text-xs">{status}</span>
      </span>
    );
  };

  const renderInvoices = () => {
    let today = new Date(Date.now());
    let invoiceDueDate;
    let invoiceStatus;

    if (!invoices || !Array.isArray(invoices)) {
      return;
    }

    return (
      <>
        {invoices.map((invoice, index) => {
          invoiceDueDate = new Date(invoice.due_date);
          console.log('invoiceDueDate: ', invoiceDueDate);
          console.log('today: ', today);
          if (invoiceDueDate < today) {
            console.log('it is past due');
            invoiceStatus = 'past due';
          } else {
            invoiceStatus = invoice.invoice_status;
          }

          return (
            <tr key={index}>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm">
                <div className="flex justify-center items-center">
                  <Icon
                    icon="el:file-edit"
                    className="cursor-pointer w-4 h-4 ml-0 mr-3"
                    data-id={invoice.id}
                    onClick={(e) => {
                      clickHandler(e);
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
                  &#36;{dollarUSLocale.format(invoice.total)}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-400 bg-white text-sm text-right">
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
    const postData = {
      customer_email: payload?.emailAddress,
      customer_name: payload?.fullName,
      description: payload?.description,
      due_date: new Date(payload?.dueDate),
      total: parseInt(payload?.totalCost),
      invoice_status: payload?.invoice_status,
      history: [
        {
          invoiceStatus: payload?.invoice_status,
          statusDate: new Date(Date.now()),
        },
      ],
    };

    let result = await postNewInvoice(postData);
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
