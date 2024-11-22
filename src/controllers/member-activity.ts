import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 } from "uuid";

import { db } from "../connections";

import { authUser } from "../middlewares/auth";

import { createMember, getMembers } from "../services/member";
import {
  createMemberByActivityId,
  deleteMemberActivity,
  getActivityByMemberId,
  getMembersByActivityId,
} from "../services/member_activity";

export const memberActivityController = Router();

memberActivityController.get("/:activityId", (req, res) => {
  (async () => {
    const result = await getMembersByActivityId(db, req.params.activityId);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

memberActivityController.get("/member/:memberId", (req, res) => {
  (async () => {
    const result = await getActivityByMemberId(db, req.params.memberId);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

memberActivityController.post("/:activityId", authUser(), (req, res) => {
  (async () => {
    const rawBody = req.body as string[];
    const body = rawBody.filter((x) => x.trim().length);

    const members = await getMembers(db);
    await Promise.all(
      body.map((x) => {
        if (!members.find((y) => y.discord_name === x)) {
          const data = {
            discord_name: x,
            id: v4(),
            ingame_name: x,
            team: "",
            weapon: "",
          };

          members.push(data);
          return createMember(db, data);
        }

        return null;
      })
    );

    const result = await Promise.all(
      body.map((x) => {
        const data = {
          activity_id: req.params.activityId,
          id: v4(),
          member_id: members.find((y) => y.discord_name === x)?.id || "",
        };

        return createMemberByActivityId(db, data);
      })
    );

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

memberActivityController.delete(
  "/:activityId/:memberId",
  authUser(),
  (req, res) => {
    (async () => {
      const result = await deleteMemberActivity(
        db,
        req.params.activityId,
        req.params.memberId
      );

      res.send(result);
    })().catch((err) => {
      console.trace(err);
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  }
);
