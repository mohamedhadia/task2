import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  CheckIcon,
  CloseIcon,
  Combobox,
  Group,
  Modal,
  Pill,
  PillsInput,
  ScrollArea,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useAllUsers, useCreateUser, useUsers } from "../hooks/general";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { UploadImage } from "./UploadImage";
import { FileWithPath } from "@mantine/dropzone";
import { uploadImageCloud } from "../lib/utils";

type Props = {
  search: string;
  setSearch: (val: string) => void;
  label: string;
  value: {
    value: string | number;
    label: string;
  }[];
  setValue: (
    val:
      | {
          value: string | number;
          label: string;
        }[]
  ) => void;
};

export function MultiSelectComp({
  label,
  search,
  setSearch,
  value,
  setValue,
}: Props) {
  const { data: allUsers } = useAllUsers({ event_id: 19 });

  const { data } = useUsers({
    event_id: 19,
    ...(search.length > 0 && { search }),
  });

  const users = data?.users ?? allUsers?.users;
  const [opened, { open, close }] = useDisclosure(false);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: { value: string; label: string }) =>
    setValue((current) =>
      current.some((v) => v.value === val.value)
        ? current.filter((v) => v.value !== val.value)
        : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v.value !== val.value));

  const values = value.map((item) => (
    <Pill
      key={item?.value}
      value={item?.value}
      withRemoveButton
      onRemove={() => handleValueRemove(item?.value)}
    >
      {item?.label}
    </Pill>
  ));

  const valuesUsers = value.map((item, idx) => (
    <div
      key={idx}
      className="flex items-center justify-between gap-2 w-full bg-gray-700 border border-gray-500 py-2 px-6"
    >
      <span className="flex items-center gap-3 text-white">
        <Avatar src={item?.avatar} />
        {item?.label}
      </span>
      <CloseIcon
        className="!w-5 !h-5 text-red-500"
        onClick={() => handleValueRemove(item?.value)}
      />
    </div>
  ));

  const options = users
    ?.map((item) => ({
      value: String(item.id),
      label: item.first_name + " " + item.last_name,
      avatar: item.avatar,
    }))
    // ?.filter((item) =>
    //   item?.label?.toLowerCase()?.includes(search.trim().toLowerCase())
    // )
    .map((item) => {
      return (
        <Combobox.Option
          value={item}
          key={item.value}
          active={value.includes(item.value)}
        >
          <Group gap="sm">
            {value.includes(item.value) ? <CheckIcon size={12} /> : null}
            <Group gap={7}>
              <Avatar src={item?.avatar} />
              <span>{item.label}</span>
            </Group>
          </Group>
        </Combobox.Option>
      );
    });

  return (
    <>
      <Combobox
        store={combobox}
        onOptionSubmit={handleValueSelect}
        withinPortal={false}
        classNames={{
          dropdown: "!bg-gray-700 !text-gray-200  !border-none",
        }}
      >
        <div>
          <Combobox.DropdownTarget>
            <PillsInput
              label={label}
              withAsterisk
              size="lg"
              pointer
              onClick={() => combobox.openDropdown()}
            >
              <Pill.Group>
                {/* {values} */}
                <Combobox.EventsTarget>
                  <PillsInput.Field
                    className=""
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    value={search}
                    placeholder="Search Users"
                    onChange={(event) => {
                      combobox.updateSelectedOptionIndex();
                      setSearch(event.currentTarget.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && search.length === 0) {
                        event.preventDefault();
                        handleValueRemove(value[value.length - 1]);
                      }
                    }}
                  />
                </Combobox.EventsTarget>
              </Pill.Group>
            </PillsInput>
          </Combobox.DropdownTarget>

          <Combobox.Dropdown className="bg-gray-200">
            <Combobox.Options>
              <button
                type="button"
                onClick={open}
                className="p-4 w-full flex items-center  justify-between"
              >
                Add new {label == "Speakers" ? "speaker" : "moderator"}{" "}
                <span>+</span>
              </button>
              <ScrollArea.Autosize type="scroll" mah={200}>
                {options}
              </ScrollArea.Autosize>
            </Combobox.Options>
          </Combobox.Dropdown>

          {values.length > 0 && (
            <div className="space-y-1.5 w-full mt-2">{valuesUsers}</div>
          )}
        </div>
      </Combobox>

      <AddUserModal opened={opened} close={close} label={label} />
    </>
  );
}

export function AddUserModal({
  opened,
  close,
  label,
}: {
  opened: boolean;
  close: () => void;
  label: string;
}) {
  const [image, setImage] = useState<FileWithPath[]>([]);
  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      image: "",
      event_id: 19,
    },

    validate: {
      first_name: (value) => (value ? null : "First name is required"),
      last_name: (value) => (value ? null : "Last name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const { mutateAsync, isSuccess, isPending } = useCreateUser();

  const handleSubmit = async (values) => {
    if (!image.length) {
      form.setFieldError("image", "image is required");
      return;
    }
    const image_url = await uploadImageCloud(image);

    mutateAsync({
      ...values,
      image: image_url,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      centered
      w={460}
    >
      <div className="p-4">
        <h2 className="font-bold text-xl text-white capitalize">
          Add {label == "Speakers" ? "speaker" : "moderator"}
        </h2>

        <form
          onSubmit={form.onSubmit((values, _event) => {
            _event?.stopPropagation();
            handleSubmit(values);
          })}
          className="space-y-5 mt-6"
        >
          <div className="flex flex-col justify-center">
            <p className="text-gray-200 font-semibold mb-2">Profile</p>
            <div className=" mx-auto w-[158px] h-[158px] rounded-full overflow-hidden border border-gray-500 ">
              <UploadImage coverImage={image} setcoverImage={setImage} />
              {form?.errors?.image && (
                <div className="text-red-500 text-sm">
                  {form?.errors?.image}
                </div>
              )}
            </div>
          </div>

          <TextInput
            withAsterisk
            label="First Name"
            placeholder="John"
            size="md"
            {...form.getInputProps("first_name")}
          />
          <TextInput
            withAsterisk
            label="Last Name"
            placeholder="Doe"
            size="md"
            {...form.getInputProps("last_name")}
          />
          <TextInput
            withAsterisk
            label="Email"
            size="md"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />

          <div className="w-full flex items-center justify-between [&>*]:flex-1 gap-4 pt-6">
            <Button
              type="button"
              onClick={close}
              variant="filled"
              className="!bg-[#2D2D2D] text-white"
              size="md"
              radius="xs"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="filled"
              className="!text-gray-900 !bg-white"
              size="md"
              radius="xs"
              disabled={isPending}
            >
              {isPending ? "Adding..." : " Add"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
