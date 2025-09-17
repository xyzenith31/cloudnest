import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';
import { GenderIcon } from './Icons';

const CustomSelect = ({ options, selected, onChange }) => {
  const isSelected = selected.id !== 0;

  return (
    <div className="relative">
      {/* Ikon gender di dalam input field */}
      <GenderIcon />

      <Listbox value={selected} onChange={onChange}>
        {/* Tombol akan berubah warna jika sudah ada pilihan */}
        <Listbox.Button 
          className={`form-input relative w-full cursor-default text-left pl-12 transition-colors duration-300 
            ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-sky-900'}`
          }
        >
          <span className={`block truncate ${isSelected ? 'font-semibold' : ''}`}>
            {selected.name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {/* Ubah warna ikon panah agar kontras */}
            <HiChevronUpDown className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-400'}`} aria-hidden="true" />
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
              // Jangan tampilkan placeholder "Pilih Gender" di dalam daftar pilihan
              option.id > 0 && (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    // Warna saat hover (active) menjadi biru muda
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-sky-100 text-sky-900' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.name}
                      </span>
                      {/* Tampilkan centang jika opsi ini yang terpilih */}
                      {selected ? (
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