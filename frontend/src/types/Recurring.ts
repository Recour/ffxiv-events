export interface Recurring {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export type RecurringField = keyof Recurring;

export const RECURRING_FIELDS: { [key: string]: RecurringField } = {
  DAY_OF_WEEK: "dayOfWeek",
  START_TIME: "startTime",
  END_TIME: "endTime"
};

export type RecurringFilters = {
  [key in RecurringField]?: number;
};
