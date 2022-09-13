import { Prisma, PrismaClient } from '@prisma/client';
import { s3 } from "../aws";
import * as dotenv from 'dotenv';
import moment from 'moment';

dotenv.config();

export const prisma = new PrismaClient();

// Users
export const findUser = async (userId: number) => {
  return await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      photoUrl: true
    }
  });
}

const mapRecurringsInternal = (recurrings) => {
  return recurrings.map(recurring => ({
    dayOfWeek: recurring.dayOfWeek,
    startTime: moment.utc(recurring.startTime, "HH:mm").toISOString(),
    endTime: moment.utc(recurring.endTime, "HH:mm").toISOString()
  }))
};

const mapRecurringsExternal = (recurrings) => {
  return recurrings.map(recurring => ({
    ...recurring,
    startTime: moment.utc(recurring.startTime).format("HH:mm"),
    endTime: moment.utc(recurring.endTime).format("HH:mm")
  }))
};

// Events
export const createEvent = async (event: any, user: any) => {
  return await prisma.event.create({
    data: {
      ...event,
      host: {
        connect: {
          id: user.id
        }
      },
      recurrings: {
        create: mapRecurringsInternal(event.recurrings)
      }
    }
  });
};

export const updateEvent = async (event: any) => {
  const eventId = parseInt(event.id);

  return await prisma.event.update({
    where: {
      id: eventId
    },
    data: {
      name: event.name,
      type: event.type,
      server: event.server,
      map: event.map,
      ward: event.ward,
      plot: event.plot,
      startTime: event.startTime,
      endTime: event.endTime,
      palette: event.palette,
      description: event.description,
      backgroundImage: event.backgroundImage,
      website: event.website,
      video: event.video,
      minIlvl: event.minIlvl,
      roleSlots: event.roleSlots,
      treasureMaps: event.treasureMaps,
      adultOnly: event.adultOnly,
      genres: event.genres,
      recurrings: {
        deleteMany: {},
        create: mapRecurringsInternal(event.recurrings)
      }
    }
  });
};

export const destroyEvent = async (eventId: number) => {
  const eventToDelete = await prisma.event.findUnique({
    where: {
      id: eventId
    }
  });

  if (eventToDelete.backgroundImage) {
    await deleteEventBackgroundImage(eventToDelete);
  }

  return await prisma.event.delete({
    where: {
      id: eventId
    }
  });
};

export const deleteEventBackgroundImage = async (event: any) => {
  const key = event.backgroundImage
    .replace('https://ffxiv-events.s3-eu-west-1.amazonaws.com/', '')
    .replace('https://ffxiv-events.s3.eu-west-1.amazonaws.com/', '');

  return await s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: key }, (err, data) => {
    console.error(err);
    console.log(data);
  }).promise();
};

const userSelect = {
  id: true,
  displayName: true,
  photoUrl: true
};

const eventIncludes = {
  host: {
    select: userSelect
  },
  guests: {
    select: userSelect
  },
  recurrings: true,
  comments: {
    take: 10,
    orderBy: {
      createdAt: Prisma.SortOrder.desc
    },
    include: {
      user: true
    }
  }
};

