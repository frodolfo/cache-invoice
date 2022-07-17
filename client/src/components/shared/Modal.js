import { useState } from 'react';

const Modal = ({ buttonLabel, clickHandler }) => {
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState();
  const [emailAddress, setEmailAddress] = useState();
  const [description, setDescription] = useState();
  const [dueDate, setDueDate] = useState();
  const [totalCost, setTotalCost] = useState();

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
    const payload = {
      fullName,
      emailAddress,
      description,
      dueDate,
      totalCost,
      invoice_status: 'draft',
    };

    setShowModal(false);
    clickHandler(payload);
  };

  return (
    <>
      <button
        className="mx-2 my-2 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-6 py-2 text-xs"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {buttonLabel}
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">New Invoice</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <label className="block text-black text-sm font-bold mb-1">
                      Full Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      onChange={(e) => onChangeHandler(e, 'fullName')}
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      name="emailAddress"
                      onChange={(e) => onChangeHandler(e, 'emailAddress')}
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      Description
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      name="description"
                      onChange={(e) => onChangeHandler(e, 'description')}
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      Due Date
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      name="description"
                      onChange={(e) => onChangeHandler(e, 'dueDate')}
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      Total Cost
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      name="totalCost"
                      onChange={(e) => onChangeHandler(e, 'totalCost')}
                    />
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => onClickHandler()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
