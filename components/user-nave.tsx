import { forwardRef } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { Group, Avatar, Text, Menu, UnstyledButton } from "@mantine/core";
import { Bell, ChevronDown } from "lucide-react";

export function UserNave() {
  return (
    <>
      <div className="flex items-center gap-3 text-gray-200 bg-gray-600 py-3 px-4">
        <Bell className="w-5 h-5" />
      </div>

      <Menu withArrow>
        <Menu.Target>
          <UnstyledButton>
            <div className="flex items-center gap-3 text-gray-200 bg-gray-600 py-2 px-4">
              <Avatar
                size="sm"
                radius="xl"
                src="https://placekitten.com/200/300"
              />
              <p className="text-sm ">Jane Doe</p>
              <ChevronDown size={18} />
            </div>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown w={170}>content</Menu.Dropdown>
      </Menu>
    </>
  );
}