export const findAndCountEvents = async (
  user,
  limit,
  offset,
  orderField,
  direction,
  filters,
  live,
  future,
  attending,
  recurringFilters
) => {
  let orderBy: {} = {
    [orderField]: direction
  };

  if (orderField === 'countGuests') {
    orderBy = {
      guests: {
        '_count': direction
      }
    };
  }

  // Filters
  const timeFilter = [];

  const futureEventsFilter = {
    startTime: {
      gte: new Date()
    }
  };

  const liveEventsFilter = {
    startTime: {
      lte: new Date()
    },
    endTime: {
      gte: new Date()
    },
    comingSoon: false
  };

  const recurringEventsFilter = {
    NOT: {
      recurrings: {
        none: {}
      }
    }
  };

  const liveRecurringEventsFilter = {
    recurrings: {
      some: {
        dayOfWeek: moment.utc().isoWeekday(),
        startTime: {
          lte: moment.utc().toDate()
        },
        endTime: {
          gte: moment.utc().toDate()
        }
      }
    }
  };

  const comingSoonEventsFilter = {
    comingSoon: true
  };

  if (live) {
    timeFilter.push(liveEventsFilter);
    timeFilter.push(liveRecurringEventsFilter);
  } else if (future) {
    timeFilter.push(futureEventsFilter);
  } else {
    timeFilter.push(liveEventsFilter);
    timeFilter.push(futureEventsFilter);
  }

  if (!live) {
    timeFilter.push(recurringEventsFilter);
    timeFilter.push(comingSoonEventsFilter);
  }

  const modifiedFilters = [];

  Object.keys(filters).forEach(key => {
    // genres and treasureMaps are arrays, use hasSome for these
    if (["genres", "treasureMaps"].includes(key)) {
      const hasSomeFilter = {
        [key]: {
          hasSome: filters[key]
        }
      };

      modifiedFilters.push(hasSomeFilter);
    } else if (Array.isArray(filters[key])) {
      const inFilter = {
        [key]: {
          in: filters[key]
        }
      };

      modifiedFilters.push(inFilter);
    } else {
      modifiedFilters.push({
        [key]: filters[key]
      });
    }
  });

  if (attending) {
    modifiedFilters.push({
      guests: {
        some: {
          id: user.id
        }
      }
    });
  }

  const events = await prisma.event.findMany({
    where: {
      AND: [
        ...modifiedFilters,
        {
          OR: timeFilter
        }
      ]
    },
    take: limit,
    skip: offset,
    orderBy,
    include: eventIncludes,
  });

  return {
    count: events.length,
    rows: events.map(event => ({
      ...event,
      recurrings: mapRecurringsExternal(event.recurrings)
    }))
  };
};

export const findEvent = async (id: number) => {
  let event = await prisma.event.findUnique({
    where: {
      id
    },
    include: eventIncludes
  });

  return {
    ...event,
    recurrings: mapRecurringsExternal(event.recurrings)
  };
};

// Guests
export const createOrDeleteGuest = async (eventId: number, user: any) => {
  const event = await findEvent(eventId);

  const userIsAttending = event.guests.some(guest => guest.id === user.id);

  if (userIsAttending) {
    return await prisma.event.update({
      where: {
        id: event.id
      },
      data: {
        guests: {
          disconnect: [{
            id: user.id
          }]
        }
      },
      include: eventIncludes
    });
  } else {
    return await prisma.event.update({
      where: {
        id: event.id
      },
      data: {
        guests: {
          connect: {
            id: user.id
          }
        }
      },
      include: eventIncludes
    });
  }
};

// Role Slots
export const updateRoleSlot = async (eventId: number, roleSlotId: number, user: any) => {
  const event = await findEvent(eventId);

  const newRoleSlots = event.roleSlots;

  if (newRoleSlots[roleSlotId].isOpen) {
    newRoleSlots[roleSlotId] = {
      ...newRoleSlots[roleSlotId],
      isOpen: false,
      guest: {
        id: user.id,
        displayName: user.displayName,
        photoUrl: user.photoUrl
      }
    };

    return await prisma.event.update({
      where: {
        id: event.id
      },
      data: {
        roleSlots: newRoleSlots
      },
      include: eventIncludes
    });
  } else {
    if (newRoleSlots[roleSlotId].guest && newRoleSlots[roleSlotId].guest.id === user.id) {
      newRoleSlots[roleSlotId] = {
        ...newRoleSlots[roleSlotId],
        isOpen: true,
        guest: null
      };

      return await prisma.event.update({
        where: {
          id: event.id
        },
        data: {
          roleSlots: newRoleSlots
        },
        include: eventIncludes
      });
    }
  }
};

// Comments
export const createComment = async (eventId: number, user: any, comment: any) => {
  return await prisma.event.update({
    where: {
      id: eventId
    },
    data: {
      comments: {
        create: [{
          ...comment,
          user: {
            connect: {
              id: user.id
            }
          }
        }]
      }
    },
    include: eventIncludes
  });
};

export const deleteComment = async (eventId: number, commentId: number) => {
  return await prisma.event.update({
    where: {
      id: eventId
    },
    data: {
      comments: {
        delete: {
          id: commentId
        }
      }
    },
    include: eventIncludes
  });
};

export const findComment = async (id: number) => {
  return await prisma.comment.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });
};
