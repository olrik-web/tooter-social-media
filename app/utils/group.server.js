import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";

export async function createGroup({ name, description, privacy, user }) {
  try {
    const db = await connectDb();
    const group = await db.models.Group.create({
      name,
      description,
      privacy,
      createdBy: user,
      members: [user],
    });
    user.groups.push(group);
    await user.save();
    return group;
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
