import { RadioGroup, Stack, Radio, Box, Checkbox, CheckboxGroup, Text, Divider } from "@chakra-ui/react";
import moment from "moment";
import { SetStateAction, useEffect, useState } from "react";
import { NewEvent } from "../../../../../types/Event";
import { EventModalFieldProps } from "../../../../../types/EventModalFieldProps";
import { Recurring } from "../../../../../types/Recurring";
import InfoText from "../../../../shared/InfoText";
import { EARLIEST_START_TIME } from "../../EventModal";
import DateTimeField, { TIME_FORMAT } from "./DateTimeField";

const RECURRING_TYPES = {
  ONE_TIME: "One time",
  RECURRING: "Recurring",
  COMING_SOON: "Coming soon"
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]

interface FrequencyFieldProps extends EventModalFieldProps {
  formState: NewEvent;
  setFormState: React.Dispatch<SetStateAction<NewEvent>>;
};

const FrequencyField = (frequencyFieldProps: FrequencyFieldProps) => {
  const { isEditable, formState, setFormState } = frequencyFieldProps;

  const isRecurring = !!formState.recurrings.length;

  const selectedDaysOfWeek: string[] = [];
  const initialSelectedStartTimes: string[] = [];
  const initialSelectedEndTimes: string[] = [];

  formState.recurrings.forEach(recurring => {
    const previousDayOfWeek = recurring.dayOfWeek - 1 < 1 ? 7 : recurring.dayOfWeek - 1
    const nextDayOfWeek = recurring.dayOfWeek + 1 > Object.keys(DAYS_OF_WEEK).length ? 1 : recurring.dayOfWeek + 1;

    if (recurring.endTime === '23:59') {
      const twinRecurring = formState.recurrings.find(potentialTwinRecurring =>
        potentialTwinRecurring.dayOfWeek === nextDayOfWeek && potentialTwinRecurring.startTime === '00:00'
      );

      if (twinRecurring) {
        selectedDaysOfWeek.push(DAYS_OF_WEEK[recurring.dayOfWeek - 1]); // Array is 0-based
        initialSelectedStartTimes.push(recurring.startTime);
        initialSelectedEndTimes.push(twinRecurring.endTime);
      }
    } else if (recurring.startTime === '00:00') {
      const twinRecurring = formState.recurrings.find(potentialTwinRecurring =>
        potentialTwinRecurring.dayOfWeek === previousDayOfWeek && potentialTwinRecurring.endTime === '23:59'
      );

      if (!twinRecurring) {
        selectedDaysOfWeek.push(DAYS_OF_WEEK[recurring.dayOfWeek - 1]); // Array is 0-based
        initialSelectedStartTimes.push(recurring.startTime);
        initialSelectedEndTimes.push(recurring.endTime);
      }
    } else {
      selectedDaysOfWeek.push(DAYS_OF_WEEK[recurring.dayOfWeek - 1]); // Array is 0-based
    }
  });

  const [selectedRecurringType, setSelectedRecurringType] = useState(
    formState.comingSoon ?
      RECURRING_TYPES.COMING_SOON
      :
      (formState.recurrings.length ?
        RECURRING_TYPES.RECURRING
        :
        RECURRING_TYPES.ONE_TIME
      )
  );
  
  const [selectedStartTimes, setSelectedStartTimes] = useState<string[]>(initialSelectedStartTimes);
  const [selectedEndTimes, setSelectedEndTimes] = useState<string[]>(initialSelectedEndTimes);

  const handleRadioChange = (value: string) => {
    setSelectedRecurringType(value);

    const newRecurrings: Recurring[] = [];

    if (value === RECURRING_TYPES.RECURRING) {
      newRecurrings.push({
        dayOfWeek: 1,
        startTime: moment.utc(formState.startTime).format(TIME_FORMAT),
        endTime: moment.utc(formState.endTime).format(TIME_FORMAT)
      });
    }

    setFormState((formState) => ({
      ...formState,
      recurrings: newRecurrings,
      comingSoon: value === RECURRING_TYPES.COMING_SOON
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedDaysOfWeek = [...selectedDaysOfWeek];
    const newSelectedStartTimes = [...selectedStartTimes];
    const newSelectedEndTimes = [...selectedEndTimes];
    const changedDayOfWeek = e.target.value;

    if (newSelectedDaysOfWeek.includes(changedDayOfWeek)) {
      [newSelectedDaysOfWeek, newSelectedStartTimes, newSelectedEndTimes].forEach(arrayToSet => {
        arrayToSet.splice(newSelectedDaysOfWeek.indexOf(changedDayOfWeek), 1);
      });
    } else {
      newSelectedDaysOfWeek.push(changedDayOfWeek);
      newSelectedStartTimes.push(moment.utc(formState.startTime).format(TIME_FORMAT));
      newSelectedEndTimes.push(moment.utc(formState.endTime).format(TIME_FORMAT));
    }

    setFormState((formState) => {
      const newRecurrings: Recurring[] = [];

      newSelectedDaysOfWeek.forEach((selectedDayOfWeek) => {
        const dayOfWeek = DAYS_OF_WEEK.indexOf(selectedDayOfWeek) + 1; // Array is zero-based
        const startTime = newSelectedStartTimes[newSelectedDaysOfWeek.indexOf(selectedDayOfWeek)];
        const endTime = newSelectedEndTimes[newSelectedDaysOfWeek.indexOf(selectedDayOfWeek)];

        if (moment.utc(startTime, TIME_FORMAT).isAfter(moment.utc(endTime, TIME_FORMAT))) {
          newRecurrings.push({
            dayOfWeek: dayOfWeek,
            startTime,
            endTime: '23:59'
          });

          newRecurrings.push({
            dayOfWeek: dayOfWeek + 1,
            startTime: '00:00',
            endTime
          });
        } else {
          newRecurrings.push({
            dayOfWeek,
            startTime,
            endTime
          });
        }
      });

      return {
        ...formState,
        recurrings: newRecurrings
      };
    });
  };

  useEffect(() => {
    const selectedStartTimes: string[] = [];
    const selectedEndTimes: string[] = [];

    formState.recurrings.forEach(recurring => {
      const previousDayOfWeek = recurring.dayOfWeek - 1 < 1 ? 7 : recurring.dayOfWeek - 1
      const nextDayOfWeek = recurring.dayOfWeek + 1 > Object.keys(DAYS_OF_WEEK).length ? 1 : recurring.dayOfWeek + 1;

      // If the recurring starts at 00:00, check if there is a recurring for the previous day that ends at 23:59.
      if (recurring.endTime === '23:59') {
        const twinRecurring = formState.recurrings.find(potentialTwinRecurring =>
          potentialTwinRecurring.dayOfWeek === nextDayOfWeek && potentialTwinRecurring.startTime === '00:00'
        );

        if (twinRecurring) {
          selectedStartTimes.push(recurring.startTime);
          selectedEndTimes.push(twinRecurring.endTime);
        }
      } else if (recurring.startTime === '00:00') {
        const twinRecurring = formState.recurrings.find(potentialTwinRecurring =>
          potentialTwinRecurring.dayOfWeek === previousDayOfWeek && potentialTwinRecurring.endTime === '23:59'
        );

        if (!twinRecurring) {
          selectedStartTimes.push(recurring.startTime);
          selectedEndTimes.push(recurring.endTime);
        }
      } else {
        selectedStartTimes.push(recurring.startTime);
        selectedEndTimes.push(recurring.endTime);
      }
    });

    setSelectedStartTimes(selectedStartTimes);
    setSelectedEndTimes(selectedEndTimes);

    setSelectedRecurringType(
      formState.comingSoon ?
        RECURRING_TYPES.COMING_SOON
        :
        (formState.recurrings.length ?
          RECURRING_TYPES.RECURRING
          :
          RECURRING_TYPES.ONE_TIME
        ));
  }, [formState]);

  return (
    <>
      {isEditable &&
        <Box
          mb={{
            base: selectedRecurringType !== RECURRING_TYPES.COMING_SOON ? 2 : 0,
            sm: selectedRecurringType !== RECURRING_TYPES.COMING_SOON ? 3 : 0
          }}
        >
          <RadioGroup
            colorScheme="blackAlpha"
            onChange={(value) => handleRadioChange(value)} value={selectedRecurringType}
          >
            <Stack
              direction={{
                base: "column",
                sm: "row"
              }}
              spacing={{
                base: 1,
                sm: 6
              }}
            >
              {Object.values(RECURRING_TYPES).map((recurringType, index) =>
                <Radio
                  value={recurringType}
                  key={index}
                >
                  {recurringType}
                </Radio>)}
            </Stack>
          </RadioGroup>

          {selectedRecurringType !== RECURRING_TYPES.COMING_SOON &&
            <Divider
              mt={{
                base: 2,
                sm: 3
              }}
              orientation="horizontal"
            />
          }
        </Box>
      }

      {selectedRecurringType === RECURRING_TYPES.ONE_TIME ?
        <DateTimeField
          isEditable={isEditable}
          isRecurring={isRecurring}
          minDate={EARLIEST_START_TIME.toISOString()}
          startTime={formState.startTime}
          endTime={formState.endTime}
          setStartTime={(newStartTime) =>
            setFormState(formState => ({
              ...formState,
              startTime: newStartTime
            }))
          }
          setEndTime={(newEndTime) =>
            setFormState(formState => ({
              ...formState,
              endTime: newEndTime
            }))
          }
        />
        :
        selectedRecurringType === RECURRING_TYPES.RECURRING ?
          <>
            {isEditable ?
              <Box
                mt={{
                  base: 2,
                  sm: 3
                }}
              >
                <CheckboxGroup
                  colorScheme="blackAlpha"
                  value={selectedDaysOfWeek}
                >
                  <Stack
                    direction="column"
                    spacing={1}
                  >
                    {DAYS_OF_WEEK.map((dayOfWeek, index) =>
                      <Box key={index}>
                        <Checkbox
                          // Index is zero-based
                          value={dayOfWeek}
                          onChange={(e) => handleCheckboxChange(e)}
                        >
                          {dayOfWeek}
                        </Checkbox>

                        {selectedDaysOfWeek.includes(dayOfWeek) &&
                          <Box mt={1}>
                            <DateTimeField
                              isEditable={isEditable}
                              isRecurring={isRecurring}
                              minDate={EARLIEST_START_TIME.toISOString()}
                              startTime={selectedStartTimes[selectedDaysOfWeek.indexOf(dayOfWeek)]} // Array is zero-based
                              endTime={selectedEndTimes[selectedDaysOfWeek.indexOf(dayOfWeek)]} // Array is zero-based
                              setStartTime={(newStartTime) => {
                                const dayOfWeekNumber: number = index + 1; // Index is 0-based
                                const selectedDaysOfWeekIndex = selectedDaysOfWeek.indexOf(dayOfWeek);
                                const endTime = selectedEndTimes[selectedDaysOfWeekIndex];
                                const endTimeHours = parseInt(endTime.split(":")[0]);
                                const endTimeMinutes = parseInt(endTime.split(":")[1]);
                                let newRecurrings = [...formState.recurrings];

                                const twinRecurring = newRecurrings.find(recurring =>
                                  recurring.dayOfWeek === dayOfWeekNumber && recurring.endTime === '23:59'
                                );

                                const recurringToChange = newRecurrings.find(recurring =>
                                  recurring.dayOfWeek === dayOfWeekNumber && recurring.endTime === endTime
                                );

                                if (moment.utc(newStartTime).isAfter(moment.utc().set("hours", endTimeHours).set("minutes", endTimeMinutes))) {
                                  if (twinRecurring) {
                                    twinRecurring.startTime = moment.utc(newStartTime).format(TIME_FORMAT);
                                  }
                                } else {
                                  if (recurringToChange) {
                                    recurringToChange.startTime = moment.utc(newStartTime).format(TIME_FORMAT);
                                  }
                                }

                                setFormState(formState => ({
                                  ...formState,
                                  recurrings: newRecurrings
                                }));
                              }}
                              setEndTime={(newEndTime) => {
                                const dayOfWeekNumber = index + 1; // Index is 0-based
                                const nextDayOfWeekNumber = dayOfWeekNumber + 1 > Object.keys(DAYS_OF_WEEK).length ? 1 : dayOfWeekNumber + 1;
                                const selectedDaysOfWeekIndex = selectedDaysOfWeek.indexOf(dayOfWeek);
                                const startTime = selectedStartTimes[selectedDaysOfWeekIndex];
                                const startTimeHours = parseInt(startTime.split(":")[0]);
                                const startTimeMinutes = parseInt(startTime.split(":")[1]);
                                let newRecurrings = [...formState.recurrings];

                                const twinRecurring = newRecurrings.find(recurring =>
                                  recurring.dayOfWeek === nextDayOfWeekNumber && recurring.startTime === '00:00'
                                );

                                const recurringToChange = newRecurrings.find(recurring =>
                                  recurring.dayOfWeek === dayOfWeekNumber && recurring.startTime === startTime
                                );

                                if (moment.utc().set("hours", startTimeHours).set("minutes", startTimeMinutes).isAfter(moment.utc(newEndTime))) {
                                  // Adjust twin recurring time if there is any, otherwise create one
                                  if (twinRecurring) {
                                    twinRecurring.endTime = moment.utc(newEndTime).format(TIME_FORMAT);
                                  } else {
                                    newRecurrings.push({
                                      dayOfWeek: nextDayOfWeekNumber,
                                      startTime: '00:00',
                                      endTime: moment.utc(newEndTime).format(TIME_FORMAT)
                                    });

                                    if (recurringToChange) {
                                      recurringToChange.endTime = '23:59';
                                    }
                                  }
                                } else {
                                  // Remove twin recurring if there is one, adjust recurring end time
                                  if (twinRecurring) {
                                    newRecurrings.splice(newRecurrings.indexOf(twinRecurring), 1);
                                  }

                                  if (recurringToChange) {
                                    recurringToChange.endTime = moment.utc(newEndTime).format(TIME_FORMAT);
                                  }
                                }

                                setFormState(formState => ({
                                  ...formState,
                                  recurrings: newRecurrings
                                }));
                              }}
                            />
                          </Box>
                        }
                      </Box>
                    )}
                  </Stack>
                </CheckboxGroup>
              </Box>
              :
              <>
                {selectedDaysOfWeek
                  .sort((a, b) => DAYS_OF_WEEK.indexOf(a) > DAYS_OF_WEEK.indexOf(b) ? 1 : -1)
                  .map((selectedDayOfWeek, index) =>
                    <Text key={index}>
                      {`${selectedDayOfWeek} 
                  ${moment.utc(selectedStartTimes[index], TIME_FORMAT).local().format(TIME_FORMAT)} 
                  - 
                  ${moment.utc(selectedEndTimes[index], TIME_FORMAT).local().format(TIME_FORMAT)}`}
                    </Text>
                  )}
              </>
            }
          </>
          :
          !isEditable &&
          <Text>
            Coming soon
          </Text>
      }

      {selectedRecurringType !== RECURRING_TYPES.COMING_SOON &&
        <Box mt={2}>
          <InfoText
            text="Times are displayed in your local timezone."
          />
        </Box>
      }
    </>
  );
};

export default FrequencyField;
