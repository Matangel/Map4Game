import { ObjectSchema } from "realm";

class Position extends Realm.Object<Position> {
  lat!: number;
  lng!: number;
  static schema: ObjectSchema = {
    name: "Position",
    properties: {
      lat: "double",
      lng: "double",
    },
  };
}

class Marker extends Realm.Object<Marker> {
  _id!: number;
  title!: string;
  description?: string;
  color?: string;
  position!: Position;
  static schema: ObjectSchema = {
    name: "Marker",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      title: "string",
      description: "string?",
      color: "string?",
      position: { type: "object", objectType: "Position" },
    },
    primaryKey: "_id",
  };
}

export {Marker, Position};