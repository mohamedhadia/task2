"use client";

import { useEffect, useState } from "react";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  rem,
  Avatar,
  Pagination,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import classes from "./sessions.module.css";
import clsx from "clsx";
import { useSessions } from "../hooks/general";
import { Session } from "../hooks/types";
import { formateTime, formatedDate } from "../lib/utils";
import {
  AlarmClock,
  Calendar,
  CalendarCheck,
  Clock,
  Pencil,
  PencilIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ThProps {
  children?: React.ReactNode;
  reversed?: boolean;
  sorted?: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={clsx(classes.th, "first:w-[700px] py-0")}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="center">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          {children && (
            <Center className={`size-5 rounded-lg`}>
              <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </Center>
          )}
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function sortData(
  data: Session[],
  payload: { sortBy: keyof Session | null; reversed: boolean }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return data;
  }

  if (sortBy == "venue") {
    return [...data].sort((a, b) => {
      if (payload.reversed) {
        return (b[sortBy]?.name as string).localeCompare(
          a[sortBy]?.name as string
        );
      }

      return (a[sortBy]?.name as string).localeCompare(
        b[sortBy]?.name as string
      );
    });
  }

  return [...data].sort((a, b) => {
    if (payload.reversed) {
      return (b[sortBy] as string).localeCompare(a[sortBy] as string);
    }

    return (a[sortBy] as string).localeCompare(b[sortBy] as string);
  });
}

export function SessionsTable() {
  const router = useRouter();

  const [activePage, setPage] = useState(1);

  const { data: sessions, isLoading } = useSessions({
    event_id: 19,
    limit: 10,
    offset: (activePage - 1) * 10,
  });
  const [sortedData, setSortedData] = useState(sessions?.sessions || []);

  const [sortBy, setSortBy] = useState<keyof Session | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  console.log(sortedData, "sortedData");

  const setSorting = (field: keyof Session) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sessions?.sessions, { sortBy: field, reversed }));
  };

  const rows = sortedData?.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>
        {
          <div className="flex items-center gap-4 font-medium">
            <Avatar size="md" src={row?.cover_image} radius={"md"}>
              {row?.title[0]}
            </Avatar>
            {row.title}
          </div>
        }
      </Table.Td>
      <Table.Td>
        <span className="flex items-center justify-center gap-2">
          {row.date !== "" ? (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              {formatedDate(row.date)}
            </>
          ) : (
            "No Date"
          )}
        </span>
      </Table.Td>
      <Table.Td>
        <span className="flex items-center justify-center gap-2">
          {row.date !== "" ? (
            <>
              <AlarmClock className="w-5 h-5 mr-2" />
              {formateTime(row.from) + " - " + formateTime(row.till)}
            </>
          ) : (
            "No Time"
          )}
        </span>
      </Table.Td>
      <Table.Td>
        <p className="flex items-center justify-center gap-2">
          {row.venue?.name}
        </p>
      </Table.Td>
      <Table.Td>
        <span className="flex items-center justify-center ">
          <PencilIcon
            className="w-5 h-5 text-gray-200 cursor-pointer"
            onClick={() => {
              router.push(`/dashboard/sessions/session/?session_id=${row.id}`);
            }}
          />
        </span>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    if (sessions?.sessions) {
      setSortedData(sessions?.sessions);
    }
  }, [sessions?.sessions]);
  return (
    <>
      <ScrollArea>
        <Table
          horizontalSpacing="md"
          verticalSpacing="lg"
          miw={700}
          layout="fixed"
          classNames={{
            th: "bg-gray-800",
            tr: "!border-gray-500 ",
          }}
        >
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                Session Name
              </Th>
              <Th
                sorted={sortBy === "date"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("date")}
              >
                Date
              </Th>
              <Th
                sorted={sortBy === "from"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("from")}
              >
                Time
              </Th>
              <Th
                sorted={sortBy === "venue"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("venue")}
              >
                venue
              </Th>
              <Th onSort={() => {}}></Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows?.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text fw={500} ta="center">
                    {isLoading ? "Loading..." : "Nothing found"}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      {sessions && (
        <div className="flex items-center justify-between p-3 bg-gray-800 ">
          <p>
            Showing {sessions?.number} entires of {sessions?.count}
          </p>
          <Pagination
            value={activePage}
            onChange={setPage}
            total={sessions?.count / 10 || 0}
            // color="rgba(66, 66, 66, 1)"
            radius="xs"
            classNames={{
              control:
                "data-[active]:!bg-gray-500 !bg-transparent !text-white !border-gray-500",
            }}
          />
        </div>
      )}
    </>
  );
}
