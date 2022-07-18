import { useState, useEffect } from 'react';

const Modal = ({
  modalTitle,
  clickHandler,
  formData,
  overrideShowModal,
  showModalCallback,
}) => {
  const [formContent, setFormContent] = useState(formData);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [lineItems, setLineItems] = useState();

  useEffect(() => {
    if (formData) {
      setFullName(formData.customer_name);
      setEmailAddress(formData.customer_email);
      setDescription(formData.description);
      setDueDate(formData.due_date);
      setTotalCost(formData.total);
      setLineItems(formData.line_items);
      setFormContent(formData);
    }
  }, [formData, formContent]);

  useEffect(() => {
    if (overrideShowModal === true) {
      setShowModal(true);
    }
  }, [overrideShowModal]);

  const onChangeHandler = (e, field) => {
    if (!e || !field) return;

    switch (field) {
      case 'fullName':
        setFullName(e?.target?.value);
        break;

      case 'emailAddress':
        setEmailAddress(e?.target?.value);
        break;

      case 'description':
        setDescription(e?.target?.value);
        break;

      case 'dueDate':
        setDueDate(e?.target?.value);
        break;

      case 'totalCost':
        setTotalCost(e?.target?.value);
        break;

      default:
      // do nothing
    }
  };

  const onClickHandler = () => {
    let payload = {
      customer_email: fullName,
      customer_name: emailAddress,
      description,
      due_date: dueDate,
      total: totalCost,
      current_status: 'draft',
      submitType: 'new',
    };

    if (formData) {
      payload['id'] = formData.id;
      payload['submitType'] = 'update';
    }

    setShowModal(false);
    showModalCallback(false);
    clickHandler(payload);
  };

  const renderLineItem = () => {
    const items = lineItems || [];

    // if (!lineItems || !Array.isArray(lineItems)) return;

    const addItem = (e) => {
      e.preventDefault();
      console.log('New item');
    };

    return (
      <div className="py-4">
        <ul className="pb-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} className="text-sm">
                {item.item_name} - {item.item_price}
              </li>
            ))
          ) : (
            <li className="text-sm">No Items</li>
          )}
        </ul>
        <button
          className="border bg-indigo-700 hover:bg-indigo-500 rounded text-white p-2 text-xs"
          onClick={(e) => addItem(e)}
        >
          Add Item
        </button>
      </div>
    );
  };

  return (
    <>
      <button
        className="mx-2 my-2 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs"
        type="button"
        onClick={() => setShowModal(true)}
      >
        New Invoice
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font=semibold">{modalTitle}</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      setShowModal(false);
                      showModalCallback(false);
                    }}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Full Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black mb-2"
                      name="fullName"
                      value={fullName}
                      onChange={(e) => onChangeHandler(e, 'fullName')}
                    />
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black mb-2"
                      name="emailAddress"
                      value={emailAddress}
                      onChange={(e) => onChangeHandler(e, 'emailAddress')}
                    />
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Description
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black mb-2"
                      name="description"
                      value={description}
                      onChange={(e) => onChangeHandler(e, 'description')}
                    />
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Due Date
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black mb-2"
                      name="dueDate"
                      value={dueDate}
                      onChange={(e) => onChangeHandler(e, 'dueDate')}
                    />
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Line Items
                    </label>
                    {renderLineItem(lineItems)}
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      Total Cost
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black mb-2"
                      name="totalCost"
                      value={totalCost}
                      onChange={(e) => onChangeHandler(e, 'totalCost')}
                    />
                    <input type="hidden" value={formData} />
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end py-4 px-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      showModalCallback(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onClickHandler()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
