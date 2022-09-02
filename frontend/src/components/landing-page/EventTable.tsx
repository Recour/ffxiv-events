import { ChevronRightIcon } from "@chakra-ui/icons";
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Button, Skeleton, Text, Show } from "@chakra-ui/react";
import moment from "moment";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../consts/routes";
import { isHousingDistrict } from "../../helpers/isHousingDistrict";
import { COLORS } from "../../styles/theme";
import { Event } from "../../types/Event";
import { EVENT_TABLE_COLUMNS } from "../../types/EventTableColumn";
import { EventTabTableColumn } from "./EventTabs";

const cellStyle = {
  color: COLORS.WHITE
};

const TABLE_CELL_PADDING = {
  base: 1,
  sm: 3
};

interface EventTableProps {
  events: Event[];
  isLoading: boolean;
  caption: string;
  eventTabTableColumns: EventTabTableColumn[];
  buttonText: string;
};

const EventTable = (eventTableProps: EventTableProps) => {
  const { events, isLoading, caption, eventTabTableColumns, buttonText } = eventTableProps;
  const navigate = useNavigate();

  const SkeletonTd = ({ isNumeric, px, children }: { isNumeric?: boolean, px?: {}, children?: ReactElement }) => {
    return (
      <Td px={px} isNumeric={isNumeric}>
        <Skeleton isLoaded={!isLoading}>
          {children}
        </Skeleton>
      </Td>
    );
  };

  return (
    <TableContainer>
      <Table
        size={{
          base: "xs",
          sm: "sm"
        }}
        variant="striped"
        colorScheme="whiteAlpha"
        style={{ tableLayout: "fixed" }}
      >
        <TableCaption color={cellStyle}>{caption}</TableCaption>

        <Thead>
          <Tr>
            {eventTabTableColumns.map((eventTabTableColumn, index) =>
              <Show above={eventTabTableColumn.showAbove} key={index}>
                <Th px={TABLE_CELL_PADDING} isNumeric={eventTabTableColumn.column.isNumeric} color={cellStyle}>
                  <Text>
                    {eventTabTableColumn.column.header}
                  </Text>
                </Th>
              </Show>
            )}
          </Tr>
        </Thead>

        <Tbody>
          {events.map((event, index) =>
            <Tr key={index}>
              {eventTabTableColumns.map((eventTabTableColumn, index) => {
                let value = event[eventTabTableColumn.column.eventField as keyof typeof event];

                if (eventTabTableColumn.column === EVENT_TABLE_COLUMNS.LOCATION) {
                  value = `${event.map}${isHousingDistrict(event.map) ? ` (W${event.ward} P${event.plot})` : ""}`;
                } else if (eventTabTableColumn.column === EVENT_TABLE_COLUMNS.START_TIME) {
                  value = moment.utc(event.startTime).fromNow()
                } else if (eventTabTableColumn.column === EVENT_TABLE_COLUMNS.GUESTS) {
                  value = event.guests.length;
                }

                return (
                  <Show above={eventTabTableColumn.showAbove} key={index}>
                    <SkeletonTd px={TABLE_CELL_PADDING} isNumeric={eventTabTableColumn.column.isNumeric}>
                      <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                        {value}
                      </Text>
                    </SkeletonTd>
                  </Show>
                );
              })}

              <SkeletonTd px={TABLE_CELL_PADDING} isNumeric>
                <Button
                  size="xs"
                  colorScheme="whiteAlpha"
                  rightIcon={<ChevronRightIcon />}
                  onClick={() => navigate(ROUTES.EVENTS_DETAIL_MODAL.replace(':id', event.id))}
                >
                  {buttonText}
                </Button>
              </SkeletonTd>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer >
  );
};

export default EventTable;
