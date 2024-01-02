import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { axiosAuth } from "./axiosConfig";

import {
  filterParams,
  showErrorNotification,
  showSuccessNotification,
} from "../lib/utils";
import { Session, SessionCreate, UserCreate } from "./types";

const getAllUsers = async (
  queryParams: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  // Filter out undefined values
  const filteredQueryParams = filterParams(queryParams);
  const query = new URLSearchParams(filteredQueryParams).toString();
  const res = await axiosAuth.get(`/get-users/?${query}`);
  return res.data;
};

export function useAllUsers(
  queryParams: { [s: string]: unknown } | ArrayLike<unknown>
) {
  return useQuery({
    queryKey: ["all_users", queryParams],
    queryFn: () => getAllUsers(queryParams),
    placeholderData: keepPreviousData,
  });
}

const getUsers = async (
  queryParams: { [s: string]: unknown } | ArrayLike<unknown>
) => {
  // Filter out undefined values
  const filteredQueryParams = filterParams(queryParams);
  const query = new URLSearchParams(filteredQueryParams).toString();
  const res = await axiosAuth.get(`/search-users/?${query}`);
  return res.data;
};

export function useUsers(
  queryParams: { [s: string]: unknown } | ArrayLike<unknown>
) {
  return useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => getUsers(queryParams),
    placeholderData: keepPreviousData,
    retry: false,
  });
}

// create users
const createUser = async (values: UserCreate) => {
  const res = await axiosAuth.post(`/create-users`, values);
  return res.data;
};

export function useCreateUser() {
  return useMutation({
    mutationKey: ["session"],
    mutationFn: (values) => createUser(values),

    onError: (error) => {
      showErrorNotification(error);
    },
    onSuccess: (data) => {
      showSuccessNotification(data?.message);
    },
  });
}

// get sessions
const getSessions = async (
  queryParams: { [s: string]: unknown } | ArrayLike<unknown>
): Promise<{
  sessions: Session[];
  count: number;
  number: number;
  is_last_offset: boolean;
}> => {
  const filteredQueryParams = filterParams(queryParams);
  const query = new URLSearchParams(filteredQueryParams).toString();
  const res = await axiosAuth.get(`/get-sessions?${query}`);
  return res.data;
};

export function useSessions(
  queryParams: { [s: string]: unknown } | ArrayLike<unknown>
) {
  return useQuery({
    queryKey: ["sessions", queryParams],
    queryFn: () => getSessions(queryParams),
    placeholderData: keepPreviousData,
  });
}

// get session by id

const getSessionById = async (id: number | undefined) => {
  const res = await axiosAuth.get(`/session-details/${id}?event_id=19`);
  return res.data;
};

export function useSessionById(id: number | undefined) {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => getSessionById(id),
    placeholderData: keepPreviousData,
    enabled: !!id,
  });
}

// create session
const createSession = async (values: SessionCreate) => {
  const res = await axiosAuth.post(`/create-sessions`, values);
  return res.data;
};

export function useCreateSession() {
  return useMutation({
    mutationKey: ["session"],
    mutationFn: (values) => createSession(values),

    onError: (error) => {
      showErrorNotification(error);
    },
    onSuccess: (data) => {
      showSuccessNotification(data?.message);
    },
  });
}
