import { Menu, Transition } from '@headlessui/react'
import { FC, Fragment } from 'react'

export interface MenuItem {
    name: string;
    value: string;
}

export interface IMenuDropdownProps {
    label: string;
    menuItems: MenuItem[];
    onMenuSelect: (item: MenuItem) => void;
}

const MenuDropdown: FC<IMenuDropdownProps> = ({ label, menuItems, onMenuSelect }) => {
    return (
        <div className="text-right">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                        {label}
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
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="p-1 ">
                            {menuItems.map(item => {

                                return (
                                    <Menu.Item key={item.value}>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                onClick={() => onMenuSelect(item)}
                                            >
                                                {item.name}
                                            </button>
                                        )}
                                    </Menu.Item>
                                )
                            })}

                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}

export default MenuDropdown;
