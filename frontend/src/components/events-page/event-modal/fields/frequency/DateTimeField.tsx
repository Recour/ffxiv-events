import { Box, Flex, Icon, Input, Text } from "@chakra-ui/react";
import moment from "moment";
import { MdAccessTime } from "@react-icons/all-files/md/MdAccessTime";
import { EventModalFieldProps } from "../../../../../types/EventModalFieldProps";
import { COLORS } from "../../../../../styles/theme";

export const TIME_FORMAT = "HH:mm";
export const DATE_FORMAT = "ddd DD MMM HH:mm";
export const EDITABLE_FORMAT = "YYYY-MM-DDTHH:mm";

interface DateTimeFieldProps extends EventModalFieldProps {
  isRecurring: boolean;
  minDate: string;
  startTime: string;
  endTime: string;
  setStartTime: (startTime: string) => void;
  setEndTime: (startTime: string) => void;
}

const DateTimeField = (dateTimeFieldProps: DateTimeFieldProps) => {
  const { isEditable, isRecurring, startTime, endTime, minDate, setStartTime, setEndTime } = dateTimeFieldProps;

  const inputType = isRecurring ? "time" : "datetime-local";
  const format = isRecurring ? TIME_FORMAT : DATE_FORMAT;
  const editableFormat = isRecurring ? TIME_FORMAT : EDITABLE_FORMAT;

  if (isEditable) {
    return (
      <Flex
        alignItems="center"
      >
        <Input
          placeholder="Select start time"
          type={inputType}
          value={moment.utc(startTime, editableFormat).local().format(editableFormat)}
          min={moment(minDate).format(editableFormat)}
          step={900}
          onChange={(e) => setStartTime(isRecurring ?
            moment(e.target.value, editableFormat).toISOString()
            :
            moment.utc(new Date(e.target.value)).toISOString()
          )}
          width="fit-content"
          focusBorderColor={COLORS.GREY_NORMAL}
        />

        <Box m={3}>
          -
        </Box>

        <Input
          placeholder="Select end time"
          type={inputType}
          value={moment.utc(endTime, editableFormat).local().format(editableFormat)}
          min={moment(startTime).format(editableFormat)}
          step={900}
          onChange={(e) => setEndTime(isRecurring ?
            moment(e.target.value, editableFormat).toISOString()
            :
            moment.utc(new Date(e.target.value)).toISOString()
          )}
          width="fit-content"
          focusBorderColor={COLORS.GREY_NORMAL}
        />
      </Flex>
    );
  } else {
    return (
      <Flex direction="row" alignItems="center">
        <Icon as={MdAccessTime} mr={1} />

        <Text fontSize="sm">
          {moment(startTime).format(format)} - {moment(endTime).format(format)}
        </Text>
      </Flex>
    );
  }
};

export default DateTimeField;
