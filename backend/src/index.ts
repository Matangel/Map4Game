import express from "express";
import path from "path";
import cors from "cors";
import Realm from "realm";
import {WebSocketServer} from "ws"
import {Marker,Position} from "./types/marker.type";
import { UpdateMode } from "realm";
import config from "./config";

const app: express.Express = express();
const wss = new WebSocketServer({ port: config.ws.port });
console.log(`WebSocket Server started on port ${config.ws.port}`);
const realm = Realm.open({
  schema: [Marker, Position],
  path: 'assets/db/marker.realm'
}).then((realm) => {
  
    const markers = realm.objects<Marker>("Marker");
    wss.on("connection", (ws) => {
        ws.send(JSON.stringify(markers));
    });
    markers.addListener((markers, changes) => {
        wss.clients.forEach((client) => {
            client.send(JSON.stringify(markers));
        });
    });
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.post("/saveMarker", async (req, res) => {
    try {
      realm.write(() => {
        delete req.body._id;
        realm.create("Marker", req.body);
      });
      res.send(req.body);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  app.post("/updateMarker", async (req, res) => {
    try {
      const marker = req.body;
      marker._id = new Realm.BSON.ObjectId(marker._id);
      realm.write(() => {
        realm.create(
          "Marker",
          marker,
          UpdateMode.Modified
        );
      });
      res.send(req.body);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  app.post("/deleteMarker", async (req, res) => {
    try {
      realm.write(() => {
        realm.delete(
          realm.objectForPrimaryKey(
            "Marker",
            new Realm.BSON.ObjectId(req.body._id)
          )
        );
      });
      res.send(req.body);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  app.get("/markers", async (req, res) => {
    try {
      const markers = realm.objects<Marker>("Marker");
      res.send(markers);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

  app.use("/tiles", express.static(path.resolve(__dirname, "../assets/tiles")));

  app.listen(config.http.port, () => console.log(`Server running on port ${config.http.port}`));
});