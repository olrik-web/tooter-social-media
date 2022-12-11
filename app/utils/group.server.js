import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";

// This function creates a group document in the database and returns the group document.
export async function createGroup({ name, description, privacy, user, members }) {
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

// This function updates a group document in the database and returns the group document.
export async function editGroup({ groupId, name, description, privacy, user, memberUsernames }) {
  try {
    const db = await connectDb();
    const group = await db.models.Group.findById(groupId);
    if (!group) {
      return json({ error: "Group not found" }, { status: 404 });
    }
    if (group.createdBy.toString() !== user._id.toString()) {
      return json({ error: "You are not authorized to edit this group" }, { status: 403 });
    }
    // Check if the members are valid
    const validMembers = await db.models.User.find({ username: { $in: memberUsernames } });

    // Save the group document
    group.name = name;
    group.description = description;
    group.privacy = privacy;
    group.members = validMembers;
    await group.save();


    return group;
  } catch (error) {
    console.error(error.message);
    return json({ error: error.message }, { status: 500 });
  }
}
