import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800  ">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className=" flex items-center">
            <a className="flex-shrink-0" href="/">
              <img
                src="https://assets.website-files.com/6287b51d37f98de148e12043/6287b51d37f98d3fa3e12076_cfl-logo-v1.2-rounded.svg"
                className="h-10"
                loading="lazy"
                alt="CacheFlow Logo"
              />
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-gray-800 dark:text-white  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-gray-400  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>

                <Link
                  to="/users"
                  className="text-gray-400  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Users
                </Link>
              </div>
            </div>
          </div>
          <div className="block">
            <div className="ml-4 flex items-center md:ml-6"></div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="h-8 w-8"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            {' '}
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            About
          </Link>

          <Link
            to="/users"
            className="text-gray-800 dark:text-white  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Users
          </Link>
        </div>
      </div>
    </nav>
    // <nav className="hidden w-full md:block md:w-auto" id="navbar-default">
    //   <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
    //     <li>
    //       <Link
    //         to="/"
    //         className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
    //       >
    //         Home
    //       </Link>
    //     </li>
    //     <li>
    //       <Link
    //         to="/about"
    //         className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
    //       >
    //         About
    //       </Link>
    //     </li>
    //     <li>
    //       <Link
    //         to="/users"
    //         className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
    //       >
    //         Users
    //       </Link>
    //     </li>
    //   </ul>
    // </nav>
  );
};

export default NavBar;
