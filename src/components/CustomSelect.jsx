import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';

const CustomSelect = ({ options, selected, onChange, icon: Icon }) => {
  const isSelected = selected && selected.id !== 0;

  return (
    <div className="relative">
      {Icon && <Icon className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 z-10" />}

      <Listbox value={selected} onChange={onChange}>
        <Listbox.Button
          className={`w-full text-left pl-12 pr-4 py-3 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-transparent focus:border-blue-400`}
        >
          <span className={`block truncate ${isSelected ? 'font-medium' : 'text-gray-500'}`}>
            {selected.name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
            {options.map((option) => (
              option.id > 0 && (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected: isOptionSelected }) => (
                    <>
                      <span className={`block truncate ${isOptionSelected ? 'font-medium' : 'font-normal'}`}>
                        {option.name}
                      </span>
                      {isOptionSelected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              )
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export default CustomSelect;