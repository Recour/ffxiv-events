import express from 'express';
import { createComment, createEvent, createOrDeleteGuest, deleteComment, deleteEventBackgroundImage, destroyEvent, findAndCountEvents, findComment, findEvent, findUser, updateEvent, updateRoleSlot } from '../../prisma';
import multer from "multer";
import multerS3 from 'multer-s3'
import { s3 } from '../../aws';
import * as dotenv from 'dotenv';

dotenv.config();

interface MulterRequest extends Request {
  file: any;
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: process.env.S3_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, file.originalname + Date.now()); //use Date.now() for unique file keys
    }
  }),
  limits: { fileSize: 10485760 }, // 10 MB
}).single("backgroundImageFile");

const router = express.Router();

// User
router.get('/user', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await findUser((req.user as any).id);
    res.json(user);
  } else {
    res.json(null);
  }
});

// Events
router.post('/events', upload, async (req: any, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    const event = req.body;
    const file = (req as unknown as MulterRequest).file;
    const userIsHost = event.hostId && parseInt(event.hostId) === user.id;

    event.comingSoon = JSON.parse(event.comingSoon);
    event.recurrings = JSON.parse(event.recurrings);
    event.ward = parseInt(event.ward);
    event.plot = parseInt(event.plot);
    event.minIlvl = parseInt(event.minIlvl);
    event.roleSlots = JSON.parse(event.roleSlots);
    event.adultOnly = JSON.parse(event.adultOnly);
    event.genres = JSON.parse(event.genres);
    event.treasureMaps = JSON.parse(event.treasureMaps);

    // When the backgroundImage is null, the frontend will send null as string because it's form data. In that case, parse the null string as JSON.
    if (event.backgroundImage === "null") {
      event.backgroundImage = JSON.parse(event.backgroundImage);
    }

    if (file) {
      if (userIsHost && event.backgroundImage) {
        // Background image is being updated, so delete the old background image.
        await deleteEventBackgroundImage(event);
      }

      event.backgroundImage = file.location;
    }

    if (event.id) {
      if (userIsHost) {
        const updatedEvent = await updateEvent(event);

        res.json(updatedEvent);
      } else {
        res.status(401);
      }
    } else {
      const ids = await createEvent(event, user);

      res.json(ids[0]);
    }
  } else {
    res.status(401)
  }
});

router.delete('/events', async (req, res, next) => {
  const { id } = req.query;

  if (id && typeof id === 'string') {
    if (req.isAuthenticated()) {
      const user = req.user as any;

      const eventToDelete = await findEvent(parseInt(id));

      if (eventToDelete.host.id === user.id) {
        const result = await destroyEvent(parseInt(id));

        res.json(result);
      } else {
        throw new Error(`Only an event host can delete the event. User: ${user.id}, event: ${id}`);
      }
    } else {
      res.status(401)
    }
  } else {
    throw new Error(`Unable to delete an event without an id: ${id}`);
  }
});

router.get('/events', async (req, res, next) => {
  const { id } = req.query;

  if (id && typeof id === 'string') {
    const event = await findEvent(parseInt(id));

    if (event) {
      res.json(event);
    } else {
      res.json(null);
    }
  } else {
    const { limit, offset, order, direction, filters, live, future, attending, recurringFilters } = req.query;
    const user = req.user;
    const limitAsNumber = parseInt(limit as string);
    const offsetAsNumber = parseInt(offset as string);
    const filtersAsJson = JSON.parse(filters as string);
    const liveAsJson = JSON.parse(live as string);
    const futureAsJson = JSON.parse(future as string);
    const attendingAsJson = JSON.parse(attending as string);
    const recurringFiltersAsJson = JSON.parse(recurringFilters as string);

    // User needs to be present to get attending events.
    if (attendingAsJson && !req.isAuthenticated()) {
      throw new Error("Can't get attending events for unauthenticated user.");
    }

    const result = await findAndCountEvents(
      user,
      limitAsNumber,
      offsetAsNumber,
      order,
      direction,
      filtersAsJson,
      liveAsJson,
      futureAsJson,
      attendingAsJson,
      recurringFiltersAsJson
    );

    res.json(result);
  }
});

// Guests
router.post('/guests', async (req, res, next) => {
  const { id } = req.query;

  if (id && typeof id === 'string') {
    if (req.isAuthenticated()) {
      const user = req.user as any;

      try {
        const updatedEvent = await createOrDeleteGuest(parseInt(id), user);

        if (updatedEvent) {
          res.status(200).json(updatedEvent);
        } else {
          res.status(400).json(null);
        }
      } catch (error) {
        res.send(error);
      }
    } else {
      res.status(401);
    }
  } else {
    throw new Error(`Unable to create a guest without an id: ${id}`);
  }
});

// Role Slots
// Guests
router.post('/roleslots', async (req, res, next) => {
  const { eventId, roleSlotId } = req.query;

  if (eventId && typeof eventId === 'string' && roleSlotId && typeof roleSlotId === 'string') {
    if (req.isAuthenticated()) {
      const user = req.user as any;

      try {
        const updatedEvent = await updateRoleSlot(parseInt(eventId), parseInt(roleSlotId), user);

        // if (updatedEvent) {
          // res.status(200).json(updatedEvent);
        // } else {
          res.status(400).json(null);
        // }
      } catch (error) {
        res.send(error);
      }
    } else {
      res.status(401);
    }
  } else {
    throw new Error(`Unable to attend role slot without ids: ${eventId} ${roleSlotId}`);
  }
});


// Comments
router.post('/comment', async (req, res, next) => {
  const { id, comment } = req.query;

  const commentAsJson = JSON.parse(comment as string);

  if (id && typeof id === 'string') {
    if (req.isAuthenticated()) {
      const user = req.user as any;

      try {
        const updatedEvent = await createComment(parseInt(id), user, commentAsJson);

        if (updatedEvent) {
          res.status(200).json(updatedEvent);
        } else {
          res.status(400).json(null);
        }
      } catch (error) {
        res.send(error);
      }
    } else {
      res.status(401);
    }
  } else {
    throw new Error(`Unable to create a comment without an id: ${id}`);
  }
});

router.delete('/comment', async (req, res, next) => {
  const { eventId, commentId } = req.query;


  if (eventId && typeof eventId === 'string' && commentId && typeof commentId === 'string') {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      const event = await findEvent(parseInt(eventId));
      const comment = await findComment(parseInt(commentId));

      if (event.hostId === user.id || comment.userId === user.id) {
        try {
          const updatedEvent = await deleteComment(parseInt(eventId), parseInt(commentId));

          if (updatedEvent) {
            res.status(200).json(updatedEvent);
          } else {
            res.status(400).json(null);
          }
        } catch (error) {
          res.send(error);
        }
      } else {
        res.status(401);
      }
    } else {
      res.status(401);
    }
  } else {
    throw new Error(`Unable to delete a comment without an id: ${eventId}, ${commentId}`);
  }
});

export default router;
