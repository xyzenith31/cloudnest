import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';

const CustomSelect = ({ options, selected, onChange, placeholderIcon: PlaceholderIcon = FiUsers }) => {
  const isSelected = selected && selected.value !== '';

  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <PlaceholderIcon
            className={`absolute top-1/2 -translate-y-1/2 left-4 transition-colors duration-300 z-10 ${
              isSelected ? 'text-white' : 'text-gray-400'
            }`}
          />

          <Listbox.Button
            className={`form-input relative w-full cursor-pointer text-left pl-12 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400
              ${isSelected ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-sky-900'}
              ${open ? 'ring-2 ring-blue-500' : 'border-gray-200'}`
            }
          >
            <span className={`block truncate ${isSelected ? 'font-semibold' : ''}`}>
              {selected?.name || "Pilih Opsi"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <HiChevronUpDown
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isSelected ? 'text-white' : 'text-gray-400'
                  }`}
                  aria-hidden="true"
                />
              </motion.div>
            </span>
          </Listbox.Button>

          <AnimatePresence>
            {open && (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  as={motion.ul}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20"
                >
                  {options.map((option) => (
                    option.value && (
                      <Listbox.Option
                        key={option.id}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                          }`
                        }
                        value={option}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium text-blue-600' : 'font-normal'}`}>
                              {option.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
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
            )}
          </AnimatePresence>
        </div>
      )}
    </Listbox>
  );
};

export default CustomSelect;