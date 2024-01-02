"use client";

import React, { useEffect, useState } from "react";
import { TextInput, Button, Popover, Textarea, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { HelpCircle } from "lucide-react";
import { DateInput, TimeInput } from "@mantine/dates";
import { MultiSelectComp } from "../../../../../components/MultiSelectComp";
import { UploadImage } from "../../../../../components/UploadImage";
import { FileWithPath } from "@mantine/dropzone";
import { useCreateSession, useSessionById } from "../../../../../hooks/general";
import { getFileFromUrl, uploadImageCloud } from "../../../../../lib/utils";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export type User = {
  value: string | number;
  label: string;
  avatar: string;
};

const schema = z.object({
  title: z.string().min(2, { message: "Name should have at least 2 letters" }),
  subtitle: z
    .string()
    .min(2, { message: "subtitle should have at least 2 letters" }),
  date: z.date(),
  from: z.string(),
  till: z.string(),
  description: z
    .string()
    .min(2, { message: "description should have at least 2 letters" }),
  venue: z.string(),
  event_id: z.number(),
});

export default function NewSession({ searchParams }: Props) {
  const router = useRouter();
  const { session_id } = searchParams;

  const [searchUsers, setSearchUsers] = useState("");
  const [valueUsers, setValueUsers] = useState<User[]>([]);

  const [searchMods, setSearchMods] = useState("");
  const [valueMods, setValueMods] = useState<User[]>([]);

  const [coverImage, setcoverImage] = useState<FileWithPath[]>([]);

  const { data: sessionData, isSuccess: sessionDataSuccess } = useSessionById(
    session_id ? +session_id : undefined
  );
  const { mutateAsync, isSuccess, isPending } = useCreateSession();

  const form = useForm({
    initialValues: {
      title: "",
      subtitle: "",
      date: new Date(),
      from: "12:00",
      till: "01:00",
      description: "",
      venue: "",
      cover_image: "",
      speaker_ids: [],
      moderator_ids: [],
      event_id: 19,
      ...sessionData,
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = async (values: any) => {
    if (!coverImage.length) {
      form.setFieldError("cover_image", "Cover image is required");
      return;
    }
    if (!valueUsers?.length) {
      form.setFieldError("speaker_ids", "Speakers are required");
      return;
    }

    const cover_imge_url = await uploadImageCloud(coverImage);
    if (!cover_imge_url) return;

    // i'm handling only post as i didn't find put/patch api.
    mutateAsync({
      ...values,
      cover_image: cover_imge_url,
      speaker_ids: valueUsers?.map((item) => +item?.value) || [],
      moderator_ids: valueMods?.map((item) => +item?.value) || [],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/dashboard/sessions");
    }
  }, [isSuccess, router]);

  useEffect(() => {
    if (sessionDataSuccess) {
      form.setValues({
        title: sessionData?.title,
        subtitle: sessionData?.subtitle,
        date: new Date(sessionData?.date),
        from: sessionData?.from,
        till: sessionData?.till,
        description: sessionData?.description,
        venue: sessionData?.venue,
        cover_image: sessionData?.cover_image,

        speaker_ids:
          sessionData?.speakers?.map((item) => ({
            value: item?.id,
            label: `${item?.first_name} ${item?.last_name}`,
            avatar: item?.avatar,
          })) || [],
        moderator_ids:
          sessionData?.moderators?.map((item) => ({
            value: item?.id,
            label: `${item?.first_name} ${item?.last_name}`,
            avatar: item?.avatar,
          })) || [],
      });

      setValueUsers(
        sessionData?.speakers?.map((item) => ({
          value: item?.id,
          label: `${item?.first_name} ${item?.last_name}`,
          avatar: item?.avatar,
        })) || []
      );

      setValueMods(
        sessionData?.moderators?.map((item) => ({
          value: item?.id,
          label: `${item?.first_name} ${item?.last_name}`,
          avatar: item?.avatar,
        })) || []
      );

      getFileFromUrl(sessionData?.cover_image, "cover_image").then((res) => {
        setcoverImage([res]);
      });
    }
  }, [sessionDataSuccess]);

  return (
    <form
      onSubmit={form.onSubmit((values, _event) => {
        _event?.stopPropagation();
        handleSubmit(values);
      })}
    >
      <div className="w-full flex items-center justify-between py-4">
        <div>
          <Link href={`/dashboard/sessions`}>{`< All Sessions`}</Link>
          <h1 className="text-xl ml-3 font-bold text-gray-100">New Session</h1>
        </div>
        <div className=" flex items-center justify-between [&>*]:min-w-[100px] gap-1 pt-6">
          <Button
            type="button"
            onClick={() => {
              form.reset();
              router.push("/dashboard/sessions");
            }}
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
            {isPending ? "Creating..." : " Next"}
          </Button>
        </div>
      </div>
      <div className="flex mx-auto max-w-3xl bg-gray-800 p-10">
        <div className="w-full space-y-8">
          <TextInput
            size="lg"
            withAsterisk
            label="Session Title"
            placeholder="Start Typing..."
            {...form.getInputProps("title")}
          />

          <div className="relative">
            <TextInput
              size="lg"
              withAsterisk
              label="Session Subtitle"
              placeholder="Start Typing..."
              {...form.getInputProps("subtitle")}
            />
            <div className="absolute right-0 top-1">
              <Popover
                width={200}
                position="right"
                withArrow
                classNames={{
                  dropdown: "!bg-gray-900 text-gray-100 !border-none",
                  arrow: "bg-gray-900 !border-none",
                }}
              >
                <Popover.Target>
                  <HelpCircle className="size-5 text-gray-400" />
                </Popover.Target>
                <Popover.Dropdown>
                  <p className="text-sm">
                    Unique info about the session, that will be displayed under
                    the title
                  </p>
                </Popover.Dropdown>
              </Popover>
            </div>
          </div>

          {/* data & time */}
          <div className="flex items-center gap-6">
            <DateInput
              size="lg"
              withAsterisk
              clearable
              defaultValue={new Date()}
              min={new Date() as any}
              label="Date"
              placeholder="Select date"
              weekendDays={[]}
              {...form.getInputProps("date")}
              className="w-full"
              classNames={{
                day: "data-[selected]:!bg-gray-900 ",
              }}
            />
            <TimeInput
              radius="xs"
              size="lg"
              label="From"
              withAsterisk
              {...form.getInputProps("from")}
              placeholder="Time from"
            />
            <TimeInput
              radius="xs"
              size="lg"
              label="Till"
              withAsterisk
              {...form.getInputProps("till")}
              placeholder="Time till"
            />
          </div>

          <Textarea
            {...form.getInputProps("description")}
            label="Description"
            placeholder="Type details"
            autosize
            size="lg"
            minRows={3}
            maxRows={5}
          />
          <hr className="border-gray-600 " />

          <div>
            <MultiSelectComp
              search={searchUsers}
              setSearch={setSearchUsers}
              value={valueUsers}
              setValue={setValueUsers}
              label="Speakers"
            />
            {form?.errors?.speaker_ids && (
              <div className="text-red-500 text-sm">
                {form?.errors?.speaker_ids}
              </div>
            )}
          </div>

          <div>
            <MultiSelectComp
              search={searchMods}
              setSearch={setSearchMods}
              value={valueMods}
              setValue={setValueMods}
              label="Moderators"
            />

            {form?.errors?.moderator_ids && (
              <div className="text-red-500 text-sm">
                {form?.errors?.moderator_ids}
              </div>
            )}
          </div>

          <hr className="border-gray-600 " />

          <div>
            <UploadImage
              coverImage={coverImage}
              setcoverImage={setcoverImage}
            />
            {form?.errors?.cover_image && (
              <div className="text-red-500 text-sm">
                {form?.errors?.cover_image}
              </div>
            )}
          </div>
          <Select
            size="lg"
            {...form.getInputProps("venue")}
            clearable
            label="Venue "
            placeholder="Select"
            data={[]}
          />
        </div>
      </div>
    </form>
  );
}
