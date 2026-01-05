'use client'
import Button from '../shared/components/citrica-ui/molecules/button';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";


export default function App() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isAdmin variant='secondary'>Open Menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
