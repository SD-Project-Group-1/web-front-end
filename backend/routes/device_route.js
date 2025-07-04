const { json, Router } = require("express");
const prisma = require("../config/db");
const { ensureAdminAuth } = require("../helpers/middleware");

const router = Router();
router.use(json());

router.get("/getall", ensureAdminAuth, async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      include: { location: true },
    });
    res.send(devices);
  } catch (err) {
    res.status(500).send("Failed to get devices.");
    console.error(err);
  }
});

router.get("/get/:deviceId", ensureAdminAuth, async (req, res) => {
  const deviceId = parseInt(req.params.deviceId);

  if (!deviceId) {
    res.status(400).send("Bad Request.");
    return;
  }

  try {
    const device = await prisma.device.findUnique({
      where: { device_id: deviceId },
      include: { location: true },
    });

    if (!device) {
      res.status(400).send("Device not found.");
      return;
    }
  } catch (err) {
    res.status(500).send("Error getting device.");
  }
});

router.post("/create", ensureAdminAuth, async (req, res) => {
  const { brand, serial_number, location_id } = req.body;

  if (!serial_number || !location_id) {
    res.status(400).send("Missing required information.");
    return;
  }

  try {
    const device = await prisma.device.create({
      data: { brand, serial_number, location_id },
    });

    res.status(201).send(device);
  } catch (err) {
    res.status(400).send("Could not create device.");
    console.error(err);
  }
});

router.delete("/delete/:deviceId", ensureAdminAuth, async (req, res) => {
  const deviceId = parseInt(req.params.deviceId);

  if (!deviceId) {
    res.status(400).send("Bad request.");
    return;
  }

  try {
    await prisma.device.delete({
      where: { device_id: deviceId },
    });
    res.send("Device deleted!");
  } catch (err) {
    res.status(500).send("Failed to delete device.");
    console.error(err);
  }
});

router.get("/available", async (req, res) => {
  try {
    const availableDevices = await prisma.device.findMany({
      where: {
        status: "Available" 
      },
      select: {
        device_id: true,
        brand: true,
        serial_number: true
      }
    });

    res.json(availableDevices);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching available devices.");
  }
});


module.exports = router;

