import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FiChevronDown, FiCheck, FiArrowDown, FiArrowUp, FiStar } from 'react-icons/fi';

const sortOptions = [
    { by: 'createdAt', label: 'Tanggal' },
    { by: 'name', label: 'Nama' },
    { by: 'size', label: 'Ukuran' },
    { by: 'starred', label: 'Dibintangi' },
];

const SortDropdown = ({ sort, setSort }) => {
  const currentLabel = sortOptions.find(o => o.by === sort.by)?.label || 'Urutkan';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          {currentLabel}
          {sort.order === 'desc' 
            ? <FiArrowDown className="h-4 w-4" />
            : <FiArrowUp className="h-4 w-4" />
          }
          <FiChevronDown className="-mr-1 ml-1 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="px-1 py-1">
            {sortOptions.map(option => (
              <Menu.Item key={option.by}>
                {({ active }) => (
                  <button
                    onClick={() => setSort({ ...sort, by: option.by })}
                    className={`${
                      active || sort.by === option.by ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {sort.by === option.by && <FiCheck className="mr-2 h-5 w-5" />}
                    {option.label === 'Dibintangi' && <FiStar className="mr-2 h-5 w-5" />}
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
           <div className="px-1 py-1">
             <Menu.Item>
                {({ active }) => (
                    <button
                        onClick={() => setSort({ ...sort, order: 'asc' })}
                        className={`${active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                        <FiArrowUp className="mr-2 h-5 w-5"/> Urutan Naik
                    </button>
                )}
             </Menu.Item>
             <Menu.Item>
                {({ active }) => (
                    <button
                        onClick={() => setSort({ ...sort, order: 'desc' })}
                         className={`${active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                        <FiArrowDown className="mr-2 h-5 w-5"/> Urutan Turun
                    </button>
                )}
             </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SortDropdown;